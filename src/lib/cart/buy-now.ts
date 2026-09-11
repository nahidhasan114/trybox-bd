"use client";

const KEY = "trybox_buy_now";

export type BuyNowItem = { productId: string; variantId: string | null; quantity: number; customization: string[] | null };

export function setBuyNowItems(items: BuyNowItem[]) {
  window.sessionStorage.setItem(KEY, JSON.stringify(items));
}

export function getBuyNowItems(): BuyNowItem[] {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return parsed ? [parsed] : [];
  } catch {
    return [];
  }
}

export function clearBuyNowItem() {
  window.sessionStorage.removeItem(KEY);
}
