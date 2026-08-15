import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CouponForm } from "../coupon-form";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: coupon }, { data: categories }, { data: products }] = await Promise.all([
    supabase.from("coupons").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name_bn").order("display_order"),
    supabase.from("products").select("id, name_bn").order("name_bn"),
  ]);

  if (!coupon) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">কুপন সম্পাদনা করুন</h1>
      </div>
      <CouponForm
        coupon={coupon}
        categoryOptions={(categories ?? []).map((c) => ({ value: c.id, label: c.name_bn }))}
        productOptions={(products ?? []).map((p) => ({ value: p.id, label: p.name_bn }))}
      />
    </div>
  );
}
