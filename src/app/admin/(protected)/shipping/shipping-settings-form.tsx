"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateWeightShipping, type WeightShippingSettings } from "./actions";
import type { ShippingTiers } from "@/lib/queries/shipping";

export function ShippingSettingsForm({ tiers }: { tiers: ShippingTiers }) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<WeightShippingSettings>({
    defaultValues: tiers,
  });

  const onSubmit = (values: WeightShippingSettings) => {
    startTransition(async () => {
      try {
        await updateWeightShipping({
          tier1_max_grams: Number(values.tier1_max_grams),
          tier1_charge: Number(values.tier1_charge),
          tier2_max_grams: Number(values.tier2_max_grams),
          tier2_charge: Number(values.tier2_charge),
          tier3_base_charge: Number(values.tier3_base_charge),
          per_kg_charge: Number(values.per_kg_charge),
          free_min_order: Number(values.free_min_order),
        });
        toast.success("শিপিং রেট সংরক্ষণ করা হয়েছে");
      } catch {
        toast.error("সংরক্ষণ করা যায়নি");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-1 font-medium text-foreground">ধাপ ১ — হালকা পণ্য</h2>
        <p className="mb-4 text-xs text-foreground/50">এই ওজন পর্যন্ত ফ্ল্যাট রেট প্রযোজ্য হবে</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>সর্বোচ্চ ওজন (গ্রাম)</FieldLabel>
            <Input type="number" {...register("tier1_max_grams", { valueAsNumber: true })} />
          </div>
          <div>
            <FieldLabel>চার্জ (৳)</FieldLabel>
            <Input type="number" {...register("tier1_charge", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-1 font-medium text-foreground">ধাপ ২ — মাঝারি পণ্য</h2>
        <p className="mb-4 text-xs text-foreground/50">ধাপ ১-এর ওজনের বেশি, কিন্তু এই ওজন পর্যন্ত</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>সর্বোচ্চ ওজন (গ্রাম)</FieldLabel>
            <Input type="number" {...register("tier2_max_grams", { valueAsNumber: true })} />
          </div>
          <div>
            <FieldLabel>চার্জ (৳)</FieldLabel>
            <Input type="number" {...register("tier2_charge", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-1 font-medium text-foreground">ধাপ ৩ — ভারী পণ্য</h2>
        <p className="mb-4 text-xs text-foreground/50">ধাপ ২-এর ওজনের বেশি হলে এই বেস চার্জ + প্রতি কেজিতে অতিরিক্ত চার্জ যোগ হবে</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>বেস চার্জ (৳)</FieldLabel>
            <Input type="number" {...register("tier3_base_charge", { valueAsNumber: true })} />
          </div>
          <div>
            <FieldLabel>প্রতি অতিরিক্ত কেজিতে (৳)</FieldLabel>
            <Input type="number" {...register("per_kg_charge", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-1 font-medium text-foreground">ফ্রি ডেলিভারি (ঐচ্ছিক)</h2>
        <p className="mb-4 text-xs text-foreground/50">অর্ডারের সাবটোটাল এই টাকার বেশি হলে ডেলিভারি ফ্রি হবে। বন্ধ রাখতে ০ দিন।</p>
        <div>
          <FieldLabel>ন্যূনতম অর্ডার (৳)</FieldLabel>
          <Input type="number" {...register("free_min_order", { valueAsNumber: true })} />
        </div>
      </div>

      <Button type="submit" loading={pending}>
        সংরক্ষণ করুন
      </Button>
    </form>
  );
}
