import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getActiveCategories = cache(async () => {
  const supabase = await createClient();
  const { data, error, status, statusText } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("getActiveCategories failed:", JSON.stringify({ error, status, statusText }));
  }
  return data ?? [];
});

export const debugCategoriesFetch = cache(async () => {
  const supabase = await createClient();
  try {
    const result = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    return JSON.stringify({
      hasData: !!result.data,
      count: result.data?.length ?? 0,
      error: result.error,
      status: result.status,
      statusText: result.statusText,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20),
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
    });
  } catch (e) {
    return JSON.stringify({ thrown: true, message: e instanceof Error ? e.message : String(e) });
  }
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) console.error("getCategoryBySlug failed:", error.message);
  return data;
});

export const getActiveBrands = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("name, slug")
    .eq("is_active", true)
    .order("name");

  if (error) console.error("getActiveBrands failed:", error.message);
  return data ?? [];
});
