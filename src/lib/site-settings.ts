import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SiteSettings = {
  business_name: string;
  business_name_bn: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  whatsapp_number: string;
  messenger_url: string;
  facebook_url: string;
  bkash_number: { type: string; number: string } | null;
  nagad_number: { type: string; number: string } | null;
  currency: string;
  default_delivery_charge: number;
  free_delivery_min_order: number;
  seo_default_title: string;
  seo_default_description: string;
  cod_trust_message: string;
  show_trust_benefits: boolean;
  show_all_products: boolean;
  show_best_sellers: boolean;
  show_hot_deals: boolean;
  show_combo_offers: boolean;
  show_customizable_combos: boolean;
  show_new_arrivals: boolean;
  show_featured: boolean;
  show_free_delivery: boolean;
  contact_fab_channel: "whatsapp" | "messenger" | "phone" | "none";
};

const FALLBACK: SiteSettings = {
  business_name: "TryBox BD",
  business_name_bn: "ট্রাইবক্স বিডি",
  logo_url: "",
  phone: "",
  email: "",
  address: "",
  whatsapp_number: "",
  messenger_url: "",
  facebook_url: "",
  bkash_number: null,
  nagad_number: null,
  currency: "BDT",
  default_delivery_charge: 70,
  free_delivery_min_order: 0,
  seo_default_title: "TryBox BD",
  seo_default_description: "",
  cod_trust_message:
    "আমরা আপনার উপর বিশ্বাস করে ক্যাশ অন ডেলিভারিতে প্রোডাক্টটি পাঠাচ্ছি। অনুগ্রহ করে ডেলিভারির সময় প্রোডাক্টটি রিসিভ করবেন। আপনার বিশ্বাসই আমাদের সবচেয়ে বড় শক্তি।",
  show_trust_benefits: true,
  show_all_products: true,
  show_best_sellers: true,
  show_hot_deals: true,
  show_combo_offers: true,
  show_customizable_combos: true,
  show_new_arrivals: true,
  show_featured: true,
  show_free_delivery: true,
  contact_fab_channel: "whatsapp",
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("key, value");

  const settings = { ...FALLBACK };
  if (error) {
    console.error("getSiteSettings failed:", error.message);
  }
  if (!data || data.length === 0) return settings;

  for (const row of data) {
    if (row.key in settings) {
      // @ts-expect-error -- keys are validated against FALLBACK above
      settings[row.key] = row.value;
    }
  }
  return settings;
});
