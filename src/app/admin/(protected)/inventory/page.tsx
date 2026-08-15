import { AlertTriangle, Boxes } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StockAdjust } from "./stock-adjust";

export default async function AdminInventoryPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name_bn, sku, stock_quantity, low_stock_threshold, manage_stock, has_variants, status")
    .eq("manage_stock", true)
    .order("stock_quantity", { ascending: true });

  const lowStock = (products ?? []).filter((p) => p.stock_quantity <= p.low_stock_threshold);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">ইনভেন্টরি</h1>
        <p className="text-sm text-foreground/60">স্টক পর্যবেক্ষণ ও ম্যানুয়াল আপডেট করুন</p>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <AlertTriangle className="size-5 shrink-0" />
          <span>{lowStock.length}টি প্রোডাক্টের স্টক কম আছে — নিচে হাইলাইট করা হয়েছে</span>
        </div>
      )}

      {!products || products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <Boxes className="mx-auto mb-2 size-8 text-foreground/30" />
          স্টক ট্র্যাক করা কোনো প্রোডাক্ট নেই।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
              <tr>
                <th className="px-4 py-3 font-medium">প্রোডাক্ট</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">স্টক</th>
                <th className="px-4 py-3 font-medium">লো স্টক লিমিট</th>
                <th className="px-4 py-3 font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const isLow = p.stock_quantity <= p.low_stock_threshold;
                return (
                  <tr key={p.id} className={isLow ? "bg-amber-50/50" : ""}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{p.name_bn}</p>
                      {p.has_variants && <p className="text-xs text-foreground/40">ভ্যারিয়েন্ট প্রোডাক্ট — মোট স্টক</p>}
                    </td>
                    <td className="px-4 py-3 text-foreground/60">{p.sku || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={isLow ? "font-semibold text-amber-700" : "text-foreground"}>{p.stock_quantity}</span>
                      {p.stock_quantity <= 0 && <span className="ml-1 text-xs text-red-600">(স্টক শেষ)</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground/50">{p.low_stock_threshold}</td>
                    <td className="px-4 py-3">
                      {p.has_variants ? (
                        <span className="text-xs text-foreground/40">প্রোডাক্ট এডিট থেকে পরিবর্তন করুন</span>
                      ) : (
                        <StockAdjust productId={p.id} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
