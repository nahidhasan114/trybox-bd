"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, FieldLabel, FieldError } from "@/components/ui/input";

const schema = z.object({
  email: z.string().min(1, "ইমেইল দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setSubmitting(false);

    if (error) {
      toast.error("পাঠানো যায়নি, একটু পর আবার চেষ্টা করুন");
      return;
    }
    setSent(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto mb-3 size-10 text-primary-600" />
            <h1 className="text-lg font-semibold text-foreground">ইমেইল পাঠানো হয়েছে</h1>
            <p className="mt-2 text-sm text-foreground/60">
              আপনার ইমেইলে একটা পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। ইমেইল চেক করুন (Spam/Junk ফোল্ডারও দেখুন)।
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-center text-xl font-semibold text-primary-700">পাসওয়ার্ড ভুলে গেছেন?</h1>
            <p className="mt-1 text-center text-sm text-foreground/60">
              আপনার Admin ইমেইল দিন, আমরা একটা রিসেট লিংক পাঠাব
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <FieldLabel>ইমেইল</FieldLabel>
                <Input type="email" placeholder="you@example.com" {...register("email")} />
                <FieldError>{errors.email?.message}</FieldError>
              </div>

              <Button type="submit" className="w-full" loading={submitting}>
                রিসেট লিংক পাঠান
              </Button>
            </form>
          </>
        )}

        <Link
          href="/admin/login"
          className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-primary-700"
        >
          <ArrowLeft className="size-4" /> লগইন পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
