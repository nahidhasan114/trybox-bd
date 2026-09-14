"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="size-16 text-accent-400" />
      <h1 className="text-2xl font-semibold text-foreground">দুঃখিত, একটা সমস্যা হয়েছে</h1>
      <p className="max-w-sm text-sm text-foreground/60">
        পেজটি লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন, সমস্যা থাকলে কিছুক্ষণ পর আবার দেখুন।
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          <RotateCw className="size-4" /> আবার চেষ্টা করুন
        </button>
        <Link href="/" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted">
          হোমে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
