"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export type VariantFormValues = {
  id?: string;
  variant_name: string;
  sku: string;
  attributes_text: string;
  regular_price: number | null;
  sale_price: number | null;
  stock_quantity: number;
  is_default: boolean;
  is_active: boolean;
  display_order: number;
};

export type ImageFormValues = {
  id?: string;
  image_url: string;
  is_main: boolean;
  display_order: number;
};

export type ProductFormValues = {
  name_bn: string;
  name_en: string;
  slug: string;
  sku: string;
  category_id: string;
  brand_id: string;
  product_type: string;
  status: string;
  regular_price: number;
  sale_price: number | null;
  cost_price: number | null;
  manage_stock: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  weight_grams: number;
  has_variants: boolean;
  is_free_delivery: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_customizable: boolean;
  customization_options_text: string;
  customization_pick_count: number;
  customization_instructions: string;
  sale_starts_at: string;
  sale_ends_at: string;
  short_description_bn: string;
  short_description_en: string;
  description_bn: string;
  description_en: string;
  video_url: string;
  seo_title: string;
  seo_description: string;
  badge_ids: string[];
  variants: VariantFormValues[];
  images: ImageFormValues[];
};

function parseAttributes(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  text
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [key, ...rest] = pair.split(":");
      if (key && rest.length) result[key.trim()] = rest.join(":").trim();
    });
  return result;
}

function toDateOrNull(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function computeStock(values: ProductFormValues) {
  if (values.has_variants) {
    return values.variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
  }
  return Number(values.stock_quantity) || 0;
}

async function saveChildren(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  values: ProductFormValues,
) {
  await supabase.from("product_variants").delete().eq("product_id", productId);
  if (values.has_variants && values.variants.length > 0) {
    const rows = values.variants.map((v, idx) => ({
      product_id: productId,
      variant_name: v.variant_name,
      sku: v.sku || null,
      attributes: parseAttributes(v.attributes_text),
      regular_price: v.regular_price ?? null,
      sale_price: v.sale_price ?? null,
      stock_quantity: Number(v.stock_quantity) || 0,
      is_default: v.is_default,
      is_active: v.is_active,
      display_order: idx,
    }));
    const { error } = await supabase.from("product_variants").insert(rows);
    if (error) throw error;
  }

  await supabase.from("product_images").delete().eq("product_id", productId);
  if (values.images.length > 0) {
    const rows = values.images.map((img, idx) => ({
      product_id: productId,
      image_url: img.image_url,
      is_main: img.is_main,
      display_order: idx,
    }));
    const { error } = await supabase.from("product_images").insert(rows);
    if (error) throw error;
  }

  await supabase.from("product_videos").delete().eq("product_id", productId);
  if (values.video_url.trim()) {
    const { error } = await supabase.from("product_videos").insert({
      product_id: productId,
      video_type: "youtube",
      video_url: values.video_url.trim(),
      display_order: 0,
    });
    if (error) throw error;
  }

  await supabase.from("product_badge_links").delete().eq("product_id", productId);
  if (values.badge_ids.length > 0) {
    const rows = values.badge_ids.map((badge_id) => ({ product_id: productId, badge_id }));
    const { error } = await supabase.from("product_badge_links").insert(rows);
    if (error) throw error;
  }
}

function toProductRow(values: ProductFormValues, slug: string) {
  return {
    name_bn: values.name_bn,
    name_en: values.name_en || null,
    slug,
    sku: values.sku || null,
    category_id: values.category_id || null,
    brand_id: values.brand_id || null,
    product_type: values.product_type,
    status: values.status,
    regular_price: Number(values.regular_price) || 0,
    sale_price: values.sale_price == null || Number.isNaN(values.sale_price) ? null : Number(values.sale_price),
    cost_price: values.cost_price == null || Number.isNaN(values.cost_price) ? null : Number(values.cost_price),
    manage_stock: values.manage_stock,
    stock_quantity: computeStock(values),
    low_stock_threshold: Number(values.low_stock_threshold) || 5,
    weight_grams: Number(values.weight_grams) || 500,
    has_variants: values.has_variants,
    is_free_delivery: values.is_free_delivery,
    is_featured: values.is_featured,
    is_best_seller: values.is_best_seller,
    is_new_arrival: values.is_new_arrival,
    is_customizable: values.is_customizable,
    customization_options: values.customization_options_text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    customization_pick_count: Number(values.customization_pick_count) || 0,
    customization_instructions: values.customization_instructions || null,
    sale_starts_at: toDateOrNull(values.sale_starts_at),
    sale_ends_at: toDateOrNull(values.sale_ends_at),
    short_description_bn: values.short_description_bn || null,
    short_description_en: values.short_description_en || null,
    description_bn: values.description_bn || null,
    description_en: values.description_en || null,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
  };
}

export async function createProduct(values: ProductFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (!values.name_bn.trim()) throw new Error("প্রোডাক্টের নাম আবশ্যক");

  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "products", values.slug || values.name_en || values.name_bn);

  const { data: product, error } = await supabase
    .from("products")
    .insert(toProductRow(values, slug))
    .select("id")
    .single();
  if (error) throw error;

  await saveChildren(supabase, product.id, values);

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "product_created",
    entity_type: "products",
    entity_id: product.id,
    details: { name: values.name_bn },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const slug = await generateUniqueSlug(
    supabase,
    "products",
    values.slug || values.name_en || values.name_bn,
    id,
  );

  const { error } = await supabase.from("products").update(toProductRow(values, slug)).eq("id", id);
  if (error) throw error;

  await saveChildren(supabase, id, values);

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "product_updated",
    entity_type: "products",
    entity_id: id,
    details: { name: values.name_bn },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "product_deleted",
    entity_type: "products",
    entity_id: id,
  });

  revalidatePath("/admin/products");
}

export async function updateProductStatus(id: string, status: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/products");
}
