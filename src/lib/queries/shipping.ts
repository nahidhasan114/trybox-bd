import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SHIPPING_TIERS, type ShippingTiers } from "@/lib/shipping-calc";

export const getShippingTiers = cache(async (): Promise<ShippingTiers> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [
      "shipping_tier1_max_grams",
      "shipping_tier1_charge",
      "shipping_tier2_max_grams",
      "shipping_tier2_charge",
      "shipping_tier3_base_charge",
      "shipping_per_kg_charge",
      "shipping_free_min_order",
    ]);

  if (error) console.error("getShippingTiers failed:", error.message);

  const tiers = { ...DEFAULT_SHIPPING_TIERS };
  for (const row of data ?? []) {
    const shortKey = row.key.replace("shipping_", "") as keyof ShippingTiers;
    if (shortKey in tiers) tiers[shortKey] = Number(row.value);
  }
  return tiers;
});

export type { ShippingTiers };
export { calculateWeightShipping } from "@/lib/shipping-calc";
