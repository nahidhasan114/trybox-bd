"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, FieldLabel, FieldError } from "@/components/ui/input";

const schema = z.object({
  email: z.string().min(1, "ইমেইল দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
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
    setSubmitting(false);

    if (error) {
      toast.error("লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড ঠিক আছে কিনা দেখুন।");
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-primary-700">
          TryBox BD Admin
        </h1>
        <p className="mt-1 text-center text-sm text-foreground/60">
          Owner / Admin Panel-এ লগইন করুন
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

          <Button type="submit" className="w-full" loading={submitting}>
            লগইন করুন
          </Button>
        </form>
      </div>
    </main>
  );
}
