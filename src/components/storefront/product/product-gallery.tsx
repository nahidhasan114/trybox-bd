"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-muted text-foreground/20">
        <ImageOff className="size-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-muted">
        <Image src={images[active]} alt={name} fill unoptimized priority className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2",
                active === i ? "border-primary-600" : "border-transparent",
              )}
            >
              <Image src={img} alt="" fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
