import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ReviewRowActions } from "./review-row-actions";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, product:products(name_bn, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">রিভিউ</h1>
        <p className="text-sm text-foreground/60">কাস্টমারের প্রোডাক্ট রিভিউ দেখুন ও অনুমোদন করুন</p>
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <Star className="mx-auto mb-2 size-8 text-foreground/30" />
          এখনো কোনো রিভিউ আসেনি।
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{r.customer_name}</p>
                  <p className="text-xs text-foreground/50">{r.product?.name_bn ?? "প্রোডাক্ট মুছে ফেলা হয়েছে"}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={i < r.rating ? "size-3.5 fill-accent-500 text-accent-500" : "size-3.5 text-border"}
                      />
                    ))}
                  </div>
                  {r.comment && <p className="mt-2 max-w-xl text-sm text-foreground/70">{r.comment}</p>}
                  {r.is_verified_purchase && (
                    <span className="mt-2 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                      ✓ যাচাইকৃত ক্রয়
                    </span>
                  )}
                  <p className="mt-1 text-xs text-foreground/40">
                    {new Date(r.created_at).toLocaleDateString("bn-BD")}
                  </p>
                </div>
                <ReviewRowActions id={r.id} isApproved={r.is_approved} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
