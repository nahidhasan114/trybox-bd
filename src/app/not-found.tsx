import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <SearchX className="size-16 text-foreground/20" />
      <h1 className="text-2xl font-semibold text-foreground">পেজটি খুঁজে পাওয়া যায়নি</h1>
      <p className="max-w-sm text-sm text-foreground/60">
        যে পেজটি আপনি খুঁজছেন তা হয়তো সরিয়ে ফেলা হয়েছে অথবা লিংকটি সঠিক নয়।
      </p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          হোমে ফিরে যান
        </Link>
        <Link href="/shop" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted">
          পণ্য দেখুন
        </Link>
      </div>
    </div>
  );
}
