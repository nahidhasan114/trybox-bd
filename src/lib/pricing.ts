export type PricedProduct = {
  regular_price: number;
  sale_price: number | null;
  sale_starts_at?: string | null;
  sale_ends_at?: string | null;
};

export function getEffectivePrice(p: PricedProduct) {
  const now = Date.now();
  const started = !p.sale_starts_at || new Date(p.sale_starts_at).getTime() <= now;
  const notEnded = !p.sale_ends_at || new Date(p.sale_ends_at).getTime() >= now;
  const onSale = p.sale_price != null && p.sale_price < p.regular_price && started && notEnded;

  const price = onSale ? (p.sale_price as number) : p.regular_price;
  const discountPercent = onSale
    ? Math.round(((p.regular_price - (p.sale_price as number)) / p.regular_price) * 100)
    : 0;

  return { price, originalPrice: p.regular_price, onSale, discountPercent };
}

export function formatBDT(amount: number) {
  return `৳${Math.round(amount).toLocaleString("en-US")}`;
}
