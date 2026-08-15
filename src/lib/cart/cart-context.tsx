"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

export type CartLine = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

const STORAGE_KEY = "trybox_cart_v1";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  addItem: (productId: string, variantId: string | null, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartLine, productId: string, variantId: string | null) {
  return a.productId === productId && a.variantId === variantId;
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLines(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((productId: string, variantId: string | null, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, productId, variantId));
      if (existing) {
        return prev.map((l) =>
          sameLine(l, productId, variantId) ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...prev, { productId, variantId, quantity }];
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string | null, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => !sameLine(l, productId, variantId));
      return prev.map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity } : l));
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: string | null) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, productId, variantId)));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const value: CartContextValue = {
    lines,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isDrawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
