"use server";

import { createClient } from "@/lib/supabase/server";

export type CheckoutItem = { productId: string; variantId: string | null; quantity: number };

export type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  customerAltPhone: string;
  customerEmail: string;
  division: string;
  district: string;
  upazila: string;
  fullAddress: string;
  orderNote: string;
  paymentMethod: "cod" | "bkash" | "nagad";
  senderNumber: string;
  transactionId: string;
  items: CheckoutItem[];
  couponCode: string;
};

export type CheckoutResult =
  | { success: true; orderNumber: string; totalAmount: number; discountAmount: number }
  | { success: false; error: string };

export async function submitOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: input.customerName,
    p_customer_phone: input.customerPhone,
    p_customer_alt_phone: input.customerAltPhone,
    p_customer_email: input.customerEmail,
    p_division: input.division,
    p_district: input.district,
    p_upazila: input.upazila,
    p_full_address: input.fullAddress,
    p_order_note: input.orderNote,
    p_payment_method: input.paymentMethod,
    p_sender_number: input.senderNumber,
    p_transaction_id: input.transactionId,
    p_items: input.items.map((i) => ({
      product_id: i.productId,
      variant_id: i.variantId,
      quantity: i.quantity,
    })),
    p_coupon_code: input.couponCode || null,
  });

  if (error) {
    return { success: false, error: error.message.replace(/^.*?:\s*/, "") };
  }

  const result = data as { order_number: string; order_id: string; total_amount: number; discount_amount: number };
  return {
    success: true,
    orderNumber: result.order_number,
    totalAmount: result.total_amount,
    discountAmount: result.discount_amount,
  };
}
