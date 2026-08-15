import { BarChart3, Package, ShoppingBag, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatBDT } from "@/lib/pricing";
import { orderStatusLabels } from "@/lib/order-status";

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs text-foreground/50">{label}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const [{ data: orders }, { data: topProducts }] = await Promise.all([
    supabase.from("orders").select("total_amount, status, created_at"),
    supabase
      .from("products")
      .select("id, name_bn, sold_count")
      .order("sold_count", { ascending: false })
      .limit(10),
  ]);

  const rows = orders ?? [];
  const validRows = rows.filter((o) => o.status !== "cancelled" && o.status !== "returned");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const sumSince = (since: Date) =>
    validRows.filter((o) => new Date(o.created_at) >= since).reduce((sum, o) => sum + Number(o.total_amount), 0);
  const countSince = (since: Date) => validRows.filter((o) => new Date(o.created_at) >= since).length;

  const todayRevenue = sumSince(todayStart);
  const todayOrders = countSince(todayStart);
  const monthRevenue = sumSince(monthStart);
  const monthOrders = countSince(monthStart);
  const allTimeRevenue = validRows.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const allTimeOrders = validRows.length;
  const pendingOrders = rows.filter((o) => o.status === "pending").length;

  const statusCounts: Record<string, number> = {};
  rows.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  });

  const bestSellers = (topProducts ?? []).filter((p) => p.sold_count > 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">রিপোর্ট</h1>
        <p className="text-sm text-foreground/60">বিক্রি ও পারফরম্যান্স সামারি</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="আজকের বিক্রি" value={formatBDT(todayRevenue)} icon={Wallet} />
        <StatCard label="আজকের অর্ডার" value={`${todayOrders}টি`} icon={ShoppingBag} />
        <StatCard label="এই মাসের বিক্রি" value={formatBDT(monthRevenue)} icon={Wallet} />
        <StatCard label="এই মাসের অর্ডার" value={`${monthOrders}টি`} icon={ShoppingBag} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="সর্বমোট বিক্রি" value={formatBDT(allTimeRevenue)} icon={BarChart3} />
        <StatCard label="সর্বমোট অর্ডার" value={`${allTimeOrders}টি`} icon={Package} />
        <StatCard label="অপেক্ষমান অর্ডার" value={`${pendingOrders}টি`} icon={Package} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium text-foreground">অর্ডার স্ট্যাটাস অনুযায়ী</h2>
          {rows.length === 0 ? (
            <p className="text-sm text-foreground/50">কোনো অর্ডার নেই</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {Object.entries(statusCounts).map(([status, count]) => (
                <li key={status} className="flex justify-between text-foreground/70">
                  <span>{orderStatusLabels[status] ?? status}</span>
                  <span className="font-medium text-foreground">{count}টি</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium text-foreground">সেরা বিক্রিত প্রোডাক্ট</h2>
          {bestSellers.length === 0 ? (
            <p className="text-sm text-foreground/50">এখনো কোনো বিক্রি হয়নি</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {bestSellers.map((p) => (
                <li key={p.id} className="flex justify-between gap-3 text-foreground/70">
                  <span className="line-clamp-1">{p.name_bn}</span>
                  <span className="shrink-0 font-medium text-foreground">{p.sold_count}টি বিক্রি</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
