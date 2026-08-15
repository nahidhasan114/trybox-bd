"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Tables } from "@/types/database.types";

export function HeroBanner({ banners }: { banners: Tables<"banners">[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
      <div className="relative h-[190px] w-full overflow-hidden rounded-2xl bg-surface-muted sm:h-[280px] lg:h-[360px]">
        {banners.map((b, i) => {
          const slideContent = (
            <>
              <picture>
                <source media="(max-width: 640px)" srcSet={b.mobile_image_url ?? b.desktop_image_url} />
                <Image
                  src={b.desktop_image_url}
                  alt={b.title ?? ""}
                  fill
                  unoptimized
                  priority={i === 0}
                  className="object-cover"
                />
              </picture>
              {(b.title || b.subtitle || b.cta_text) && (
                <div className="absolute inset-0 flex flex-col justify-center gap-2 bg-gradient-to-r from-black/50 via-black/10 to-transparent p-6 sm:p-10">
                  {b.title && <h2 className="max-w-md text-xl font-semibold text-white sm:text-3xl">{b.title}</h2>}
                  {b.subtitle && <p className="max-w-sm text-sm text-white/90 sm:text-base">{b.subtitle}</p>}
                  {b.cta_text && (
                    <span className="mt-2 inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground">
                      {b.cta_text}
                    </span>
                  )}
                </div>
              )}
            </>
          );

          return (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {b.cta_url ? (
                <Link href={b.cta_url} className="relative block size-full">
                  {slideContent}
                </Link>
              ) : (
                <div className="relative block size-full">{slideContent}</div>
              )}
            </div>
          );
        })}

        {banners.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
              className="absolute left-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground hover:bg-white"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % banners.length)}
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground hover:bg-white"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
