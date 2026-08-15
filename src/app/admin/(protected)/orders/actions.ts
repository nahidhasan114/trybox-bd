"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

const RESTOCK_STATUSES = ["cancelled", "returned"];

export async function updateOrderStatus(orderId: string, newStatus: string, note: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { data: order } = await supabase.from("orders").select("status").eq("id", orderId).single();
  if (!order) throw new Error("Order not found");

  const wasRestocked = RESTOCK_STATUSES.includes(order.status);
  const shouldRestock = RESTOCK_STATUSES.includes(newStatus) && !wasRestocked;

  const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
  if (error) throw error;

  await supabase.from("order_status_history").insert({
    order_id: orderId,
    status: newStatus,
    note: note || null,
    changed_by: admin.id,
  });

  if (shouldRestock) {
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, variant_id, quantity")
      .eq("order_id", orderId);

    for (const item of items ?? []) {
      if (!item.product_id) continue;

      if (item.variant_id) {
        const { data: variant } = await supabase
          .from("product_variants")
          .select("stock_quantity")
          .eq("id", item.variant_id)
          .single();
        if (variant) {
          await supabase
            .from("product_variants")
            .update({ stock_quantity: variant.stock_quantity + item.quantity })
            .eq("id", item.variant_id);
        }
      }

      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single();
      if (product) {
        await supabase
          .from("products")
          .update({ stock_quantity: product.stock_quantity + item.quantity })
          .eq("id", item.product_id);
      }

      await supabase.from("inventory_movements").insert({
        product_id: item.product_id,
        variant_id: item.variant_id,
        change_qty: item.quantity,
        reason: "order_cancelled",
        reference_id: orderId,
        created_by: admin.id,
      });
    }
  }

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "order_status_updated",
    entity_type: "orders",
    entity_id: orderId,
    details: { status: newStatus },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function verifyPayment(paymentId: string, orderId: string, approved: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();

  const { error } = await supabase
    .from("payments")
    .update({
      status: approved ? "verified" : "failed",
      verified_by: admin.id,
      verified_at: new Date().toISOString(),
    })
    .eq("id", paymentId);
  if (error) throw error;

  await supabase
    .from("orders")
    .update({ payment_status: approved ? "paid" : "failed" })
    .eq("id", orderId);

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: approved ? "payment_verified" : "payment_rejected",
    entity_type: "payments",
    entity_id: paymentId,
  });

  revalidatePath(`/admin/orders/${orderId}`);
}
