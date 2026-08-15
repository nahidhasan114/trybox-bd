"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Tables } from "@/types/database.types";
import { createBanner, updateBanner, type BannerFormValues } from "./actions";

function toDateInput(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export function BannerForm({ banner }: { banner?: Tables<"banners"> }) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control } = useForm<BannerFormValues>({
    defaultValues: {
      title: banner?.title ?? "",
      subtitle: banner?.subtitle ?? "",
      desktop_image_url: banner?.desktop_image_url ?? "",
      mobile_image_url: banner?.mobile_image_url ?? "",
      cta_text: banner?.cta_text ?? "",
      cta_url: banner?.cta_url ?? "",
      display_order: banner?.display_order ?? 0,
      starts_at: toDateInput(banner?.starts_at ?? null),
      ends_at: toDateInput(banner?.ends_at ?? null),
      is_active: banner?.is_active ?? true,
    },
  });

  const onSubmit = (values: BannerFormValues) => {
    startTransition(async () => {
      try {
        if (banner) {
          await updateBanner(banner.id, values);
        } else {
          await createBanner(values);
        }
      } catch (e) {
        const digest = (e as { digest?: string })?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) throw e;
        toast.error("সংরক্ষণ করা যায়নি, আবার চেষ্টা করুন");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium text-foreground">ব্যানার ছবি</h2>
        <div className="flex flex-wrap gap-6">
          <Controller
            control={control}
            name="desktop_image_url"
            render={({ field }) => (
              <ImageUploader
                bucket="banners"
                label="Desktop ছবি (আবশ্যক)"
                aspect="wide"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="mobile_image_url"
            render={({ field }) => (
              <ImageUploader
                bucket="banners"
                label="Mobile ছবি (ঐচ্ছিক)"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium text-foreground">টেক্সট ও লিংক</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Title (ঐচ্ছিক)</FieldLabel>
            <Input {...register("title")} />
          </div>
          <div>
            <FieldLabel>Subtitle (ঐচ্ছিক)</FieldLabel>
            <Input {...register("subtitle")} />
          </div>
          <div>
            <FieldLabel>CTA বাটনের লেখা</FieldLabel>
            <Input placeholder="এখনই কিনুন" {...register("cta_text")} />
          </div>
          <div>
            <FieldLabel>CTA লিংক</FieldLabel>
            <Input placeholder="/shop" {...register("cta_url")} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium text-foreground">সময়সীমা ও ক্রম (Duration &amp; Order)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel>শুরুর তারিখ (ঐচ্ছিক)</FieldLabel>
            <Input type="datetime-local" {...register("starts_at")} />
          </div>
          <div>
            <FieldLabel>শেষের তারিখ (ঐচ্ছিক)</FieldLabel>
            <Input type="datetime-local" {...register("ends_at")} />
          </div>
          <div>
            <FieldLabel>ক্রম (Display Order)</FieldLabel>
            <Input type="number" {...register("display_order")} />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
          <input type="checkbox" className="size-4" {...register("is_active")} />
          এই ব্যানারটি এখন সক্রিয় (Active) থাকবে
        </label>
      </div>

      <Button type="submit" loading={pending}>
        {banner ? "আপডেট করুন" : "ব্যানার যোগ করুন"}
      </Button>
    </form>
  );
}
