"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

export type CouponFormValues = {
  code: string;
  discount_type: "fixed" | "percentage" | "free_delivery";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  starts_at: string;
  expires_at: string;
  max_usage: number | null;
  max_usage_per_customer: number;
  applicable_category_id: string;
  applicable_product_id: string;
  is_active: boolean;
};

function toRow(values: CouponFormValues) {
  return {
    code: values.code.trim().toUpperCase(),
    discount_type: values.discount_type,
    discount_value: values.discount_type === "free_delivery" ? 0 : Number(values.discount_value) || 0,
    min_order_amount: Number(values.min_order_amount) || 0,
    max_discount_amount: values.max_discount_amount != null ? Number(values.max_discount_amount) : null,
    starts_at: values.starts_at ? new Date(values.starts_at).toISOString() : null,
    expires_at: values.expires_at ? new Date(values.expires_at).toISOString() : null,
    max_usage: values.max_usage != null ? Number(values.max_usage) : null,
    max_usage_per_customer: Number(values.max_usage_per_customer) || 1,
    applicable_category_id: values.applicable_category_id || null,
    applicable_product_id: values.applicable_product_id || null,
    is_active: values.is_active,
  };
}

export async function createCoupon(values: CouponFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (!values.code.trim()) throw new Error("কুপন কোড আবশ্যক");

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").insert(toRow(values));
  if (error) {
    if (error.code === "23505") throw new Error("এই কোড দিয়ে আগে থেকেই একটা কুপন আছে");
    throw error;
  }

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "coupon_created",
    entity_type: "coupons",
  });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(id: string, values: CouponFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update(toRow(values)).eq("id", id);
  if (error) {
    if (error.code === "23505") throw new Error("এই কোড দিয়ে আগে থেকেই একটা কুপন আছে");
    throw error;
  }

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "coupon_updated",
    entity_type: "coupons",
    entity_id: id,
  });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "coupon_deleted",
    entity_type: "coupons",
    entity_id: id,
  });

  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(id: string, is_active: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/coupons");
}
