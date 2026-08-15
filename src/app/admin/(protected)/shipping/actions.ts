"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

export type ShippingRuleFormValues = {
  id: string;
  name: string;
  charge: number;
  free_delivery_min_order: number | null;
  is_active: boolean;
};

export async function updateShippingRule(values: ShippingRuleFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase
    .from("shipping_rules")
    .update({
      name: values.name,
      charge: values.charge,
      free_delivery_min_order: values.free_delivery_min_order,
      is_active: values.is_active,
    })
    .eq("id", values.id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "shipping_rule_updated",
    entity_type: "shipping_rules",
    entity_id: values.id,
  });

  revalidatePath("/admin/shipping");
}
