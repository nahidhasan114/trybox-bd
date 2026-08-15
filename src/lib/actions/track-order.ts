"use server";

import { createClient } from "@/lib/supabase/server";

export type TrackedOrder = {
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  discount_amount: number;
  shipping_charge: number;
  total_amount: number;
  customer_name: string;
  full_address: string;
  district: string;
  division: string;
  created_at: string;
  items: { product_name: string; variant_name: string | null; quantity: number; unit_price: number; line_total: number }[];
  status_history: { status: string; note: string | null; created_at: string }[];
};

export async function trackOrder(orderNumber: string, phone: string): Promise<TrackedOrder | null> {
  if (!orderNumber.trim() || !phone.trim()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("track_order", {
    p_order_number: orderNumber.trim(),
    p_phone: phone.trim(),
  });

  if (error || !data) return null;
  return data as unknown as TrackedOrder;
}
