"use client";

import { useState, useTransition } from "react";
import { PackageSearch, CheckCircle2, Circle } from "lucide-react";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackOrder, type TrackedOrder } from "@/lib/actions/track-order";
import { orderStatusLabels, paymentMethodLabels, paymentStatusLabels } from "@/lib/order-status";
import { formatBDT } from "@/lib/pricing";

const statusFlow = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await trackOrder(orderNumber, phone);
      setOrder(result);
      setSearched(true);
    });
  };

  const currentStepIndex = order ? statusFlow.indexOf(order.status) : -1;
  const isCancelled = order?.status === "cancelled" || order?.status === "returned";

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <PackageSearch className="mx-auto mb-3 size-10 text-primary-600" />
        <h1 className="text-xl font-semibold text-foreground">অর্ডার ট্র্যাক করুন</h1>
        <p className="mt-1 text-sm text-foreground/60">অর্ডার নম্বর ও ফোন নম্বর দিয়ে অর্ডারের অবস্থা দেখুন</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <div>
          <FieldLabel>অর্ডার নম্বর</FieldLabel>
          <Input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="TB-000123" required />
        </div>
        <div>
          <FieldLabel>ফোন নম্বর</FieldLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
        </div>
        <Button type="submit" loading={pending} className="w-full">
          অর্ডার খুঁজুন
        </Button>
      </form>

      {searched && !order && (
        <p className="mt-5 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">
          দুঃখিত, এই তথ্য দিয়ে কোনো অর্ডার পাওয়া যায়নি। অর্ডার নম্বর ও ফোন নম্বর ঠিক আছে কিনা যাচাই করুন।
        </p>
      )}

      {order && (
        <div className="mt-5 space-y-4 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">অর্ডার #{order.order_number}</p>
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
              {orderStatusLabels[order.status] ?? order.status}
            </span>
          </div>

          {!isCancelled && (
            <div className="flex items-center justify-between">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : i <= currentStepIndex ? "bg-primary-500" : "bg-border"}`} />
                    {i <= currentStepIndex ? (
                      <CheckCircle2 className="size-4 shrink-0 text-primary-600" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-border" />
                    )}
                    <div className={`h-0.5 flex-1 ${i === statusFlow.length - 1 ? "invisible" : i < currentStepIndex ? "bg-primary-500" : "bg-border"}`} />
                  </div>
                  <span className="mt-1 text-center text-[10px] text-foreground/50">{orderStatusLabels[s]}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>পেমেন্ট পদ্ধতি</span>
              <span>{paymentMethodLabels[order.payment_method] ?? order.payment_method}</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>পেমেন্ট অবস্থা</span>
              <span>{paymentStatusLabels[order.payment_status] ?? order.payment_status}</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>ঠিকানা</span>
              <span className="text-right">{order.full_address}, {order.district}</span>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="mb-2 text-sm font-medium text-foreground">প্রোডাক্ট</p>
            <ul className="space-y-1.5 text-sm text-foreground/70">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {item.product_name} {item.variant_name && `(${item.variant_name})`} × {item.quantity}
                  </span>
                  <span>{formatBDT(item.line_total)}</span>
                </li>
              ))}
            </ul>
            {order.discount_amount > 0 && (
              <div className="mt-1 flex justify-between text-sm text-primary-700">
                <span>কুপন ছাড়</span>
                <span>-{formatBDT(order.discount_amount)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold text-foreground">
              <span>সর্বমোট</span>
              <span>{formatBDT(order.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
