"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export type BrandFormValues = {
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  display_order: number;
  is_active: boolean;
};

export async function createBrand(values: BrandFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (!values.name.trim()) throw new Error("নাম আবশ্যক");

  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "brands", values.slug || values.name);

  const { error } = await supabase.from("brands").insert({
    name: values.name,
    slug,
    logo_url: values.logo_url || null,
    description: values.description || null,
    display_order: Number(values.display_order) || 0,
    is_active: values.is_active,
  });
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "brand_created",
    entity_type: "brands",
  });

  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function updateBrand(id: string, values: BrandFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "brands", values.slug || values.name, id);

  const { error } = await supabase
    .from("brands")
    .update({
      name: values.name,
      slug,
      logo_url: values.logo_url || null,
      description: values.description || null,
      display_order: Number(values.display_order) || 0,
      is_active: values.is_active,
    })
    .eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "brand_updated",
    entity_type: "brands",
    entity_id: id,
  });

  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", id);

  if (count && count > 0) {
    throw new Error("এই ব্র্যান্ডে প্রোডাক্ট আছে, আগে প্রোডাক্টগুলো সরান");
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "brand_deleted",
    entity_type: "brands",
    entity_id: id,
  });

  revalidatePath("/admin/brands");
}

export async function toggleBrandActive(id: string, is_active: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("brands").update({ is_active }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/brands");
}
