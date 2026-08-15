import { createClient } from "@/lib/supabase/server";
import { PRODUCT_SELECT, toCardData, type RawProduct } from "./products";
import type { ProductCardData } from "@/components/storefront/product-card";

export type ListingFilters = {
  category?: string;
  brand?: string;
  q?: string;
  sort?: string;
  type?: string;
  badge?: string;
  best?: string;
  new?: string;
  featured?: string;
  free_delivery?: string;
  offer?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

const PAGE_SIZE = 20;

export async function getProductListing(filters: ListingFilters): Promise<{
  products: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, Number(filters.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("status", "active");

  if (filters.category) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", filters.category).maybeSingle();
    if (cat) query = query.eq("category_id", cat.id);
    else return { products: [], total: 0, page, pageSize: PAGE_SIZE };
  }

  if (filters.brand) {
    const { data: brand } = await supabase.from("brands").select("id").eq("slug", filters.brand).maybeSingle();
    if (brand) query = query.eq("brand_id", brand.id);
    else return { products: [], total: 0, page, pageSize: PAGE_SIZE };
  }

  if (filters.q?.trim()) {
    const safe = filters.q.trim().replace(/[,()%*]/g, " ").trim();
    if (safe) query = query.or(`name_bn.ilike.%${safe}%,name_en.ilike.%${safe}%,sku.ilike.%${safe}%`);
  }

  if (filters.badge) {
    const { data: links } = await supabase.from("product_badge_links").select("product_id").eq("badge_id", filters.badge);
    const ids = (links ?? []).map((l) => l.product_id);
    if (ids.length === 0) return { products: [], total: 0, page, pageSize: PAGE_SIZE };
    query = query.in("id", ids);
  }

  if (filters.type) query = query.eq("product_type", filters.type);
  if (filters.best === "1") query = query.eq("is_best_seller", true);
  if (filters.new === "1") query = query.eq("is_new_arrival", true);
  if (filters.featured === "1") query = query.eq("is_featured", true);
  if (filters.free_delivery === "1") query = query.eq("is_free_delivery", true);
  if (filters.offer === "1") query = query.not("sale_price", "is", null);
  if (filters.minPrice) query = query.gte("regular_price", Number(filters.minPrice));
  if (filters.maxPrice) query = query.lte("regular_price", Number(filters.maxPrice));

  switch (filters.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price_low":
      query = query.order("regular_price", { ascending: true });
      break;
    case "price_high":
      query = query.order("regular_price", { ascending: false });
      break;
    case "best_selling":
      query = query.order("sold_count", { ascending: false });
      break;
    default:
      query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, count } = await query;
  let products = ((data as RawProduct[] | null) ?? []).map(toCardData);

  if (filters.sort === "discount") {
    products = products
      .slice()
      .sort((a, b) => {
        const da = a.sale_price ? Math.round(((a.regular_price - a.sale_price) / a.regular_price) * 100) : 0;
        const db = b.sale_price ? Math.round(((b.regular_price - b.sale_price) / b.regular_price) * 100) : 0;
        return db - da;
      });
  }

  return { products, total: count ?? 0, page, pageSize: PAGE_SIZE };
}
