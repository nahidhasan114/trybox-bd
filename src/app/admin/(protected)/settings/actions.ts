"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import type { Json } from "@/types/database.types";

export type SettingsFormValues = {
  business_name: string;
  business_name_bn: string;
  logo_url: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  facebook_url: string;
  messenger_url: string;
  bkash_number: string;
  nagad_number: string;
  default_delivery_charge: number;
  free_delivery_min_order: number;
  seo_default_title: string;
  seo_default_description: string;
  cod_trust_message: string;
};

export async function updateSiteSettings(values: SettingsFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();

  const rows: { key: string; value: Json; updated_by: string }[] = [
    { key: "business_name", value: values.business_name, updated_by: admin.id },
    { key: "business_name_bn", value: values.business_name_bn, updated_by: admin.id },
    { key: "logo_url", value: values.logo_url, updated_by: admin.id },
    { key: "phone", value: values.phone, updated_by: admin.id },
    { key: "whatsapp_number", value: values.whatsapp_number, updated_by: admin.id },
    { key: "email", value: values.email, updated_by: admin.id },
    { key: "address", value: values.address, updated_by: admin.id },
    { key: "facebook_url", value: values.facebook_url, updated_by: admin.id },
    { key: "messenger_url", value: values.messenger_url, updated_by: admin.id },
    {
      key: "bkash_number",
      value: { type: "personal", number: values.bkash_number },
      updated_by: admin.id,
    },
    {
      key: "nagad_number",
      value: { type: "personal", number: values.nagad_number },
      updated_by: admin.id,
    },
    {
      key: "default_delivery_charge",
      value: values.default_delivery_charge,
      updated_by: admin.id,
    },
    {
      key: "free_delivery_min_order",
      value: values.free_delivery_min_order,
      updated_by: admin.id,
    },
    { key: "seo_default_title", value: values.seo_default_title, updated_by: admin.id },
    {
      key: "seo_default_description",
      value: values.seo_default_description,
      updated_by: admin.id,
    },
    { key: "cod_trust_message", value: values.cod_trust_message, updated_by: admin.id },
  ];

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "settings_updated",
    entity_type: "site_settings",
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
