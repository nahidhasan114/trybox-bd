"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Tables } from "@/types/database.types";
import { createBrand, updateBrand, type BrandFormValues } from "./actions";

export function BrandForm({ brand }: { brand?: Tables<"brands"> }) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control } = useForm<BrandFormValues>({
    defaultValues: {
      name: brand?.name ?? "",
      slug: brand?.slug ?? "",
      logo_url: brand?.logo_url ?? "",
      description: brand?.description ?? "",
      display_order: brand?.display_order ?? 0,
      is_active: brand?.is_active ?? true,
    },
  });

  const onSubmit = (values: BrandFormValues) => {
    startTransition(async () => {
      try {
        if (brand) {
          await updateBrand(brand.id, values);
        } else {
          await createBrand(values);
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
        <h2 className="mb-4 font-medium text-foreground">ব্র্যান্ডের তথ্য</h2>
        <Controller
          control={control}
          name="logo_url"
          render={({ field }) => (
            <ImageUploader bucket="branding" label="লোগো" value={field.value} onChange={field.onChange} />
          )}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>ব্র্যান্ডের নাম</FieldLabel>
            <Input {...register("name", { required: true })} />
          </div>
          <input type="hidden" {...register("slug")} />
          <div>
            <FieldLabel>ক্রম (Display Order)</FieldLabel>
            <Input type="number" {...register("display_order")} />
          </div>
        </div>
        <div className="mt-4">
          <FieldLabel>বিবরণ (ঐচ্ছিক)</FieldLabel>
          <Textarea rows={3} {...register("description")} />
        </div>
      </div>

      <Controller
        control={control}
        name="is_active"
        render={({ field }) => (
          <Switch checked={field.value} onChange={field.onChange} label="ব্র্যান্ডটি সক্রিয় (Active)" />
        )}
      />

      <Button type="submit" loading={pending}>
        {brand ? "আপডেট করুন" : "ব্র্যান্ড যোগ করুন"}
      </Button>
    </form>
  );
}
