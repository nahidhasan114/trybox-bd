"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, ImageOff } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { useCartDetails } from "@/lib/cart/use-cart-details";
import { formatBDT } from "@/lib/pricing";

export function MiniCart() {
  const { lines, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
  const { items, loading } = useCartDetails(lines);

  useEffect(() => {
    if (!isDrawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-medium text-foreground">আপনার কার্ট ({items.length})</h2>
          <button onClick={closeDrawer} className="rounded-full p-1.5 hover:bg-surface-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="py-10 text-center text-sm text-foreground/50">লোড হচ্ছে...</p>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag className="size-10 text-foreground/20" />
              <p className="text-sm text-foreground/60">আপনার কার্ট এখনো খালি।</p>
              <button
                onClick={closeDrawer}
                className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}-${(item.customization ?? []).join("|")}`}
                  className="flex gap-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex size-full items-center justify-center text-foreground/20">
                        <ImageOff className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">{item.name}</p>
                    {item.variantName && <p className="text-xs text-foreground/50">{item.variantName}</p>}
                    {item.customization && item.customization.length > 0 && (
                      <p className="text-xs text-primary-700">{item.customization.join(", ")}</p>
                    )}
                    <p className="text-sm font-semibold text-foreground">{formatBDT(item.price)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1, item.customization)}
                        className="flex size-6 items-center justify-center rounded-full border border-border hover:bg-surface-muted"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1, item.customization)}
                        className="flex size-6 items-center justify-center rounded-full border border-border hover:bg-surface-muted"
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId, item.customization)}
                        className="ml-auto text-xs text-red-500 hover:underline"
                      >
                        মুছুন
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-foreground/60">সাবটোটাল</span>
              <span className="font-semibold text-foreground">{formatBDT(subtotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="flex h-11 items-center justify-center rounded-full border border-border text-sm font-medium text-foreground hover:bg-surface-muted"
              >
                কার্ট দেখুন
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="flex h-11 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
              >
                চেকআউট
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
