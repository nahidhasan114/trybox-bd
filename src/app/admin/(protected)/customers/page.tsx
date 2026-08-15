import Link from "next/link";
import { Users, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/pricing";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("customers")
    .select("id, full_name, phone, email, created_at, orders(total_amount)")
    .order("created_at", { ascending: false });

  if (q.trim()) {
    const safe = q.trim().replace(/[,()%*]/g, " ").trim();
    query = query.or(`full_name.ilike.%${safe}%,phone.ilike.%${safe}%`);
  }

  const { data: customers } = await query;

  const rows = (customers ?? []).map((c) => ({
    ...c,
    orderCount: c.orders?.length ?? 0,
    totalSpent: (c.orders ?? []).reduce((sum, o) => sum + Number(o.total_amount), 0),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">কাস্টমার</h1>
        <p className="text-sm text-foreground/60">মোট {rows.length} জন কাস্টমার</p>
      </div>

      <form className="flex flex-wrap gap-3" action="/admin/customers" method="get">
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <Input name="q" defaultValue={q} placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন" className="pl-10" />
        </div>
        <Button type="submit" variant="secondary">
          খুঁজুন
        </Button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <Users className="mx-auto mb-2 size-8 text-foreground/30" />
          এখনো কোনো কাস্টমার অর্ডার করেননি।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
              <tr>
                <th className="px-4 py-3 font-medium">নাম</th>
                <th className="px-4 py-3 font-medium">ফোন</th>
                <th className="px-4 py-3 font-medium">ইমেইল</th>
                <th className="px-4 py-3 font-medium">মোট অর্ডার</th>
                <th className="px-4 py-3 font-medium">মোট খরচ</th>
                <th className="px-4 py-3 font-medium">যোগদান</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3 text-foreground">{c.full_name}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders?q=${c.phone}`} className="text-primary-700 hover:underline">
                      {c.phone}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground/60">{c.email || "—"}</td>
                  <td className="px-4 py-3 text-foreground/70">{c.orderCount}টি</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatBDT(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-xs text-foreground/50">
                    {new Date(c.created_at).toLocaleDateString("bn-BD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
