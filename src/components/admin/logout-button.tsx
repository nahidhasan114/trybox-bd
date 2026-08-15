"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-surface-muted"
    >
      <LogOut className="size-4" />
      লগআউট
    </button>
  );
}
