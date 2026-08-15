"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getSiteUrl } from "@/lib/site-url";

export type AdminUser = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
};

export async function listAdmins(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_admin_users");
  if (error) throw error;
  return data ?? [];
}

export async function inviteAdmin(email: string, role: "owner" | "admin") {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") throw new Error("শুধু Owner নতুন Admin যোগ করতে পারবেন");

  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !trimmedEmail.includes("@")) throw new Error("সঠিক ইমেইল দিন");

  const supabase = await createClient();

  const { error: inviteError } = await supabase
    .from("admin_invites")
    .upsert({ email: trimmedEmail, role, invited_by: admin.id });
  if (inviteError) throw inviteError;

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: trimmedEmail,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${getSiteUrl()}/admin`,
    },
  });
  if (otpError) {
    await supabase.from("admin_invites").delete().eq("email", trimmedEmail);
    if (otpError.code === "email_address_invalid") {
      throw new Error("এই ইমেইল ঠিকানাটি সঠিক নয়");
    }
    throw otpError;
  }

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "admin_invited",
    entity_type: "user_roles",
    details: { email: trimmedEmail, role },
  });

  revalidatePath("/admin/admins");
}

export async function removeAdmin(userId: string, role: string) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") throw new Error("শুধু Owner Admin সরাতে পারবেন");
  if (role === "owner") throw new Error("Owner-কে সরানো যাবে না");
  if (userId === admin.id) throw new Error("নিজেকে সরাতে পারবেন না");

  const supabase = await createClient();
  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "admin_removed",
    entity_type: "user_roles",
    entity_id: userId,
  });

  revalidatePath("/admin/admins");
}
