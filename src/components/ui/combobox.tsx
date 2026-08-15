"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type ComboboxOption = { value: string; label: string };

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "খুঁজুন...",
  emptyLabel = "কিছু পাওয়া যায়নি",
  allowClear = true,
}: {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  allowClear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-surface px-4 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <span className={cn(!selected && "text-foreground/40")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="size-4 text-foreground/40" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="size-4 text-foreground/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="লিখে খুঁজুন..."
              className="w-full text-sm outline-none placeholder:text-foreground/40"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {allowClear && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center px-3 py-2 text-left text-sm text-foreground/50 hover:bg-surface-muted"
              >
                — কোনোটি নয় —
              </button>
            )}
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-foreground/40">{emptyLabel}</p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-muted"
                >
                  {o.label}
                  {o.value === value && <Check className="size-4 text-primary-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
