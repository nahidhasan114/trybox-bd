"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, FieldLabel, FieldError } from "@/components/ui/input";

const schema = z
  .object({
    fullName: z.string().min(1, "নাম দিন"),
    phone: z.string().regex(/^01[3-9][0-9]{8}$/, "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)"),
    email: z.string().min(1, "ইমেইল দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
    password: z.string().min(6, "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: values.fullName, phone: values.phone },
      },
    });

    if (error) {
      setSubmitting(false);
      if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
        toast.error("এই ইমেইল দিয়ে আগে থেকেই একটা অ্যাকাউন্ট আছে, লগইন করুন");
      } else {
        toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
      }
      return;
    }

    if (data.session) {
      await supabase.rpc("link_customer_account", {
        p_full_name: values.fullName,
        p_phone: values.phone,
        p_email: values.email,
      });
      setSubmitting(false);
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে");
      router.replace("/account");
      router.refresh();
      return;
    }

    setSubmitting(false);
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <MailCheck className="size-14 text-primary-600" />
        <h1 className="text-xl font-semibold text-foreground">ইমেইল চেক করুন</h1>
        <p className="max-w-sm text-sm text-foreground/60">
          আপনার ইমেইলে একটা কনফার্মেশন লিংক পাঠানো হয়েছে। লিংকে ক্লিক করে অ্যাকাউন্ট চালু করুন।
        </p>
        <Link href="/" className="text-sm font-medium text-primary-600 hover:underline">
          হোমে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-foreground">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="mt-1 text-center text-sm text-foreground/60">
          ফ্রি অ্যাকাউন্ট বানিয়ে সহজে অর্ডার ট্র্যাক করুন
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FieldLabel>পূর্ণ নাম</FieldLabel>
            <Input {...register("fullName")} />
            <FieldError>{errors.fullName?.message}</FieldError>
          </div>
          <div>
            <FieldLabel>মোবাইল নম্বর</FieldLabel>
            <Input placeholder="01XXXXXXXXX" {...register("phone")} />
            <FieldError>{errors.phone?.message}</FieldError>
          </div>
          <div>
            <FieldLabel>ইমেইল</FieldLabel>
            <Input type="email" placeholder="you@example.com" {...register("email")} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <FieldLabel>পাসওয়ার্ড</FieldLabel>
            <Input type="password" placeholder="••••••••" {...register("password")} />
            <FieldError>{errors.password?.message}</FieldError>
          </div>
          <div>
            <FieldLabel>পাসওয়ার্ড আবার লিখুন</FieldLabel>
            <Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </div>

          <Button type="submit" className="w-full" loading={submitting}>
            অ্যাকাউন্ট তৈরি করুন
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-foreground/60">
          আগে থেকে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="font-medium text-primary-600 hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
