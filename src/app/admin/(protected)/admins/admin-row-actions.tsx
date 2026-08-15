"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeAdmin } from "./actions";

export function AdminRowActions({ userId, role }: { userId: string; role: string }) {
  const [pending, startTransition] = useTransition();

  if (role === "owner") return null;

  const handleRemove = () => {
    if (!confirm("এই Admin-কে সরিয়ে দিতে চান?")) return;
    startTransition(async () => {
      try {
        await removeAdmin(userId, role);
        toast.success("সরানো হয়েছে");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "সরানো যায়নি");
      }
    });
  };

  return (
    <button onClick={handleRemove} disabled={pending} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
      <Trash2 className="size-4" />
    </button>
  );
}
