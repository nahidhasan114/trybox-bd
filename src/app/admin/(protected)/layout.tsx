import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminShell role={admin.role} email={admin.email}>
      {children}
    </AdminShell>
  );
}
