"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ImageOff } from "lucide-react";
import { searchProductSuggestions, type SearchSuggestion } from "@/lib/actions/search";

export function NavSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchProductSuggestions(query);
      setSuggestions(results);
      setOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form ref={rootRef} onSubmit={handleSubmit} className={`relative ${className ?? ""}`}>
      <div className="flex h-11 items-center rounded-full border border-border bg-surface-muted px-4">
        <Search className="size-4 shrink-0 text-foreground/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="প্রোডাক্ট, ব্র্যান্ড খুঁজুন..."
          className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          {suggestions.map((s) => (
            <Link
              key={s.id}
              href={`/products/${s.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-surface-muted"
            >
              <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                {s.image ? (
                  <Image src={s.image} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex size-full items-center justify-center text-foreground/20">
                    <ImageOff className="size-4" />
                  </div>
                )}
              </div>
              <span className="line-clamp-1 text-sm text-foreground">{s.name_bn}</span>
            </Link>
          ))}
          <button
            type="submit"
            className="w-full border-t border-border px-3 py-2 text-left text-xs font-medium text-primary-700 hover:bg-surface-muted"
          >
            &quot;{query}&quot; দিয়ে সব ফলাফল দেখুন
          </button>
        </div>
      )}
    </form>
  );
}
