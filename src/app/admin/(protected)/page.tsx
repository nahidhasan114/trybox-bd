import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import { formatBDT } from "@/lib/pricing";
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  CalendarDays,
} from "lucide-react";
import { MonthlyStatsTable, type MonthRow } from "./monthly-stats-table";

const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;
const STATS_START_MONTH = "2026-09-01";

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("bn-BD", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function dhakaNow() {
  const now = new Date(Date.now() + DHAKA_OFFSET_MS);
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  return {
    todayStart: new Date(Date.UTC(y, m, d) - DHAKA_OFFSET_MS),
    currentMonthKey: `${y}-${String(m + 1).padStart(2, "0")}-01`,
  };
}

type RawMonth = {
  month: string;
  total_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  revenue: number;
  archived: boolean;
};

async function getMonthly(supabase: Awaited<ReturnType<typeof createClient>>): Promise<{ months: RawMonth[]; rpcReady: boolean }> {
  const { data, error } = await supabase.rpc("get_monthly_order_stats");
  if (!error && data) return { months: data as RawMonth[], rpcReady: true };

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, status, total_amount")
    .gte("created_at", new Date(new Date(STATS_START_MONTH).getTime() - DHAKA_OFFSET_MS).toISOString())
    .limit(1000);

  const map = new Map<string, RawMonth>();
  for (const o of orders ?? []) {
    const d = new Date(new Date(o.created_at).getTime() + DHAKA_OFFSET_MS);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
    const row = map.get(key) ?? {
      month: key,
      total_orders: 0,
      delivered_orders: 0,
      cancelled_orders: 0,
      revenue: 0,
      archived: false,
    };
    row.total_orders += 1;
    if (o.status === "delivered") {
      row.delivered_orders += 1;
      row.revenue += Number(o.total_amount);
    }
    if (o.status === "cancelled") row.cancelled_orders += 1;
    map.set(key, row);
  }
  return { months: [...map.values()], rpcReady: false };
}

async function getStats() {
  const supabase = await createClient();
  const { todayStart, currentMonthKey } = dhakaNow();

  const [{ count: todayOrders }, { count: pendingOrders }, { count: totalProducts }, { count: lowStock }, monthly] =
    await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .lte("stock_quantity", 5)
        .eq("manage_stock", true),
      getMonthly(supabase),
    ]);

  const byMonth = new Map(monthly.months.filter((m) => m.month >= STATS_START_MONTH).map((m) => [m.month, m]));
  if (!byMonth.has(currentMonthKey)) {
    byMonth.set(currentMonthKey, {
      month: currentMonthKey,
      total_orders: 0,
      delivered_orders: 0,
      cancelled_orders: 0,
      revenue: 0,
      archived: false,
    });
  }

  const rows: MonthRow[] = [...byMonth.values()]
    .sort((a, b) => b.month.localeCompare(a.month))
    .map((m) => ({
      month: m.month,
      label: monthLabel(m.month),
      total: m.total_orders,
      delivered: m.delivered_orders,
      cancelled: m.cancelled_orders,
      revenue: Number(m.revenue),
      archived: m.archived,
      isCurrent: m.month === currentMonthKey,
    }));

  return {
    todayOrders: todayOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    totalProducts: totalProducts ?? 0,
    lowStock: lowStock ?? 0,
    rows,
    current: rows.find((r) => r.isCurrent)!,
    currentLabel: monthLabel(currentMonthKey),
    rpcReady: monthly.rpcReady,
  };
}

export default async function AdminDashboardPage() {
  const [stats, admin] = await Promise.all([getStats(), getCurrentAdmin()]);

  const nowCards = [
    { label: "আজকের অর্ডার", value: stats.todayOrders, icon: ShoppingBag, color: "text-primary-600 bg-primary-50" },
    { label: "পেন্ডিং অর্ডার", value: stats.pendingOrders, icon: Clock, color: "text-accent-600 bg-accent-50" },
    { label: "লো স্টক প্রোডাক্ট", value: stats.lowStock, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "মোট প্রোডাক্ট", value: stats.totalProducts, icon: Package, color: "text-primary-600 bg-primary-50" },
  ];

  const monthCards = [
    { label: "মোট অর্ডার", value: stats.current.total, icon: CalendarDays, color: "text-primary-600 bg-primary-50" },
    { label: "ডেলিভারি সম্পন্ন", value: stats.current.delivered, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "বাতিল", value: stats.current.cancelled, icon: XCircle, color: "text-red-600 bg-red-50" },
    { label: "বিক্রি (ডেলিভারি হওয়া)", value: formatBDT(stats.current.revenue), icon: Wallet, color: "text-primary-600 bg-primary-50" },
  ];

  const renderCards = (cards: typeof nowCards | typeof monthCards) => (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border bg-surface p-4">
          <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl ${c.color}`}>
            <c.icon className="size-5" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{c.value}</p>
          <p className="text-sm text-foreground/60">{c.label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">ড্যাশবোর্ড</h1>
        <p className="text-sm text-foreground/60">TryBox BD অ্যাডমিন প্যানেলে স্বাগতম</p>
      </div>

      {renderCards(nowCards)}

      <div>
        <h2 className="mb-3 font-medium text-foreground">
          এই মাস <span className="text-primary-700">({stats.currentLabel})</span>
        </h2>
        {renderCards(monthCards)}
      </div>

      <div>
        <h2 className="mb-1 font-medium text-foreground">মাসভিত্তিক হিসাব</h2>
        <p className="mb-3 text-xs text-foreground/50">
          মাস বদলালে নতুন মাসের হিসাব নিজে থেকেই শুরু হবে। পুরনো মাসের অর্ডার ডিলিট করলে ডাটাবেজের জায়গা ফাঁকা হবে, তবে মাসের হিসাব থেকে যাবে।
        </p>
        <MonthlyStatsTable rows={stats.rows} canDelete={admin?.role === "owner"} rpcReady={stats.rpcReady} />
      </div>
    </div>
  );
}
