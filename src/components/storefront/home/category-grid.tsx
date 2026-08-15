import Link from "next/link";
import Image from "next/image";
import { PackageOpen } from "lucide-react";
import type { Tables } from "@/types/database.types";

export function CategoryGrid({ categories }: { categories: Tables<"categories">[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground sm:text-xl">ক্যাটাগরি অনুযায়ী কিনুন</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
          >
            <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-full bg-primary-50 transition-transform duration-300 group-hover:scale-105 sm:size-16">
              {c.image_url ? (
                <Image src={c.image_url} alt={c.name_bn} fill className="object-cover" unoptimized />
              ) : (
                <PackageOpen className="size-6 text-primary-500" />
              )}
            </div>
            <span className="line-clamp-2 text-xs font-medium text-foreground/80 transition-colors group-hover:text-primary-700 sm:text-sm">
              {c.name_bn}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
