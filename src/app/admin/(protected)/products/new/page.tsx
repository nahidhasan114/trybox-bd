import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: brands }, { data: badges }] = await Promise.all([
    supabase.from("categories").select("id, name_bn").eq("is_active", true).order("display_order"),
    supabase.from("brands").select("id, name").eq("is_active", true).order("name"),
    supabase.from("product_badges").select("id, name_bn, color_hex").eq("is_active", true),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">নতুন প্রোডাক্ট যোগ করুন</h1>
      </div>
      <ProductForm
        categoryOptions={(categories ?? []).map((c) => ({ value: c.id, label: c.name_bn }))}
        brandOptions={(brands ?? []).map((b) => ({ value: b.id, label: b.name }))}
        badges={badges ?? []}
      />
    </div>
  );
}
