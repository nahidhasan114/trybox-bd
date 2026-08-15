"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

export type TeamMemberFormValues = {
  name: string;
  designation: string;
  photo_url: string;
  phone: string;
  email: string;
  bio: string;
  display_order: number;
  is_active: boolean;
};

function toRow(values: TeamMemberFormValues) {
  return {
    name: values.name,
    designation: values.designation || null,
    photo_url: values.photo_url || null,
    phone: values.phone || null,
    email: values.email || null,
    bio: values.bio || null,
    display_order: Number(values.display_order) || 0,
    is_active: values.is_active,
  };
}

export async function createTeamMember(values: TeamMemberFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (!values.name.trim()) throw new Error("নাম আবশ্যক");

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").insert(toRow(values));
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "team_member_created",
    entity_type: "team_members",
  });

  revalidatePath("/admin/team");
  revalidatePath("/about");
  redirect("/admin/team");
}

export async function updateTeamMember(id: string, values: TeamMemberFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").update(toRow(values)).eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "team_member_updated",
    entity_type: "team_members",
    entity_id: id,
  });

  revalidatePath("/admin/team");
  revalidatePath("/about");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw error;

  await supabase.from("admin_activity_logs").insert({
    admin_id: admin.id,
    action: "team_member_deleted",
    entity_type: "team_members",
    entity_id: id,
  });

  revalidatePath("/admin/team");
  revalidatePath("/about");
}

export async function toggleTeamMemberActive(id: string, is_active: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").update({ is_active }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/team");
  revalidatePath("/about");
}
