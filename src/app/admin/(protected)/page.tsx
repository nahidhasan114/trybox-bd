import { createClient } from "@/lib/supabase/server";
import { Package, ShoppingBag, AlertTriangle, Clock } from "lucide-react";

async function getStats() {
  const supabase = await createClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [{ count: todayOrders }, { count: pendingOrders }, { count: totalProducts }, { count: lowStock }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString()),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .lte("stock_quantity", 5)
        .eq("manage_stock", true),
    ]);

  return {
    todayOrders: todayOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    totalProducts: totalProducts ?? 0,
    lowStock: lowStock ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "আজকের অর্ডার", value: stats.todayOrders, icon: ShoppingBag, color: "text-primary-600 bg-primary-50" },
    { label: "পেন্ডিং অর্ডার", value: stats.pendingOrders, icon: Clock, color: "text-accent-600 bg-accent-50" },
    { label: "মোট প্রোডাক্ট", value: stats.totalProducts, icon: Package, color: "text-primary-600 bg-primary-50" },
    { label: "লো স্টক প্রোডাক্ট", value: stats.lowStock, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">ড্যাশবোর্ড</h1>
        <p className="text-sm text-foreground/60">TryBox BD অ্যাডমিন প্যানেলে স্বাগতম</p>
      </div>

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

      {stats.totalProducts === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center text-sm text-foreground/60">
          এখনো কোনো প্রোডাক্ট যোগ করা হয়নি। &quot;প্রোডাক্ট&quot; মেনু থেকে প্রথম প্রোডাক্ট যোগ করুন।
        </div>
      )}
    </div>
  );
}
