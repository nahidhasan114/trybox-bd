import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "admin";

export type CurrentAdmin = {
  id: string;
  email: string;
  role: AdminRole;
  permissions: Record<string, unknown>;
};

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role, permissions")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!roleRow) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role: roleRow.role as AdminRole,
    permissions: (roleRow.permissions as Record<string, unknown>) ?? {},
  };
}
