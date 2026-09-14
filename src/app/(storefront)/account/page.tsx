import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatBDT } from "@/lib/pricing";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/order-status";
import { CustomerLogoutButton } from "@/components/storefront/customer-logout-button";
import { PackageSearch, User } from "lucide-react";

export const metadata = { title: "আমার অ্যাকাউন্ট" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const { data: customer } = await supabase
    .from("customers")
    .select("full_name, phone, email")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, payment_method, payment_status, total_amount, created_at, order_items(product_name, variant_name, quantity)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">আমার অ্যাকাউন্ট</h1>
          <p className="text-sm text-foreground/60">{customer?.full_name || user.email}</p>
        </div>
        <CustomerLogoutButton />
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 flex items-center gap-2 font-medium text-foreground">
          <User className="size-4.5 text-primary-600" /> প্রোফাইল তথ্য
        </h2>
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-foreground/50">নাম</p>
            <p className="font-medium text-foreground">{customer?.full_name || "—"}</p>
          </div>
          <div>
            <p className="text-foreground/50">ফোন</p>
            <p className="font-medium text-foreground">{customer?.phone || "—"}</p>
          </div>
          <div>
            <p className="text-foreground/50">ইমেইল</p>
            <p className="font-medium text-foreground">{customer?.email || user.email}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 flex items-center gap-2 font-medium text-foreground">
          <PackageSearch className="size-4.5 text-primary-600" /> আমার অর্ডার
        </h2>
        {!orders || orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-foreground/50">এখনো কোনো অর্ডার করেননি।</p>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {o.order_number}{" "}
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                      {orderStatusLabels[o.status] ?? o.status}
                    </span>
                  </p>
                  <p className="text-xs text-foreground/50">
                    {new Date(o.created_at).toLocaleDateString("bn-BD")} ·{" "}
                    {paymentMethodLabels[o.payment_method] ?? o.payment_method} ·{" "}
                    {(o.order_items ?? []).length}টি প্রোডাক্ট
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatBDT(o.total_amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
