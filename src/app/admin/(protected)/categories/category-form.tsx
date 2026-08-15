"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Tables } from "@/types/database.types";
import { createCategory, updateCategory, type CategoryFormValues } from "./actions";

export function CategoryForm({
  category,
  parentOptions,
}: {
  category?: Tables<"categories">;
  parentOptions: ComboboxOption[];
}) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control } = useForm<CategoryFormValues>({
    defaultValues: {
      name_bn: category?.name_bn ?? "",
      name_en: category?.name_en ?? "",
      slug: category?.slug ?? "",
      description_bn: category?.description_bn ?? "",
      description_en: category?.description_en ?? "",
      image_url: category?.image_url ?? "",
      parent_id: category?.parent_id ?? "",
      seo_title: category?.seo_title ?? "",
      seo_description: category?.seo_description ?? "",
      display_order: category?.display_order ?? 0,
      is_active: category?.is_active ?? true,
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    startTransition(async () => {
      try {
        if (category) {
          await updateCategory(category.id, values);
        } else {
          await createCategory(values);
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
        <h2 className="mb-4 font-medium text-foreground">মূল তথ্য</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>নাম (বাংলা)</FieldLabel>
            <Input {...register("name_bn", { required: true })} />
          </div>
          <div>
            <FieldLabel>Name (English)</FieldLabel>
            <Input {...register("name_en")} />
          </div>
          <div>
            <FieldLabel>Slug (খালি রাখলে auto)</FieldLabel>
            <Input placeholder="diapers" {...register("slug")} />
          </div>
          <div>
            <FieldLabel>প্যারেন্ট ক্যাটাগরি (ঐচ্ছিক)</FieldLabel>
            <Controller
              control={control}
              name="parent_id"
              render={({ field }) => (
                <Combobox options={parentOptions} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <FieldLabel>ক্রম (Display Order)</FieldLabel>
            <Input type="number" {...register("display_order")} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium text-foreground">ছবি ও বিবরণ</h2>
        <Controller
          control={control}
          name="image_url"
          render={({ field }) => (
            <ImageUploader bucket="category-images" value={field.value} onChange={field.onChange} />
          )}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>বিবরণ (বাংলা)</FieldLabel>
            <Textarea rows={3} {...register("description_bn")} />
          </div>
          <div>
            <FieldLabel>Description (English)</FieldLabel>
            <Textarea rows={3} {...register("description_en")} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-medium text-foreground">SEO</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>SEO Title</FieldLabel>
            <Input {...register("seo_title")} />
          </div>
          <div>
            <FieldLabel>SEO Description</FieldLabel>
            <Input {...register("seo_description")} />
          </div>
        </div>
      </div>

      <Controller
        control={control}
        name="is_active"
        render={({ field }) => (
          <Switch
            checked={field.value}
            onChange={field.onChange}
            label="ক্যাটাগরিটি সক্রিয় (Active)"
            description="বন্ধ থাকলে ওয়েবসাইটে দেখা যাবে না"
          />
        )}
      />

      <Button type="submit" loading={pending}>
        {category ? "আপডেট করুন" : "ক্যাটাগরি যোগ করুন"}
      </Button>
    </form>
  );
}
