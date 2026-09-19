"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput, FieldLabel, FieldError } from "@/components/ui/input";

const GATE_ANSWER = "boss114";
const GATE_SESSION_KEY = "trybox_admin_gate_ok";

const schema = z.object({
  email: z.string().min(1, "ইমেইল দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

type FormValues = z.infer<typeof schema>;

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === GATE_ANSWER) {
      window.sessionStorage.setItem(GATE_SESSION_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <ShieldCheck className="mx-auto mb-2 size-8 text-primary-600" />
        <h1 className="text-center text-xl font-semibold text-primary-700">আপনি কে?</h1>
        <p className="mt-1 text-center text-sm text-foreground/60">চালিয়ে যেতে সঠিক উত্তর দিন</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              autoFocus
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError(false);
              }}
              placeholder="উত্তর লিখুন"
            />
            {error && <FieldError>ভুল উত্তর, আবার চেষ্টা করুন</FieldError>}
          </div>
          <Button type="submit" className="w-full">
            চালিয়ে যান
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [checkingGate, setCheckingGate] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (window.sessionStorage.getItem(GATE_SESSION_KEY) === "1") setUnlocked(true);
    setCheckingGate(false);
  }, []);

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

  if (checkingGate) {
    return <main className="min-h-screen bg-surface-muted" />;
  }

  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />;
  }

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
            <PasswordInput placeholder="••••••••" {...register("password")} />
            <FieldError>{errors.password?.message}</FieldError>
          </div>

          <Button type="submit" className="w-full" loading={submitting}>
            লগইন করুন
          </Button>
        </form>

        <Link
          href="/admin/forgot-password"
          className="mt-4 block text-center text-sm font-medium text-primary-600 hover:underline"
        >
          পাসওয়ার্ড ভুলে গেছেন?
        </Link>
      </div>
    </main>
  );
}
