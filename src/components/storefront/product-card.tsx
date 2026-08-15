"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart/cart-context";
import { getEffectivePrice, formatBDT } from "@/lib/pricing";

export type ProductCardData = {
  id: string;
  name_bn: string;
  slug: string;
  regular_price: number;
  sale_price: number | null;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  stock_quantity: number;
  manage_stock: boolean;
  has_variants: boolean;
  image: string | null;
  badges: { name_bn: string; color_hex: string }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const { price, originalPrice, onSale, discountPercent } = getEffectivePrice(product);
  const outOfStock = product.manage_stock && product.stock_quantity <= 0 && !product.has_variants;

  const handleAddToCart = () => {
    if (product.has_variants) return;
    addItem(product.id, null, 1);
    toast.success("কার্টে যোগ করা হয়েছে");
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-surface-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name_bn}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-foreground/20">
            <ImageOff className="size-8" />
          </div>
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {onSale && (
            <span className="rounded-full bg-accent-600 px-2 py-0.5 text-[11px] font-semibold text-white">
              -{discountPercent}%
            </span>
          )}
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b.name_bn}
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
              style={{ backgroundColor: b.color_hex }}
            >
              {b.name_bn}
            </span>
          ))}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground">স্টক নেই</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-medium text-foreground transition-colors hover:text-primary-700">
          {product.name_bn}
        </Link>
        <div className="flex items-baseline gap-1.5">
          <span className={onSale ? "font-semibold text-accent-600" : "font-semibold text-foreground"}>
            {formatBDT(price)}
          </span>
          {onSale && <span className="text-xs text-foreground/40 line-through">{formatBDT(originalPrice)}</span>}
        </div>

        {product.has_variants ? (
          <Link
            href={`/products/${product.slug}`}
            className="mt-auto flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary-50 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
          >
            অপশন দেখুন
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="mt-auto flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-primary-500 to-primary-600 text-xs font-medium text-white shadow-sm transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-md disabled:from-border disabled:to-border disabled:text-foreground/40 disabled:shadow-none"
          >
            <ShoppingCart className="size-3.5" /> কার্টে যোগ করুন
          </button>
        )}
      </div>
    </div>
  );
}
