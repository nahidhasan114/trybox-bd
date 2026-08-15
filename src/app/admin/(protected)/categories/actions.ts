"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export type CategoryFormValues = {
  name_bn: string;
  name_en: string;
  slug: string;
  description_bn: string;
  description_en: string;
  image_url: string;
  parent_id: string;
  seo_title: string;
  seo_description: string;
  display_order: number;
  is_active: boolean;
};

export async function createCategory(values: CategoryFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (!values.name_bn.trim()) throw new Error("নাম আবশ্যক");

  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "categories", values.slug || values.name_en || values.name_bn);

  const { error } = await supabase.from("categories").insert({
    name_bn: values.name_bn,
    name_en: values.name_en || values.name_bn,
    slug,
    description_bn: values.description_bn || null,
    description_en: values.description_en || null,
    image_url: values.image_url || null,
    parent_id: values.parent_id || null,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
    display_order: Number(values.display_order) || 0,
    is_active: values.is_active,
  });
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "category_created",
    entity_type: "categories",
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, values: CategoryFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const slug = await generateUniqueSlug(
    supabase,
    "categories",
    values.slug || values.name_en || values.name_bn,
    id,
  );

  const { error } = await supabase
    .from("categories")
    .update({
      name_bn: values.name_bn,
      name_en: values.name_en || values.name_bn,
      slug,
      description_bn: values.description_bn || null,
      description_en: values.description_en || null,
      image_url: values.image_url || null,
      parent_id: values.parent_id || null,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
      display_order: Number(values.display_order) || 0,
      is_active: values.is_active,
    })
    .eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "category_updated",
    entity_type: "categories",
    entity_id: id,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    throw new Error("এই ক্যাটাগরিতে প্রোডাক্ট আছে, আগে প্রোডাক্টগুলো সরান বা অন্য ক্যাটাগরিতে দিন");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "category_deleted",
    entity_type: "categories",
    entity_id: id,
  });

  revalidatePath("/admin/categories");
}

export async function toggleCategoryActive(id: string, is_active: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update({ is_active }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/categories");
}
