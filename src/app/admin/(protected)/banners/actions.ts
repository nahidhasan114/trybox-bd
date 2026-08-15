"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import type { TablesInsert } from "@/types/database.types";

export type BannerFormValues = {
  title: string;
  subtitle: string;
  desktop_image_url: string;
  mobile_image_url: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

function toRow(values: BannerFormValues): TablesInsert<"banners"> {
  return {
    title: values.title || null,
    subtitle: values.subtitle || null,
    desktop_image_url: values.desktop_image_url,
    mobile_image_url: values.mobile_image_url || null,
    cta_text: values.cta_text || null,
    cta_url: values.cta_url || null,
    display_order: Number(values.display_order) || 0,
    starts_at: values.starts_at ? new Date(values.starts_at).toISOString() : null,
    ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
    is_active: values.is_active,
  };
}

export async function createBanner(values: BannerFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (!values.desktop_image_url) throw new Error("Desktop image is required");

  const supabase = await createClient();
  const { error } = await supabase.from("banners").insert(toRow(values));
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "banner_created",
    entity_type: "banners",
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(id: string, values: BannerFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("banners").update(toRow(values)).eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "banner_updated",
    entity_type: "banners",
    entity_id: id,
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "banner_deleted",
    entity_type: "banners",
    entity_id: id,
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerActive(id: string, is_active: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("banners").update({ is_active }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/banners");
  revalidatePath("/");
}
