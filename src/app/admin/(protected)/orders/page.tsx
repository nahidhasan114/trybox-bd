import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/order-status";
import { OrdersTable } from "./orders-table";

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

      <OrdersTable orders={orders ?? []} />

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
