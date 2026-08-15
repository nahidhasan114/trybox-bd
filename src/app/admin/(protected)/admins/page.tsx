import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { listAdmins } from "./actions";
import { InviteForm } from "./invite-form";
import { AdminRowActions } from "./admin-row-actions";

export default async function AdminAdminsPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") redirect("/admin");

  const admins = await listAdmins();

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">অ্যাডমিন ইউজার</h1>
        <p className="text-sm text-foreground/60">Admin Panel-এ কারা প্রবেশ করতে পারবেন তা পরিচালনা করুন</p>
      </div>

      <InviteForm />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
            <tr>
              <th className="px-4 py-3 font-medium">ইমেইল</th>
              <th className="px-4 py-3 font-medium">ভূমিকা</th>
              <th className="px-4 py-3 font-medium">যোগ হয়েছে</th>
              <th className="px-4 py-3 font-medium text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map((a) => (
              <tr key={a.user_id}>
                <td className="px-4 py-3 text-foreground">{a.email}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-foreground/70">
                    {a.role === "owner" && <ShieldCheck className="size-3.5 text-primary-600" />}
                    {a.role === "owner" ? "Owner" : "Admin"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-foreground/50">
                  {new Date(a.created_at).toLocaleDateString("bn-BD")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <AdminRowActions userId={a.user_id} role={a.role} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
