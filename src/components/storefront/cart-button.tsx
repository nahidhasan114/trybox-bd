"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export function CartButton() {
  const { itemCount, openDrawer } = useCart();

  return (
    <button
      onClick={openDrawer}
      className="relative flex size-10 items-center justify-center rounded-full hover:bg-surface-muted"
      aria-label="কার্ট"
    >
      <ShoppingCart className="size-5 text-foreground/70" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-semibold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
