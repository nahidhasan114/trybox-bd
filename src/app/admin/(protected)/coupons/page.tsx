import Link from "next/link";
import { Plus, TicketPercent } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CouponRowActions } from "./coupon-row-actions";

const typeLabels: Record<string, string> = {
  fixed: "নির্দিষ্ট টাকা",
  percentage: "শতাংশ",
  free_delivery: "ফ্রি ডেলিভারি",
};

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">কুপন</h1>
          <p className="text-sm text-foreground/60">ডিসকাউন্ট কুপন তৈরি ও পরিচালনা করুন</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button>
            <Plus className="size-4" /> নতুন কুপন
          </Button>
        </Link>
      </div>

      {!coupons || coupons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <TicketPercent className="mx-auto mb-2 size-8 text-foreground/30" />
          এখনো কোনো কুপন নেই।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
              <tr>
                <th className="px-4 py-3 font-medium">কোড</th>
                <th className="px-4 py-3 font-medium">ধরন</th>
                <th className="px-4 py-3 font-medium">মূল্য</th>
                <th className="px-4 py-3 font-medium">মেয়াদ</th>
                <th className="px-4 py-3 font-medium">স্ট্যাটাস</th>
                <th className="px-4 py-3 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{c.code}</td>
                  <td className="px-4 py-3 text-foreground/70">{typeLabels[c.discount_type] ?? c.discount_type}</td>
                  <td className="px-4 py-3 text-foreground/70">
                    {c.discount_type === "percentage" && `${c.discount_value}%`}
                    {c.discount_type === "fixed" && `৳${c.discount_value}`}
                    {c.discount_type === "free_delivery" && "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/50">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString("bn-BD") : "কোনো মেয়াদ নেই"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={c.is_active ? "rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700" : "rounded-full bg-surface-muted px-2 py-0.5 text-xs text-foreground/50"}>
                      {c.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <CouponRowActions id={c.id} isActive={c.is_active} />
                    </div>
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
