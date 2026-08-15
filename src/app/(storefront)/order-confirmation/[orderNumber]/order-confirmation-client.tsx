"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, User, Wallet, MapPin, Truck, ShoppingBag, PackageSearch } from "lucide-react";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackOrder, type TrackedOrder } from "@/lib/actions/track-order";
import { formatBDT } from "@/lib/pricing";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/order-status";

const LAST_ORDER_PHONE_KEY = "trybox_last_order_phone";

export function OrderConfirmationClient({
  orderNumber,
  codTrustMessage,
}: {
  orderNumber: string;
  codTrustMessage: string;
}) {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [phone, setPhone] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedPhone = window.sessionStorage.getItem(LAST_ORDER_PHONE_KEY);
    if (savedPhone) {
      trackOrder(orderNumber, savedPhone).then((result) => {
        if (result) setOrder(result);
        else setNeedsPhone(true);
        setChecking(false);
      });
    } else {
      setNeedsPhone(true);
      setChecking(false);
    }
  }, [orderNumber]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    const result = await trackOrder(orderNumber, phone);
    if (result) {
      setOrder(result);
      setNeedsPhone(false);
    }
    setChecking(false);
  };

  if (checking) {
    return <p className="py-16 text-center text-sm text-foreground/50">লোড হচ্ছে...</p>;
  }

  if (needsPhone && !order) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
        <p className="mb-4 text-center text-sm text-foreground/70">
          অর্ডারের বিস্তারিত দেখতে আপনার মোবাইল নম্বর দিন
        </p>
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <FieldLabel>মোবাইল নম্বর</FieldLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
          </div>
          <Button type="submit" className="w-full">
            দেখুন
          </Button>
        </form>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center text-sm text-foreground/60">
        দুঃখিত, অর্ডারটি পাওয়া যায়নি অথবা নম্বর মিলছে না।
      </div>
    );
  }

  const infoItems = [
    { icon: User, label: "গ্রাহকের নাম", value: order.customer_name },
    { icon: Wallet, label: "পেমেন্ট পদ্ধতি", value: paymentMethodLabels[order.payment_method] ?? order.payment_method },
    { icon: MapPin, label: "ডেলিভারি ঠিকানা", value: `${order.full_address}, ${order.district}, ${order.division}` },
    { icon: Truck, label: "অর্ডার অবস্থা", value: orderStatusLabels[order.status] ?? order.status },
  ];

  return (
    <div className="bg-gradient-to-b from-primary-50/70 via-white to-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
            <CheckCircle2 className="size-11 text-white" />
          </span>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে
          </h1>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">
            অর্ডার নম্বর: <span className="font-semibold">{order.order_number}</span>
          </p>
        </div>

        {order.payment_method === "cod" && codTrustMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-accent-50/40 p-4 sm:p-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm">
              <ShieldCheck className="size-5" />
            </span>
            <p className="text-sm leading-relaxed text-foreground/80">{codTrustMessage}</p>
          </div>
        )}

        <div className="mt-6 space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <item.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-xs text-foreground/50">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <ShoppingBag className="size-4 text-primary-600" /> প্রোডাক্ট
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/70">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {item.product_name} {item.variant_name && `(${item.variant_name})`} × {item.quantity}
                  </span>
                  <span>{formatBDT(item.line_total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 space-y-1 border-t border-border pt-2 text-sm">
              <div className="flex justify-between text-foreground/60">
                <span>সাবটোটাল</span>
                <span>{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>ডেলিভারি চার্জ</span>
                <span>{formatBDT(order.shipping_charge)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-primary-700">
                  <span>কুপন ছাড়</span>
                  <span>-{formatBDT(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>সর্বমোট</span>
                <span>{formatBDT(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-primary-500 to-primary-600 px-5 text-sm font-medium text-white shadow-sm transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-md"
          >
            <ShoppingBag className="size-4" /> কেনাকাটা চালিয়ে যান
          </Link>
          <Link
            href="/track-order"
            className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            <PackageSearch className="size-4" /> অর্ডার ট্র্যাক করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
