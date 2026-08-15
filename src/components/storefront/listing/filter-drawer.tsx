"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export function FilterDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-medium text-foreground lg:hidden"
      >
        <SlidersHorizontal className="size-4" /> ফিল্টার
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-surface p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-medium text-foreground">ফিল্টার</span>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-surface-muted">
                <X className="size-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
