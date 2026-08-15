"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchSimilarProducts(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  // strip characters that have special meaning in PostgREST filter syntax
  const safe = trimmed.replace(/[,()%*]/g, " ").trim();
  if (safe.length < 2) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name_bn, name_en, sku, status")
    .or(`name_bn.ilike.%${safe}%,name_en.ilike.%${safe}%`)
    .limit(5);

  return data ?? [];
}
