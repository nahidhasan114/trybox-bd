import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/pricing";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/order-status";

const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string; page?: string }>;
}) {
  const { q = "", status = "", payment = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, customer_name, customer_phone, total_amount, payment_method, payment_status, status, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q.trim()) {
    const safe = q.trim().replace(/[,()%*]/g, " ").trim();
    query = query.or(`order_number.ilike.%${safe}%,customer_phone.ilike.%${safe}%,customer_name.ilike.%${safe}%`);
  }
  if (status) query = query.eq("status", status);
  if (payment) query = query.eq("payment_method", payment);

  const { data: orders, count } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">অর্ডার</h1>
        <p className="text-sm text-foreground/60">মোট {count ?? 0}টি অর্ডার</p>
      </div>

      <form className="flex flex-wrap gap-3" action="/admin/orders" method="get">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <Input name="q" defaultValue={q} placeholder="অর্ডার নম্বর, ফোন বা নাম দিয়ে খুঁজুন" className="pl-10" />
        </div>
        <select name="status" defaultValue={status} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm">
          <option value="">সব স্ট্যাটাস</option>
          {Object.entries(orderStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="payment" defaultValue={payment} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm">
          <option value="">সব পেমেন্ট</option>
          {Object.entries(paymentMethodLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          খুঁজুন
        </Button>
      </form>

      {!orders || orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <ShoppingBag className="mx-auto mb-2 size-8 text-foreground/30" />
          কোনো অর্ডার পাওয়া যায়নি।
        </div>
      ) : (
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
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                      {orderStatusLabels[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/50">
                    {new Date(o.created_at).toLocaleDateString("bn-BD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/admin/orders?page=${i + 1}${q ? `&q=${q}` : ""}${status ? `&status=${status}` : ""}`}
              className={`flex size-9 items-center justify-center rounded-lg text-sm ${
                currentPage === i + 1 ? "bg-primary-600 text-white" : "border border-border text-foreground/60 hover:bg-surface-muted"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
