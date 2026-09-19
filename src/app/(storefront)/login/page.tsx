"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput, FieldLabel, FieldError } from "@/components/ui/input";

const schema = z.object({
  email: z.string().min(1, "ইমেইল দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setSubmitting(false);
      toast.error("লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড ঠিক আছে কিনা দেখুন।");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.rpc("link_customer_account", {
        p_full_name: (user.user_metadata?.full_name as string | undefined) ?? "",
        p_phone: (user.user_metadata?.phone as string | undefined) ?? "",
        p_email: user.email ?? "",
      });
    }

    setSubmitting(false);
    router.replace(next);
    router.refresh();
  };

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-foreground">লগইন করুন</h1>
        <p className="mt-1 text-center text-sm text-foreground/60">আপনার অর্ডার সহজে ট্র্যাক করুন</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FieldLabel>ইমেইল</FieldLabel>
            <Input type="email" placeholder="you@example.com" {...register("email")} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <FieldLabel>পাসওয়ার্ড</FieldLabel>
            <PasswordInput placeholder="••••••••" {...register("password")} />
            <FieldError>{errors.password?.message}</FieldError>
          </div>

          <Button type="submit" className="w-full" loading={submitting}>
            লগইন করুন
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-foreground/60">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/register" className="font-medium text-primary-600 hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
