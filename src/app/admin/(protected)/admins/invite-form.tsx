"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { inviteAdmin } from "./actions";

export function InviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "owner">("admin");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await inviteAdmin(email, role);
        toast.success(`${email} কে আমন্ত্রণ ইমেইল পাঠানো হয়েছে`);
        setEmail("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "আমন্ত্রণ পাঠানো যায়নি");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-4 font-medium text-foreground">নতুন Admin যোগ করুন</h2>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <FieldLabel>ইমেইল</FieldLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
        </div>
        <div>
          <FieldLabel>ভূমিকা</FieldLabel>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "owner")}
            className="h-11 rounded-xl border border-border bg-surface px-4 text-sm"
          >
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" loading={pending}>
            আমন্ত্রণ পাঠান
          </Button>
        </div>
      </div>
      <p className="mt-3 text-xs text-foreground/50">
        যে ইমেইলে আমন্ত্রণ পাঠাবেন সেই ইমেইলে একটা লগইন লিংক যাবে — লিংকে ক্লিক করলেই তার Admin অ্যাকাউন্ট সক্রিয় হয়ে যাবে।
      </p>
    </form>
  );
}
