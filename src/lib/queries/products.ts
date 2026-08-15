import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/components/storefront/product-card";

const PRODUCT_SELECT =
  "id, name_bn, slug, regular_price, sale_price, sale_starts_at, sale_ends_at, stock_quantity, manage_stock, has_variants, is_featured, is_best_seller, is_new_arrival, is_free_delivery, product_type, sold_count, created_at, product_images(image_url, is_main), product_badge_links(product_badges(name_bn, color_hex))";

type RawProduct = {
  id: string;
  name_bn: string;
  slug: string;
  regular_price: number;
  sale_price: number | null;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  stock_quantity: number;
  manage_stock: boolean;
  has_variants: boolean;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  is_free_delivery?: boolean;
  product_type?: string;
  sold_count?: number;
  created_at?: string;
  product_images: { image_url: string; is_main: boolean }[] | null;
  product_badge_links: { product_badges: { name_bn: string; color_hex: string } | null }[] | null;
};

function toCardData(p: RawProduct): ProductCardData {
  const mainImage = p.product_images?.find((i) => i.is_main) ?? p.product_images?.[0];
  return {
    id: p.id,
    name_bn: p.name_bn,
    slug: p.slug,
    regular_price: p.regular_price,
    sale_price: p.sale_price,
    sale_starts_at: p.sale_starts_at,
    sale_ends_at: p.sale_ends_at,
    stock_quantity: p.stock_quantity,
    manage_stock: p.manage_stock,
    has_variants: p.has_variants,
    image: mainImage?.image_url ?? null,
    badges: (p.product_badge_links ?? [])
      .map((l) => l.product_badges)
      .filter((b): b is { name_bn: string; color_hex: string } => b != null),
  };
}

export async function getHomepageSections() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) console.error("getHomepageSections failed:", error.message);

  const all = ((data as RawProduct[] | null) ?? []).map((p) => ({ raw: p, card: toCardData(p) }));

  const take = (predicate: (p: RawProduct) => boolean, sortBy?: (a: RawProduct, b: RawProduct) => number) =>
    all
      .filter((x) => predicate(x.raw))
      .sort((a, b) => (sortBy ? sortBy(a.raw, b.raw) : 0))
      .slice(0, 8)
      .map((x) => x.card);

  return {
    featured: take((p) => !!p.is_featured),
    bestSellers: take((p) => !!p.is_best_seller, (a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0)),
    newArrivals: take((p) => !!p.is_new_arrival),
    comboOffers: take((p) => p.product_type === "combo"),
    freeDelivery: take((p) => !!p.is_free_delivery),
  };
}

export { PRODUCT_SELECT, toCardData };
export type { RawProduct };
