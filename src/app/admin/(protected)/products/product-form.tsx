"use client";

import { useState, useTransition } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Star } from "lucide-react";
import { Input, FieldLabel } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { ImageUploader } from "@/components/admin/image-uploader";
import { NameAutocompleteHint } from "./name-autocomplete";
import { createProduct, updateProduct, type ProductFormValues } from "./actions";
import { cn } from "@/lib/utils";

type ProductWithChildren = {
  id: string;
  name_bn: string;
  name_en: string | null;
  slug: string;
  sku: string | null;
  category_id: string | null;
  brand_id: string | null;
  product_type: string;
  status: string;
  regular_price: number;
  sale_price: number | null;
  cost_price: number | null;
  manage_stock: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  weight_grams: number;
  has_variants: boolean;
  is_free_delivery: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  short_description_bn: string | null;
  short_description_en: string | null;
  description_bn: string | null;
  description_en: string | null;
  seo_title: string | null;
  seo_description: string | null;
  variants: {
    id: string;
    variant_name: string;
    sku: string | null;
    attributes: unknown;
    regular_price: number | null;
    sale_price: number | null;
    stock_quantity: number;
    is_default: boolean;
    is_active: boolean;
  }[];
  images: { id: string; image_url: string; is_main: boolean }[];
  videos: { video_url: string }[];
  badge_ids: string[];
};

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

function attributesToText(attrs: unknown): string {
  if (!attrs || typeof attrs !== "object") return "";
  return Object.entries(attrs as Record<string, string>)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-medium text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-foreground/50">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export function ProductForm({
  product,
  categoryOptions,
  brandOptions,
  badges,
}: {
  product?: ProductWithChildren;
  categoryOptions: ComboboxOption[];
  brandOptions: ComboboxOption[];
  badges: { id: string; name_bn: string; color_hex: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control, watch } = useForm<ProductFormValues>({
    defaultValues: {
      name_bn: product?.name_bn ?? "",
      name_en: product?.name_en ?? "",
      slug: product?.slug ?? "",
      sku: product?.sku ?? "",
      category_id: product?.category_id ?? "",
      brand_id: product?.brand_id ?? "",
      product_type: product?.product_type ?? "simple",
      status: product?.status ?? "draft",
      regular_price: product?.regular_price ?? 0,
      sale_price: product?.sale_price ?? null,
      cost_price: product?.cost_price ?? null,
      manage_stock: product?.manage_stock ?? true,
      stock_quantity: product?.stock_quantity ?? 0,
      low_stock_threshold: product?.low_stock_threshold ?? 5,
      weight_grams: product?.weight_grams ?? 500,
      has_variants: product?.has_variants ?? false,
      is_free_delivery: product?.is_free_delivery ?? false,
      is_featured: product?.is_featured ?? false,
      is_best_seller: product?.is_best_seller ?? false,
      is_new_arrival: product?.is_new_arrival ?? true,
      sale_starts_at: toDateTimeLocal(product?.sale_starts_at ?? null),
      sale_ends_at: toDateTimeLocal(product?.sale_ends_at ?? null),
      short_description_bn: product?.short_description_bn ?? "",
      short_description_en: product?.short_description_en ?? "",
      description_bn: product?.description_bn ?? "",
      description_en: product?.description_en ?? "",
      video_url: product?.videos?.[0]?.video_url ?? "",
      seo_title: product?.seo_title ?? "",
      seo_description: product?.seo_description ?? "",
      badge_ids: product?.badge_ids ?? [],
      variants: (product?.variants ?? []).map((v) => ({
        id: v.id,
        variant_name: v.variant_name,
        sku: v.sku ?? "",
        attributes_text: attributesToText(v.attributes),
        regular_price: v.regular_price,
        sale_price: v.sale_price,
        stock_quantity: v.stock_quantity,
        is_default: v.is_default,
        is_active: v.is_active,
        display_order: 0,
      })),
      images: (product?.images ?? []).map((img) => ({
        id: img.id,
        image_url: img.image_url,
        is_main: img.is_main,
        display_order: 0,
      })),
    },
  });

  const nameBn = watch("name_bn");
  const hasVariants = watch("has_variants");
  const manageStock = watch("manage_stock");
  const selectedBadges = watch("badge_ids");

  const variantArray = useFieldArray({ control, name: "variants" });
  const imageArray = useFieldArray({ control, name: "images" });

  const [showNameHint, setShowNameHint] = useState(false);

  const onSubmit = (values: ProductFormValues) => {
    startTransition(async () => {
      try {
        if (product) {
          await updateProduct(product.id, values);
        } else {
          await createProduct(values);
        }
      } catch (e) {
        const digest = (e as { digest?: string })?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) throw e;
        toast.error(e instanceof Error ? e.message : "সংরক্ষণ করা যায়নি");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5 pb-10">
      <Section title="মূল তথ্য">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel>প্রোডাক্টের নাম (বাংলা)</FieldLabel>
            <Input
              {...register("name_bn", { required: true })}
              onFocus={() => setShowNameHint(true)}
            />
            {showNameHint && !product && nameBn.length >= 2 && (
              <NameAutocompleteHint query={nameBn} />
            )}
          </div>
          <div>
            <FieldLabel>Product Name (English)</FieldLabel>
            <Input {...register("name_en")} />
          </div>
          <div>
            <FieldLabel>Slug (খালি রাখলে auto)</FieldLabel>
            <Input {...register("slug")} />
          </div>
          <div>
            <FieldLabel>SKU (ঐচ্ছিক)</FieldLabel>
            <Input {...register("sku")} />
          </div>
          <div>
            <FieldLabel>স্ট্যাটাস</FieldLabel>
            <select
              {...register("status")}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="draft">Draft (শুধু অ্যাডমিন দেখবে)</option>
              <option value="active">Active (ওয়েবসাইটে দেখাবে)</option>
              <option value="inactive">Inactive (সাময়িক বন্ধ)</option>
              <option value="archived">Archived (আর্কাইভ)</option>
            </select>
          </div>
          <div>
            <FieldLabel>ক্যাটাগরি</FieldLabel>
            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <Combobox options={categoryOptions} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <FieldLabel>ব্র্যান্ড</FieldLabel>
            <Controller
              control={control}
              name="brand_id"
              render={({ field }) => (
                <Combobox options={brandOptions} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <FieldLabel>ধরন</FieldLabel>
            <select
              {...register("product_type")}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="simple">সাধারণ প্রোডাক্ট</option>
              <option value="combo">কম্বো প্যাকেজ</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="মূল্য" description="টাকায় লিখুন, দশমিক ছাড়া">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel>নিয়মিত মূল্য (৳)</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...register("regular_price", { valueAsNumber: true, required: true })}
            />
          </div>
          <div>
            <FieldLabel>বিশেষ মূল্য (৳, ঐচ্ছিক)</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...register("sale_price", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
            />
          </div>
          <div>
            <FieldLabel>ক্রয় মূল্য (৳, শুধু অ্যাডমিনের জন্য)</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...register("cost_price", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
            />
          </div>
          <div>
            <FieldLabel>অফার শুরু (ঐচ্ছিক)</FieldLabel>
            <Input type="datetime-local" {...register("sale_starts_at")} />
          </div>
          <div>
            <FieldLabel>অফার শেষ (ঐচ্ছিক)</FieldLabel>
            <Input type="datetime-local" {...register("sale_ends_at")} />
          </div>
        </div>
      </Section>

      <Section title="স্টক">
        <Controller
          control={control}
          name="manage_stock"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={field.onChange}
              label="স্টক ট্র্যাক করুন"
              description="বন্ধ থাকলে স্টক ফুরিয়ে গেলেও অর্ডার নেওয়া যাবে"
            />
          )}
        />
        <Controller
          control={control}
          name="has_variants"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={field.onChange}
              label="এই প্রোডাক্টের ভ্যারিয়েন্ট আছে"
              description="যেমন: সাইজ, রং অনুযায়ী আলাদা দাম/স্টক"
            />
          )}
        />
        {manageStock && !hasVariants && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>স্টক পরিমাণ</FieldLabel>
              <Input type="number" {...register("stock_quantity", { valueAsNumber: true })} />
            </div>
            <div>
              <FieldLabel>লো স্টক এলার্ট (এর নিচে নামলে সতর্ক করবে)</FieldLabel>
              <Input type="number" {...register("low_stock_threshold", { valueAsNumber: true })} />
            </div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>প্যাকেজের ওজন (গ্রাম)</FieldLabel>
            <Input type="number" {...register("weight_grams", { valueAsNumber: true })} />
            <p className="mt-1 text-xs text-foreground/40">ডেলিভারি চার্জ এই ওজনের উপর নির্ভর করে হিসাব হয়</p>
          </div>
        </div>
      </Section>

      {hasVariants && (
        <Section title="ভ্যারিয়েন্ট" description="প্রতিটি সাইজ/রং আলাদা সারিতে যোগ করুন">
          <div className="space-y-3">
            {variantArray.fields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/50">
                    <GripVertical className="size-3.5" /> ভ্যারিয়েন্ট {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => variantArray.remove(index)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>নাম (যেমন: S Size - 56pcs)</FieldLabel>
                    <Input {...register(`variants.${index}.variant_name`, { required: true })} />
                  </div>
                  <div>
                    <FieldLabel>SKU (ঐচ্ছিক)</FieldLabel>
                    <Input {...register(`variants.${index}.sku`)} />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel>বৈশিষ্ট্য (যেমন: Size: S, Pack: 56pcs)</FieldLabel>
                    <Input placeholder="Size: S, Pack: 56pcs" {...register(`variants.${index}.attributes_text`)} />
                  </div>
                  <div>
                    <FieldLabel>নিয়মিত মূল্য (৳, ঐচ্ছিক)</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.regular_price`, {
                        setValueAs: (v) => (v === "" ? null : Number(v)),
                      })}
                    />
                  </div>
                  <div>
                    <FieldLabel>বিশেষ মূল্য (৳, ঐচ্ছিক)</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.sale_price`, {
                        setValueAs: (v) => (v === "" ? null : Number(v)),
                      })}
                    />
                  </div>
                  <div>
                    <FieldLabel>স্টক</FieldLabel>
                    <Input type="number" {...register(`variants.${index}.stock_quantity`, { valueAsNumber: true })} />
                  </div>
                  <div className="flex items-end gap-4 pb-1">
                    <label className="flex items-center gap-1.5 text-sm text-foreground/70">
                      <input type="checkbox" className="size-4" {...register(`variants.${index}.is_default`)} />
                      ডিফল্ট
                    </label>
                    <label className="flex items-center gap-1.5 text-sm text-foreground/70">
                      <input type="checkbox" className="size-4" defaultChecked {...register(`variants.${index}.is_active`)} />
                      সক্রিয়
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                variantArray.append({
                  variant_name: "",
                  sku: "",
                  attributes_text: "",
                  regular_price: null,
                  sale_price: null,
                  stock_quantity: 0,
                  is_default: variantArray.fields.length === 0,
                  is_active: true,
                  display_order: variantArray.fields.length,
                })
              }
            >
              <Plus className="size-4" /> ভ্যারিয়েন্ট যোগ করুন
            </Button>
          </div>
        </Section>
      )}

      <Section title="ছবি" description="প্রথম ছবি বা তারকা চিহ্নিত ছবি মূল ছবি হিসেবে দেখাবে">
        <div className="flex flex-wrap gap-4">
          {imageArray.fields.map((field, index) => (
            <div key={field.id} className="relative">
              <Controller
                control={control}
                name={`images.${index}.image_url`}
                render={({ field: f }) => (
                  <ImageUploader bucket="product-images" value={f.value} onChange={f.onChange} />
                )}
              />
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <label className="flex items-center gap-1 text-xs text-foreground/60">
                  <input type="checkbox" className="size-3.5" {...register(`images.${index}.is_main`)} />
                  <Star className="size-3" /> মূল ছবি
                </label>
                <button
                  type="button"
                  onClick={() => imageArray.remove(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  মুছুন
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            imageArray.append({ image_url: "", is_main: imageArray.fields.length === 0, display_order: imageArray.fields.length })
          }
        >
          <Plus className="size-4" /> ছবি যোগ করুন
        </Button>

        <div className="pt-2">
          <FieldLabel>YouTube ভিডিও লিংক (ঐচ্ছিক)</FieldLabel>
          <Input placeholder="https://youtube.com/watch?v=..." {...register("video_url")} />
        </div>
      </Section>

      <Section title="বিবরণ">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>সংক্ষিপ্ত বিবরণ (বাংলা)</FieldLabel>
            <Textarea rows={2} {...register("short_description_bn")} />
          </div>
          <div>
            <FieldLabel>Short Description (English)</FieldLabel>
            <Textarea rows={2} {...register("short_description_en")} />
          </div>
          <div>
            <FieldLabel>বিস্তারিত বিবরণ (বাংলা)</FieldLabel>
            <Textarea rows={5} {...register("description_bn")} />
          </div>
          <div>
            <FieldLabel>Full Description (English)</FieldLabel>
            <Textarea rows={5} {...register("description_en")} />
          </div>
        </div>
      </Section>

      <Section title="মার্কেটিং">
        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={control}
            name="is_featured"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} label="Featured প্রোডাক্ট" />
            )}
          />
          <Controller
            control={control}
            name="is_best_seller"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} label="Best Seller" />
            )}
          />
          <Controller
            control={control}
            name="is_new_arrival"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} label="New Arrival" />
            )}
          />
          <Controller
            control={control}
            name="is_free_delivery"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} label="Free Delivery" />
            )}
          />
        </div>
        {badges.length > 0 && (
          <div>
            <FieldLabel>ব্যাজ</FieldLabel>
            <Controller
              control={control}
              name="badge_ids"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => {
                    const active = field.value.includes(badge.id);
                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            active
                              ? field.value.filter((id) => id !== badge.id)
                              : [...field.value, badge.id],
                          )
                        }
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          active ? "text-white" : "border-border bg-surface text-foreground/60",
                        )}
                        style={active ? { backgroundColor: badge.color_hex, borderColor: badge.color_hex } : undefined}
                      >
                        {badge.name_bn}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <p className="mt-1 text-xs text-foreground/40">{selectedBadges.length} টি নির্বাচিত</p>
          </div>
        )}
      </Section>

      <Section title="SEO">
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
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" loading={pending} size="lg" className="shadow-lg">
          {product ? "আপডেট করুন" : "প্রোডাক্ট যোগ করুন"}
        </Button>
      </div>
    </form>
  );
}
