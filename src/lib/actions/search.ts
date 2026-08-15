"use server";

import { createClient } from "@/lib/supabase/server";

export type SearchSuggestion = {
  id: string;
  name_bn: string;
  slug: string;
  image: string | null;
};

export async function searchProductSuggestions(query: string): Promise<SearchSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const safe = trimmed.replace(/[,()%*]/g, " ").trim();
  if (safe.length < 2) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name_bn, slug, product_images(image_url, is_main)")
    .eq("status", "active")
    .or(`name_bn.ilike.%${safe}%,name_en.ilike.%${safe}%`)
    .limit(6);

  return (data ?? []).map((p) => ({
    id: p.id,
    name_bn: p.name_bn,
    slug: p.slug,
    image: p.product_images?.find((i) => i.is_main)?.image_url ?? p.product_images?.[0]?.image_url ?? null,
  }));
}
