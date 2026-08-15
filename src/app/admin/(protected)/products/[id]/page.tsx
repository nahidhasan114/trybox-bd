import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: brands }, { data: badges }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "*, variants:product_variants(*), images:product_images(*), videos:product_videos(*), badge_links:product_badge_links(badge_id)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("id, name_bn").eq("is_active", true).order("display_order"),
    supabase.from("brands").select("id, name").eq("is_active", true).order("name"),
    supabase.from("product_badges").select("id, name_bn, color_hex").eq("is_active", true),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">প্রোডাক্ট সম্পাদনা করুন</h1>
      </div>
      <ProductForm
        product={{
          ...product,
          badge_ids: product.badge_links.map((b) => b.badge_id),
        }}
        categoryOptions={(categories ?? []).map((c) => ({ value: c.id, label: c.name_bn }))}
        brandOptions={(brands ?? []).map((b) => ({ value: b.id, label: b.name }))}
        badges={badges ?? []}
      />
    </div>
  );
}
