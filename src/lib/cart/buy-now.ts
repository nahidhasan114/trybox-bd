"use client";

const KEY = "trybox_buy_now";

export type BuyNowItem = { productId: string; variantId: string | null; quantity: number; customization: string[] | null };

export function setBuyNowItem(item: BuyNowItem) {
  window.sessionStorage.setItem(KEY, JSON.stringify(item));
}

export function getBuyNowItem(): BuyNowItem | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearBuyNowItem() {
  window.sessionStorage.removeItem(KEY);
}
