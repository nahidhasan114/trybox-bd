"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ImageOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Input, FieldLabel, FieldError } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart, type CartLine } from "@/lib/cart/cart-context";
import { useCartDetails } from "@/lib/cart/use-cart-details";
import { getBuyNowItem, clearBuyNowItem } from "@/lib/cart/buy-now";
import { submitOrder } from "@/lib/actions/checkout";
import { formatBDT } from "@/lib/pricing";
import { bdDivisions, bdDistrictsByDivision } from "@/lib/bd-locations";
import { createClient } from "@/lib/supabase/client";
import { calculateWeightShipping, DEFAULT_SHIPPING_TIERS, type ShippingTiers } from "@/lib/shipping-calc";

type FormValues = {
  customerName: string;
  customerPhone: string;
  customerAltPhone: string;
  customerEmail: string;
  division: string;
  district: string;
  upazila: string;
  fullAddress: string;
  orderNote: string;
  paymentMethod: "cod" | "bkash" | "nagad";
  senderNumber: string;
  transactionId: string;
  couponCode: string;
};

const BD_PHONE_REGEX = /^01[3-9][0-9]{8}$/;

export function CheckoutForm({ bkashNumber, nagadNumber }: { bkashNumber: string; nagadNumber: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buynow";
  const { lines: cartLines, clearCart } = useCart();

  const [buyNowLine, setBuyNowLine] = useState<CartLine[] | null>(null);
  useEffect(() => {
    if (isBuyNow) {
      const item = getBuyNowItem();
      setBuyNowLine(
        item
          ? [{ productId: item.productId, variantId: item.variantId, quantity: item.quantity, customization: item.customization ?? null }]
          : [],
      );
    }
  }, [isBuyNow]);

  const activeLines = isBuyNow ? buyNowLine ?? [] : cartLines;
  const { items, loading } = useCartDetails(activeLines);

  const [shippingTiers, setShippingTiers] = useState<ShippingTiers>(DEFAULT_SHIPPING_TIERS);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [
        "shipping_tier1_max_grams",
        "shipping_tier1_charge",
        "shipping_tier2_max_grams",
        "shipping_tier2_charge",
        "shipping_tier3_base_charge",
        "shipping_per_kg_charge",
        "shipping_free_min_order",
      ])
      .then(({ data }) => {
        if (!data) return;
        const tiers = { ...DEFAULT_SHIPPING_TIERS };
        for (const row of data) {
          const shortKey = row.key.replace("shipping_", "") as keyof ShippingTiers;
          if (shortKey in tiers) tiers[shortKey] = Number(row.value);
        }
        setShippingTiers(tiers);
      });
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAltPhone: "",
      customerEmail: "",
      division: "ঢাকা",
      district: "ঢাকা",
      upazila: "",
      fullAddress: "",
      orderNote: "",
      paymentMethod: "cod",
      senderNumber: "",
      transactionId: "",
      couponCode: "",
    },
  });

  const division = watch("division");
  const paymentMethod = watch("paymentMethod");
  const districts = bdDistrictsByDivision[division] ?? [];

  useEffect(() => {
    if (districts.length > 0 && !districts.includes(watch("district"))) {
      setValue("district", districts[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalWeightGrams = items.reduce((sum, i) => sum + i.weightGrams * i.quantity, 0);
  const allFreeDelivery = items.length > 0 && items.every((i) => i.isFreeDelivery);
  const weightShipping = calculateWeightShipping(totalWeightGrams, shippingTiers);
  const meetsFreeMin = shippingTiers.free_min_order > 0 && subtotal >= shippingTiers.free_min_order;
  const estimatedShipping = allFreeDelivery || meetsFreeMin ? 0 : weightShipping;
  const estimatedTotal = subtotal + estimatedShipping;

  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) {
      toast.error("আপনার কার্ট খালি");
      return;
    }

    const result = await submitOrder({
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      customerAltPhone: values.customerAltPhone,
      customerEmail: values.customerEmail,
      division: values.division,
      district: values.district,
      upazila: values.upazila,
      fullAddress: values.fullAddress,
      orderNote: values.orderNote,
      paymentMethod: values.paymentMethod,
      senderNumber: values.senderNumber,
      transactionId: values.transactionId,
      items: activeLines,
      couponCode: values.couponCode,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    window.sessionStorage.setItem("trybox_last_order_phone", values.customerPhone);

    if (isBuyNow) {
      clearBuyNowItem();
    } else {
      clearCart();
    }
    router.push(`/order-confirmation/${result.orderNumber}`);
  };

  const paymentNumber = paymentMethod === "bkash" ? bkashNumber : paymentMethod === "nagad" ? nagadNumber : "";

  if (loading) {
    return <p className="py-16 text-center text-sm text-foreground/50">লোড হচ্ছে...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-foreground/60">চেকআউট করার জন্য কার্টে কোনো প্রোডাক্ট নেই।</p>
        <Link href="/shop" className="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          কেনাকাটা করুন
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-medium text-foreground">কাস্টমার তথ্য</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>পূর্ণ নাম *</FieldLabel>
              <Input {...register("customerName", { required: "নাম আবশ্যক" })} error={errors.customerName?.message} />
              <FieldError>{errors.customerName?.message}</FieldError>
            </div>
            <div>
              <FieldLabel>মোবাইল নম্বর *</FieldLabel>
              <Input
                placeholder="01XXXXXXXXX"
                {...register("customerPhone", {
                  required: "মোবাইল নম্বর আবশ্যক",
                  pattern: { value: BD_PHONE_REGEX, message: "সঠিক মোবাইল নম্বর লিখুন" },
                })}
                error={errors.customerPhone?.message}
              />
              <FieldError>{errors.customerPhone?.message}</FieldError>
            </div>
            <div>
              <FieldLabel>বিকল্প নম্বর (ঐচ্ছিক)</FieldLabel>
              <Input {...register("customerAltPhone")} />
            </div>
            <div>
              <FieldLabel>ইমেইল (ঐচ্ছিক)</FieldLabel>
              <Input type="email" {...register("customerEmail")} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-medium text-foreground">ডেলিভারি ঠিকানা</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>বিভাগ *</FieldLabel>
              <select {...register("division")} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm">
                {bdDivisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>জেলা *</FieldLabel>
              <select {...register("district")} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm">
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>উপজেলা / এলাকা (ঐচ্ছিক)</FieldLabel>
              <Input {...register("upazila")} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>সম্পূর্ণ ঠিকানা *</FieldLabel>
              <Textarea
                {...register("fullAddress", { required: "ঠিকানা আবশ্যক" })}
                placeholder="বাসা/রোড/এলাকার বিস্তারিত ঠিকানা লিখুন"
              />
              <FieldError>{errors.fullAddress?.message}</FieldError>
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>অর্ডার নোট (ঐচ্ছিক)</FieldLabel>
              <Textarea rows={2} {...register("orderNote")} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-medium text-foreground">পেমেন্ট পদ্ধতি</h2>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <div className="space-y-2">
                {[
                  { value: "cod", label: "ক্যাশ অন ডেলিভারি (COD)", desc: "পণ্য হাতে পেয়ে টাকা পরিশোধ করুন" },
                  { value: "bkash", label: "bKash", desc: "bKash দিয়ে Send Money করুন" },
                  { value: "nagad", label: "Nagad", desc: "Nagad দিয়ে Send Money করুন" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                      field.value === opt.value ? "border-primary-500 bg-primary-50/50" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1 size-4"
                      checked={field.value === opt.value}
                      onChange={() => field.onChange(opt.value)}
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground">{opt.label}</span>
                      <span className="block text-xs text-foreground/50">{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          />

          {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
            <div className="mt-4 space-y-3 rounded-xl bg-surface-muted p-4">
              <p className="text-sm text-foreground/80">
                এই নম্বরে <strong>{formatBDT(estimatedTotal)}</strong> টাকা{" "}
                <strong>Send Money</strong> করুন:{" "}
                <span className="font-semibold text-primary-700">{paymentNumber || "নম্বর সেট করা নেই"}</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel>যে নম্বর থেকে টাকা পাঠিয়েছেন *</FieldLabel>
                  <Input
                    placeholder="01XXXXXXXXX"
                    {...register("senderNumber", {
                      required: "প্রেরকের নম্বর আবশ্যক",
                    })}
                    error={errors.senderNumber?.message}
                  />
                  <FieldError>{errors.senderNumber?.message}</FieldError>
                </div>
                <div>
                  <FieldLabel>Transaction ID *</FieldLabel>
                  <Input
                    {...register("transactionId", {
                      required: "Transaction ID আবশ্যক",
                    })}
                    error={errors.transactionId?.message}
                  />
                  <FieldError>{errors.transactionId?.message}</FieldError>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-fit space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-medium text-foreground">অর্ডার সামারি</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantId}-${(item.customization ?? []).join("|")}`}
              className="flex gap-3"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex size-full items-center justify-center text-foreground/20">
                    <ImageOff className="size-4" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col text-sm">
                <span className="line-clamp-1 text-foreground">{item.name}</span>
                {item.variantName && <span className="text-xs text-foreground/50">{item.variantName}</span>}
                {item.customization && item.customization.length > 0 && (
                  <span className="text-xs text-primary-700">{item.customization.join(", ")}</span>
                )}
                <span className="text-foreground/60">
                  {item.quantity} × {formatBDT(item.price)}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">{formatBDT(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div>
          <FieldLabel>কুপন কোড (ঐচ্ছিক)</FieldLabel>
          <Input placeholder="যদি থাকে" {...register("couponCode")} />
          <p className="mt-1 text-xs text-foreground/40">কুপন সঠিক হলে ছাড় অর্ডার কনফার্ম হওয়ার পর দেখাবে</p>
        </div>

        <div className="space-y-1.5 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-foreground/60">
            <span>সাবটোটাল</span>
            <span>{formatBDT(subtotal)}</span>
          </div>
          <div className="flex justify-between text-foreground/60">
            <span>ডেলিভারি চার্জ (আনুমানিক)</span>
            <span>{formatBDT(estimatedShipping)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold text-foreground">
            <span>সর্বমোট (আনুমানিক)</span>
            <span>{formatBDT(estimatedTotal)}</span>
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          অর্ডার কনফার্ম করুন
        </Button>
      </div>
    </form>
  );
}
