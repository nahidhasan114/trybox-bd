"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function adjustStock(productId: string, changeQty: number, reason: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (changeQty === 0) throw new Error("পরিমাণ ০ হতে পারবে না");

  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity, name_bn")
    .eq("id", productId)
    .single();
  if (!product) throw new Error("প্রোডাক্ট পাওয়া যায়নি");

  const newStock = Math.max(0, product.stock_quantity + changeQty);

  const { error } = await supabase.from("products").update({ stock_quantity: newStock }).eq("id", productId);
  if (error) throw error;

  await supabase.from("inventory_movements").insert({
    product_id: productId,
    change_qty: changeQty,
    reason: reason || "manual_adjustment",
    created_by: admin.id,
  });

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "stock_adjusted",
    entity_type: "products",
    entity_id: productId,
    details: { change_qty: changeQty, reason },
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
}
