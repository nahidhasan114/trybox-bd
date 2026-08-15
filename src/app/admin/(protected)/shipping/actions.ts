"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

export type WeightShippingSettings = {
  tier1_max_grams: number;
  tier1_charge: number;
  tier2_max_grams: number;
  tier2_charge: number;
  tier3_base_charge: number;
  per_kg_charge: number;
  free_min_order: number;
};

export async function updateWeightShipping(values: WeightShippingSettings) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const rows = [
    { key: "shipping_tier1_max_grams", value: values.tier1_max_grams, updated_by: admin.id },
    { key: "shipping_tier1_charge", value: values.tier1_charge, updated_by: admin.id },
    { key: "shipping_tier2_max_grams", value: values.tier2_max_grams, updated_by: admin.id },
    { key: "shipping_tier2_charge", value: values.tier2_charge, updated_by: admin.id },
    { key: "shipping_tier3_base_charge", value: values.tier3_base_charge, updated_by: admin.id },
    { key: "shipping_per_kg_charge", value: values.per_kg_charge, updated_by: admin.id },
    { key: "shipping_free_min_order", value: values.free_min_order, updated_by: admin.id },
  ];

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "shipping_settings_updated",
    entity_type: "site_settings",
  });

  revalidatePath("/admin/shipping");
}
