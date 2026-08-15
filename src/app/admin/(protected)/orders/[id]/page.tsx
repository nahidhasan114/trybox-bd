import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatBDT } from "@/lib/pricing";
import { orderStatusLabels, paymentMethodLabels, paymentStatusLabels } from "@/lib/order-status";
import { StatusUpdateForm } from "../status-update-form";
import { PaymentVerify } from "../payment-verify";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: payments }, { data: history }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("payments").select("*").eq("order_id", id),
    supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: false }),
  ]);

  if (!order) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">অর্ডার #{order.order_number}</h1>
        <p className="text-sm text-foreground/60">{new Date(order.created_at).toLocaleString("bn-BD")}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 font-medium text-foreground">কাস্টমার তথ্য</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-foreground/50">নাম</p>
                <p className="text-foreground">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-foreground/50">ফোন</p>
                <p className="text-foreground">{order.customer_phone}</p>
              </div>
              {order.customer_alt_phone && (
                <div>
                  <p className="text-foreground/50">বিকল্প ফোন</p>
                  <p className="text-foreground">{order.customer_alt_phone}</p>
                </div>
              )}
              {order.customer_email && (
                <div>
                  <p className="text-foreground/50">ইমেইল</p>
                  <p className="text-foreground">{order.customer_email}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-foreground/50">ঠিকানা</p>
                <p className="text-foreground">
                  {[order.full_address, order.upazila, order.district, order.division].filter(Boolean).join(", ")}
                </p>
              </div>
              {order.order_note && (
                <div className="col-span-2">
                  <p className="text-foreground/50">নোট</p>
                  <p className="text-foreground">{order.order_note}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 font-medium text-foreground">প্রোডাক্ট</h2>
            <div className="divide-y divide-border">
              {(items ?? []).map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <div>
                    <p className="text-foreground">{item.product_name}</p>
                    {item.variant_name && <p className="text-xs text-foreground/50">{item.variant_name}</p>}
                    {item.customization_note && (
                      <p className="text-xs font-medium text-primary-700">কাস্টমাইজেশন: {item.customization_note}</p>
                    )}
                    <p className="text-xs text-foreground/50">
                      {item.quantity} × {formatBDT(item.unit_price)}
                    </p>
                  </div>
                  <p className="font-medium text-foreground">{formatBDT(item.line_total)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between text-foreground/60">
                <span>সাবটোটাল</span>
                <span>{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>ডেলিভারি চার্জ</span>
                <span>{formatBDT(order.shipping_charge)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-foreground/60">
                  <span>ছাড়</span>
                  <span>-{formatBDT(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>সর্বমোট</span>
                <span>{formatBDT(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {payments && payments.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="mb-3 font-medium text-foreground">পেমেন্ট তথ্য</h2>
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-surface-muted p-3 text-sm">
                  <div>
                    <p className="text-foreground">
                      {paymentMethodLabels[p.method] ?? p.method} — {formatBDT(p.amount)}
                    </p>
                    <p className="text-xs text-foreground/50">প্রেরকের নম্বর: {p.sender_number || "—"}</p>
                    <p className="text-xs text-foreground/50">Transaction ID: {p.transaction_id || "—"}</p>
                  </div>
                  <PaymentVerify paymentId={p.id} orderId={order.id} status={p.status} />
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 font-medium text-foreground">স্ট্যাটাস হিস্টোরি</h2>
            <ul className="space-y-2 text-sm">
              {(history ?? []).map((h) => (
                <li key={h.id} className="flex justify-between text-foreground/70">
                  <span>
                    {orderStatusLabels[h.status] ?? h.status} {h.note && `— ${h.note}`}
                  </span>
                  <span className="text-xs text-foreground/40">{new Date(h.created_at).toLocaleString("bn-BD")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 font-medium text-foreground">অর্ডার স্ট্যাটাস</h2>
            <StatusUpdateForm orderId={order.id} currentStatus={order.status} />
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 text-sm">
            <p className="mb-1 text-foreground/50">পেমেন্ট অবস্থা</p>
            <p className="font-medium text-foreground">{paymentStatusLabels[order.payment_status] ?? order.payment_status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
