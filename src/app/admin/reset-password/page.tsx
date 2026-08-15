"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, FieldLabel, FieldError } from "@/components/ui/input";

const schema = z
  .object({
    password: z.string().min(6, "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "দুটো পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else toast.error("লিংকের মেয়াদ শেষ হয়ে গেছে, আবার রিসেট লিংক চেয়ে নিন");
    });
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });
    setSubmitting(false);

    if (error) {
      toast.error("পাসওয়ার্ড পরিবর্তন করা যায়নি");
      return;
    }

    toast.success("পাসওয়ার্ড পরিবর্তন হয়েছে, এখন লগইন করুন");
    router.replace("/admin/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <KeyRound className="mx-auto mb-2 size-8 text-primary-600" />
        <h1 className="text-center text-xl font-semibold text-primary-700">নতুন পাসওয়ার্ড দিন</h1>

        {!ready ? (
          <p className="mt-4 text-center text-sm text-foreground/60">লিংক যাচাই করা হচ্ছে...</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <FieldLabel>নতুন পাসওয়ার্ড</FieldLabel>
              <Input type="password" placeholder="••••••••" {...register("password")} />
              <FieldError>{errors.password?.message}</FieldError>
            </div>
            <div>
              <FieldLabel>পাসওয়ার্ড আবার লিখুন</FieldLabel>
              <Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </div>
            <Button type="submit" className="w-full" loading={submitting}>
              পাসওয়ার্ড পরিবর্তন করুন
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
