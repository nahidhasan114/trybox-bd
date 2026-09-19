"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

export type DeleteMonthResult = { ok: true; deleted: number } | { ok: false; error: string };

export async function deleteMonthOrders(month: string): Promise<DeleteMonthResult> {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") return { ok: false, error: "শুধু Owner এটা করতে পারবেন" };
  if (!/^\d{4}-\d{2}-01$/.test(month)) return { ok: false, error: "ভুল মাস" };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("archive_and_delete_month", { p_month: month });
  if (error) {
    const missing = error.code === "PGRST202" || /could not find the function/i.test(error.message);
    return { ok: false, error: missing ? "ডাটাবেজ সেটআপ (SQL) এখনো চালানো হয়নি" : error.message };
  }

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "month_orders_deleted",
    entity_type: "orders",
    details: { month },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  const deleted = Number((data as { deleted?: number } | null)?.deleted ?? 0);
  return { ok: true, deleted };
}
