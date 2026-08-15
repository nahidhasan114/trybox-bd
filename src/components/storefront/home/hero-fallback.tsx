import Link from "next/link";
import { ShieldCheck, Truck, Baby } from "lucide-react";

export function HeroFallback({ businessName }: { businessName: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 px-6 py-14 sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-accent-500/20 blur-2xl" />

        <div className="relative flex flex-col items-start gap-4">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            Baby &amp; Mother Care, Trusted in Bangladesh
          </span>
          <h1 className="max-w-lg text-2xl font-semibold text-white sm:text-4xl">{businessName}</h1>
          <p className="max-w-md text-sm text-white/85 sm:text-base">
            আপনার ছোট্ট সোনামণির জন্য নির্ভরযোগ্য ডায়াপার, ফিডিং ও হেলথ কেয়ার প্রোডাক্ট, এক জায়গায়।
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            শপিং শুরু করুন
          </Link>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/80 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Truck className="size-4" /> সারা বাংলাদেশে ডেলিভারি
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4" /> নিরাপদ শপিং
            </span>
            <span className="flex items-center gap-1.5">
              <Baby className="size-4" /> শুধুই বেবি প্রোডাক্ট
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
