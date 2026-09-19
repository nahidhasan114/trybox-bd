"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatBDT } from "@/lib/pricing";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/order-status";
import { updateOrderStatus } from "./actions";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
};

const actions = [
  { value: "confirmed", label: "নিশ্চিত করুন" },
  { value: "delivered", label: "ডেলিভারি সম্পন্ন" },
  { value: "cancelled", label: "বাতিল করুন" },
];

function StatusCell({ order, onChanged }: { order: Order; onChanged: (orderId: string) => void }) {
  const [pending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    if (!newStatus || newStatus === order.status) return;
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, newStatus, "");
        toast.success(`${order.order_number} → ${orderStatusLabels[newStatus]}`);
        onChanged(order.id);
      } catch {
        toast.error("স্ট্যাটাস আপডেট করা যায়নি");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value=""
        disabled={pending}
        onChange={(e) => handleChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground disabled:opacity-50"
      >
        <option value="">{pending ? "আপডেট হচ্ছে..." : orderStatusLabels[order.status] ?? order.status}</option>
        {actions
          .filter((a) => a.value !== order.status)
          .map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const handleChanged = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
        <ShoppingBag className="mx-auto mb-2 size-8 text-foreground/30" />
        কোনো অর্ডার পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
          <tr>
            <th className="px-4 py-3 font-medium">অর্ডার</th>
            <th className="px-4 py-3 font-medium">কাস্টমার</th>
            <th className="px-4 py-3 font-medium">মোট</th>
            <th className="px-4 py-3 font-medium">পেমেন্ট</th>
            <th className="px-4 py-3 font-medium">স্ট্যাটাস</th>
            <th className="px-4 py-3 font-medium">তারিখ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-surface-muted/50">
              <td className="px-4 py-3">
                <Link href={`/admin/orders/${o.id}`} className="font-medium text-primary-700 hover:underline">
                  {o.order_number}
                </Link>
              </td>
              <td className="px-4 py-3">
                <p className="text-foreground">{o.customer_name}</p>
                <p className="text-xs text-foreground/50">{o.customer_phone}</p>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{formatBDT(o.total_amount)}</td>
              <td className="px-4 py-3 text-foreground/70">
                {paymentMethodLabels[o.payment_method] ?? o.payment_method}
                {o.payment_status === "paid" && <span className="ml-1 text-xs text-primary-600">✓ পরিশোধিত</span>}
              </td>
              <td className="px-4 py-3">
                <StatusCell order={o} onChanged={handleChanged} />
              </td>
              <td className="px-4 py-3 text-xs text-foreground/50">
                {new Date(o.created_at).toLocaleDateString("bn-BD")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
