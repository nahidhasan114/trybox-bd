import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getActiveCategories = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) console.error("getActiveCategories failed:", error.message);
  return data ?? [];
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
