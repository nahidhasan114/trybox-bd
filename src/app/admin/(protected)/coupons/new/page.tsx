import { createClient } from "@/lib/supabase/server";
import { CouponForm } from "../coupon-form";

export default async function NewCouponPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("id, name_bn").order("display_order"),
    supabase.from("products").select("id, name_bn").order("name_bn"),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">নতুন কুপন যোগ করুন</h1>
      </div>
      <CouponForm
        categoryOptions={(categories ?? []).map((c) => ({ value: c.id, label: c.name_bn }))}
        productOptions={(products ?? []).map((p) => ({ value: p.id, label: p.name_bn }))}
      />
    </div>
  );
}
