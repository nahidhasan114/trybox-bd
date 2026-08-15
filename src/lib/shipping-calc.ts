export type ShippingTiers = {
  tier1_max_grams: number;
  tier1_charge: number;
  tier2_max_grams: number;
  tier2_charge: number;
  tier3_base_charge: number;
  per_kg_charge: number;
  free_min_order: number;
};

export const DEFAULT_SHIPPING_TIERS: ShippingTiers = {
  tier1_max_grams: 500,
  tier1_charge: 115,
  tier2_max_grams: 2000,
  tier2_charge: 135,
  tier3_base_charge: 175,
  per_kg_charge: 20,
  free_min_order: 0,
};

export function calculateWeightShipping(totalWeightGrams: number, tiers: ShippingTiers): number {
  if (totalWeightGrams <= tiers.tier1_max_grams) return tiers.tier1_charge;
  if (totalWeightGrams <= tiers.tier2_max_grams) return tiers.tier2_charge;
  const extraKg = Math.ceil((totalWeightGrams - tiers.tier2_max_grams) / 1000);
  return tiers.tier3_base_charge + extraKg * tiers.per_kg_charge;
}
