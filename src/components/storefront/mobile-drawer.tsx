"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Phone, Truck } from "lucide-react";

export type NavCategory = { name_bn: string; slug: string };

export function MobileDrawer({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-surface-muted lg:hidden"
        aria-label="Menu"
      >
        <Menu className="size-5 text-foreground/70" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-full max-w-xs flex-col overflow-y-auto bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-medium text-foreground">Menu</span>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-surface-muted">
                <X className="size-5" />
              </button>
            </div>

            <nav className="flex flex-col p-2">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "Combo Offers", href: "/shop?type=combo" },
                { label: "New Arrivals", href: "/shop?new=1" },
                { label: "Best Sellers", href: "/shop?best=1" },
                { label: "Offers", href: "/shop?offer=1" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-border p-2">
              <p className="px-3 py-2 text-xs font-medium text-foreground/40">Categories</p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-surface-muted"
                >
                  {c.name_bn}
                  <ChevronRight className="size-4 text-foreground/30" />
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-1 border-t border-border p-2">
              <Link
                href="/track-order"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-surface-muted"
              >
                <Truck className="size-4" /> Track Order
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-surface-muted"
              >
                <Phone className="size-4" /> Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
