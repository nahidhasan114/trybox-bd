"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, ImageOff, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useCartDetails } from "@/lib/cart/use-cart-details";
import { formatBDT } from "@/lib/pricing";

export default function CartPage() {
  const { lines, updateQuantity, removeItem } = useCart();
  const { items, loading } = useCartDetails(lines);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const hasStockIssue = items.some((i) => i.manageStock && i.quantity > i.stock);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-foreground/50">লোড হচ্ছে...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-20 text-center">
        <ShoppingBag className="size-14 text-foreground/20" />
        <h1 className="text-lg font-semibold text-foreground">আপনার কার্ট এখনো খালি।</h1>
        <Link href="/shop" className="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="mb-5 text-xl font-semibold text-foreground">আপনার কার্ট</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => {
            const overStock = item.manageStock && item.quantity > item.stock;
            return (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 rounded-2xl border border-border bg-surface p-3">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex size-full items-center justify-center text-foreground/20">
                      <ImageOff className="size-5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link href={`/products/${item.slug}`} className="text-sm font-medium text-foreground hover:text-primary-700">
                    {item.name}
                  </Link>
                  {item.variantName && <p className="text-xs text-foreground/50">{item.variantName}</p>}
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{formatBDT(item.price)}</p>
                  {overStock && (
                    <p className="mt-1 text-xs text-red-600">মাত্র {item.stock}টি স্টকে আছে</p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="flex size-8 items-center justify-center hover:bg-surface-muted"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="flex size-8 items-center justify-center hover:bg-surface-muted"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                    >
                      <Trash2 className="size-3.5" /> মুছুন
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">সাবটোটাল</span>
            <span className="font-semibold text-foreground">{formatBDT(subtotal)}</span>
          </div>
          <p className="text-xs text-foreground/40">ডেলিভারি চার্জ চেকআউটে যোগ হবে</p>
          {hasStockIssue && (
            <p className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600">
              কিছু প্রোডাক্টের চাহিদামতো স্টক নেই, পরিমাণ কমিয়ে নিন।
            </p>
          )}
          <Link
            href="/checkout"
            className="flex h-12 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700"
          >
            চেকআউট করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
