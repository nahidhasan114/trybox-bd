"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavCategory } from "./mobile-drawer";

export function MegaMenu({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primary-700"
      >
        Categories <ChevronDown className="size-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-lg">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-surface-muted hover:text-primary-700"
            >
              {c.name_bn}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
