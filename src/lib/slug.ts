import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function generateUniqueSlug(
  supabase: SupabaseClient<Database>,
  table: "products" | "categories" | "brands",
  base: string,
  excludeId?: string,
): Promise<string> {
  const cleanBase = slugify(base) || `item-${Date.now()}`;
  let candidate = cleanBase;
  let suffix = 2;

  for (let i = 0; i < 50; i++) {
    let query = supabase.from(table).select("id").eq("slug", candidate).limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query;
    if (!data || data.length === 0) return candidate;
    candidate = `${cleanBase}-${suffix}`;
    suffix += 1;
  }

  return `${cleanBase}-${Date.now()}`;
}
