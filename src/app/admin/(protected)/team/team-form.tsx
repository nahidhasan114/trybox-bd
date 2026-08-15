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
import { createTeamMember, updateTeamMember, type TeamMemberFormValues } from "./actions";

export function TeamForm({ member }: { member?: Tables<"team_members"> }) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control } = useForm<TeamMemberFormValues>({
    defaultValues: {
      name: member?.name ?? "",
      designation: member?.designation ?? "",
      photo_url: member?.photo_url ?? "",
      phone: member?.phone ?? "",
      email: member?.email ?? "",
      bio: member?.bio ?? "",
      display_order: member?.display_order ?? 0,
      is_active: member?.is_active ?? true,
    },
  });

  const onSubmit = (values: TeamMemberFormValues) => {
    startTransition(async () => {
      try {
        if (member) {
          await updateTeamMember(member.id, values);
        } else {
          await createTeamMember(values);
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
        <h2 className="mb-4 font-medium text-foreground">সদস্যের তথ্য</h2>
        <Controller
          control={control}
          name="photo_url"
          render={({ field }) => (
            <ImageUploader bucket="team-photos" label="ছবি" value={field.value} onChange={field.onChange} />
          )}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>নাম</FieldLabel>
            <Input {...register("name", { required: true })} />
          </div>
          <div>
            <FieldLabel>পদবি (যেমন: CEO & Founder)</FieldLabel>
            <Input {...register("designation")} />
          </div>
          <div>
            <FieldLabel>ফোন নম্বর (ঐচ্ছিক)</FieldLabel>
            <Input {...register("phone")} />
          </div>
          <div>
            <FieldLabel>ইমেইল (ঐচ্ছিক)</FieldLabel>
            <Input type="email" {...register("email")} />
          </div>
          <div>
            <FieldLabel>ক্রম (Display Order)</FieldLabel>
            <Input type="number" {...register("display_order", { valueAsNumber: true })} />
          </div>
        </div>
        <div className="mt-4">
          <FieldLabel>সংক্ষিপ্ত পরিচিতি (ঐচ্ছিক)</FieldLabel>
          <Textarea rows={3} placeholder="এই সদস্য সম্পর্কে কিছু কথা" {...register("bio")} />
        </div>
      </div>

      <Controller
        control={control}
        name="is_active"
        render={({ field }) => (
          <Switch
            checked={field.value}
            onChange={field.onChange}
            label="ওয়েবসাইটে দেখানো হবে"
            description="বন্ধ থাকলে 'আমাদের সম্পর্কে' পেজে দেখাবে না"
          />
        )}
      />

      <Button type="submit" loading={pending}>
        {member ? "আপডেট করুন" : "সদস্য যোগ করুন"}
      </Button>
    </form>
  );
}
