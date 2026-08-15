"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import type { Tables } from "@/types/database.types";
import { createCoupon, updateCoupon, type CouponFormValues } from "./actions";

function toDateInput(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export function CouponForm({
  coupon,
  categoryOptions,
  productOptions,
}: {
  coupon?: Tables<"coupons">;
  categoryOptions: ComboboxOption[];
  productOptions: ComboboxOption[];
}) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control, watch } = useForm<CouponFormValues>({
    defaultValues: {
      code: coupon?.code ?? "",
      discount_type: (coupon?.discount_type as CouponFormValues["discount_type"]) ?? "percentage",
      discount_value: coupon?.discount_value ?? 0,
      min_order_amount: coupon?.min_order_amount ?? 0,
      max_discount_amount: coupon?.max_discount_amount ?? null,
      starts_at: toDateInput(coupon?.starts_at ?? null),
      expires_at: toDateInput(coupon?.expires_at ?? null),
      max_usage: coupon?.max_usage ?? null,
      max_usage_per_customer: coupon?.max_usage_per_customer ?? 1,
      applicable_category_id: coupon?.applicable_category_id ?? "",
      applicable_product_id: coupon?.applicable_product_id ?? "",
      is_active: coupon?.is_active ?? true,
    },
  });

  const discountType = watch("discount_type");

  const onSubmit = (values: CouponFormValues) => {
    startTransition(async () => {
      try {
        if (coupon) {
          await updateCoupon(coupon.id, values);
        } else {
          await createCoupon(values);
        }
      } catch (e) {
        const digest = (e as { digest?: string })?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) throw e;
        toast.error(e instanceof Error ? e.message : "সংরক্ষণ করা যায়নি");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium text-foreground">কুপনের তথ্য</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>কুপন কোড</FieldLabel>
            <Input placeholder="EID50" {...register("code", { required: true })} />
          </div>
          <div>
            <FieldLabel>ডিসকাউন্টের ধরন</FieldLabel>
            <select {...register("discount_type")} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm">
              <option value="percentage">শতাংশ (%)</option>
              <option value="fixed">নির্দিষ্ট টাকা (৳)</option>
              <option value="free_delivery">ফ্রি ডেলিভারি</option>
            </select>
          </div>
          {discountType !== "free_delivery" && (
            <div>
              <FieldLabel>{discountType === "percentage" ? "কত শতাংশ" : "কত টাকা"}</FieldLabel>
              <Input type="number" step="0.01" {...register("discount_value", { valueAsNumber: true })} />
            </div>
          )}
          {discountType === "percentage" && (
            <div>
              <FieldLabel>সর্বোচ্চ ছাড় (৳, ঐচ্ছিক)</FieldLabel>
              <Input
                type="number"
                {...register("max_discount_amount", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
              />
            </div>
          )}
          <div>
            <FieldLabel>ন্যূনতম অর্ডার (৳)</FieldLabel>
            <Input type="number" {...register("min_order_amount", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium text-foreground">শর্তাবলী</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>শুরুর তারিখ (ঐচ্ছিক)</FieldLabel>
            <Input type="datetime-local" {...register("starts_at")} />
          </div>
          <div>
            <FieldLabel>মেয়াদ শেষ (ঐচ্ছিক)</FieldLabel>
            <Input type="datetime-local" {...register("expires_at")} />
          </div>
          <div>
            <FieldLabel>সর্বমোট ব্যবহারের সীমা (ঐচ্ছিক)</FieldLabel>
            <Input
              type="number"
              {...register("max_usage", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
            />
          </div>
          <div>
            <FieldLabel>প্রতি কাস্টমার সর্বোচ্চ ব্যবহার</FieldLabel>
            <Input type="number" {...register("max_usage_per_customer", { valueAsNumber: true })} />
          </div>
          <div>
            <FieldLabel>নির্দিষ্ট ক্যাটাগরির জন্য (ঐচ্ছিক)</FieldLabel>
            <Controller
              control={control}
              name="applicable_category_id"
              render={({ field }) => (
                <Combobox options={categoryOptions} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <FieldLabel>নির্দিষ্ট প্রোডাক্টের জন্য (ঐচ্ছিক)</FieldLabel>
            <Controller
              control={control}
              name="applicable_product_id"
              render={({ field }) => (
                <Combobox options={productOptions} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </div>

      <Controller
        control={control}
        name="is_active"
        render={({ field }) => (
          <Switch checked={field.value} onChange={field.onChange} label="কুপনটি সক্রিয় (Active)" />
        )}
      />

      <Button type="submit" loading={pending}>
        {coupon ? "আপডেট করুন" : "কুপন যোগ করুন"}
      </Button>
    </form>
  );
}
