"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackOrder, type TrackedOrder } from "@/lib/actions/track-order";
import { formatBDT } from "@/lib/pricing";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/order-status";

const LAST_ORDER_PHONE_KEY = "trybox_last_order_phone";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-14 text-primary-600" />
        <h1 className="text-xl font-semibold text-foreground">ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে</h1>
        <p className="text-sm text-foreground/60">
          অর্ডার নম্বর: <span className="font-semibold text-foreground">{order.order_number}</span>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-foreground/50">গ্রাহকের নাম</p>
            <p className="font-medium text-foreground">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-foreground/50">পেমেন্ট পদ্ধতি</p>
            <p className="font-medium text-foreground">{paymentMethodLabels[order.payment_method] ?? order.payment_method}</p>
          </div>
          <div>
            <p className="text-foreground/50">ডেলিভারি ঠিকানা</p>
            <p className="font-medium text-foreground">{order.full_address}, {order.district}, {order.division}</p>
          </div>
          <div>
            <p className="text-foreground/50">অর্ডার অবস্থা</p>
            <p className="font-medium text-foreground">{orderStatusLabels[order.status] ?? order.status}</p>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="mb-2 text-sm font-medium text-foreground">প্রোডাক্ট</p>
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
        <Link href="/shop" className="flex h-11 items-center justify-center rounded-full bg-primary-600 px-5 text-sm font-medium text-white hover:bg-primary-700">
          কেনাকাটা চালিয়ে যান
        </Link>
        <Link
          href="/track-order"
          className="flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground hover:bg-surface-muted"
        >
          অর্ডার ট্র্যাক করুন
        </Link>
      </div>
    </div>
  );
}
