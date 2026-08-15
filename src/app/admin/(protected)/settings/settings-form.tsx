"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { SiteSettings } from "@/lib/site-settings";
import { updateSiteSettings, type SettingsFormValues } from "./actions";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-medium text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-foreground/50">{description}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control } = useForm<SettingsFormValues>({
    defaultValues: {
      business_name: settings.business_name,
      business_name_bn: settings.business_name_bn,
      logo_url: settings.logo_url,
      phone: settings.phone,
      whatsapp_number: settings.whatsapp_number,
      email: settings.email,
      address: settings.address,
      facebook_url: settings.facebook_url,
      messenger_url: settings.messenger_url,
      bkash_number: settings.bkash_number?.number ?? "",
      nagad_number: settings.nagad_number?.number ?? "",
      default_delivery_charge: settings.default_delivery_charge,
      free_delivery_min_order: settings.free_delivery_min_order,
      seo_default_title: settings.seo_default_title,
      seo_default_description: settings.seo_default_description,
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    startTransition(async () => {
      try {
        await updateSiteSettings({
          ...values,
          default_delivery_charge: Number(values.default_delivery_charge),
          free_delivery_min_order: Number(values.free_delivery_min_order),
        });
        toast.success("সেটিংস সংরক্ষণ করা হয়েছে");
      } catch {
        toast.error("সংরক্ষণ করা যায়নি, আবার চেষ্টা করুন");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Section title="ব্যবসার তথ্য ও লোগো">
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name="logo_url"
            render={({ field }) => (
              <ImageUploader bucket="branding" label="লোগো" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div>
          <FieldLabel>ব্যবসার নাম (বাংলা)</FieldLabel>
          <Input {...register("business_name_bn")} />
        </div>
        <div>
          <FieldLabel>Business Name (English)</FieldLabel>
          <Input {...register("business_name")} />
        </div>
      </Section>

      <Section title="যোগাযোগ">
        <div>
          <FieldLabel>ফোন নম্বর</FieldLabel>
          <Input {...register("phone")} />
        </div>
        <div>
          <FieldLabel>WhatsApp নম্বর</FieldLabel>
          <Input {...register("whatsapp_number")} />
        </div>
        <div>
          <FieldLabel>ইমেইল (ঐচ্ছিক)</FieldLabel>
          <Input type="email" {...register("email")} />
        </div>
        <div>
          <FieldLabel>ঠিকানা (ঐচ্ছিক)</FieldLabel>
          <Input {...register("address")} />
        </div>
      </Section>

      <Section title="সোশ্যাল লিংক">
        <div>
          <FieldLabel>Facebook Page লিংক</FieldLabel>
          <Input {...register("facebook_url")} />
        </div>
        <div>
          <FieldLabel>Messenger লিংক</FieldLabel>
          <Input {...register("messenger_url")} />
        </div>
      </Section>

      <Section title="পেমেন্ট নম্বর" description="কাস্টমার এই নম্বরে টাকা পাঠিয়ে Transaction ID দেবে">
        <div>
          <FieldLabel>bKash নম্বর (Personal)</FieldLabel>
          <Input {...register("bkash_number")} />
        </div>
        <div>
          <FieldLabel>Nagad নম্বর (Personal)</FieldLabel>
          <Input {...register("nagad_number")} />
        </div>
      </Section>

      <Section title="ডেলিভারি">
        <div>
          <FieldLabel>ডিফল্ট ডেলিভারি চার্জ (৳)</FieldLabel>
          <Input type="number" step="1" {...register("default_delivery_charge")} />
        </div>
        <div>
          <FieldLabel>এর বেশি অর্ডারে ফ্রি ডেলিভারি (৳, 0 = বন্ধ)</FieldLabel>
          <Input type="number" step="1" {...register("free_delivery_min_order")} />
        </div>
        <p className="sm:col-span-2 text-xs text-foreground/50">
          ঢাকা/ঢাকার বাইরে আলাদা চার্জের জন্য &quot;শিপিং রুলস&quot; পেজ ব্যবহার করুন।
        </p>
      </Section>

      <Section title="SEO ডিফল্ট">
        <div>
          <FieldLabel>Default SEO Title</FieldLabel>
          <Input {...register("seo_default_title")} />
        </div>
        <div>
          <FieldLabel>Default SEO Description</FieldLabel>
          <Input {...register("seo_default_description")} />
        </div>
      </Section>

      <Button type="submit" loading={pending}>
        সংরক্ষণ করুন
      </Button>
    </form>
  );
}
