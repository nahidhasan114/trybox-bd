"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart/cart-context";
import { setBuyNowItem } from "@/lib/cart/buy-now";
import { getEffectivePrice, formatBDT } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export type VariantOption = {
  id: string;
  variant_name: string;
  regular_price: number | null;
  sale_price: number | null;
  stock_quantity: number;
  is_default: boolean;
};

export function PurchasePanel({
  productId,
  regularPrice,
  salePrice,
  saleStartsAt,
  saleEndsAt,
  stockQuantity,
  manageStock,
  variants,
}: {
  productId: string;
  regularPrice: number;
  salePrice: number | null;
  saleStartsAt: string | null;
  saleEndsAt: string | null;
  stockQuantity: number;
  manageStock: boolean;
  variants: VariantOption[];
}) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const hasVariants = variants.length > 0;
  const defaultVariant = variants.find((v) => v.is_default) ?? variants[0];
  const [variantId, setVariantId] = useState<string | null>(defaultVariant?.id ?? null);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;

  const priceSource = selectedVariant
    ? {
        regular_price: selectedVariant.regular_price ?? regularPrice,
        sale_price: selectedVariant.sale_price,
        sale_starts_at: saleStartsAt,
        sale_ends_at: saleEndsAt,
      }
    : { regular_price: regularPrice, sale_price: salePrice, sale_starts_at: saleStartsAt, sale_ends_at: saleEndsAt };

  const { price, originalPrice, onSale, discountPercent } = useMemo(() => getEffectivePrice(priceSource), [priceSource]);

  const stock = selectedVariant ? selectedVariant.stock_quantity : stockQuantity;
  const outOfStock = manageStock && stock <= 0;
  const canSelect = !hasVariants || variantId;

  const handleAddToCart = () => {
    if (!canSelect) {
      toast.error("অনুগ্রহ করে একটি অপশন নির্বাচন করুন");
      return;
    }
    addItem(productId, variantId, quantity);
    toast.success("কার্টে যোগ করা হয়েছে");
    openDrawer();
  };

  const handleBuyNow = () => {
    if (!canSelect) {
      toast.error("অনুগ্রহ করে একটি অপশন নির্বাচন করুন");
      return;
    }
    setBuyNowItem({ productId, variantId, quantity });
    router.push("/checkout?mode=buynow");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">{formatBDT(price)}</span>
        {onSale && (
          <>
            <span className="text-base text-foreground/40 line-through">{formatBDT(originalPrice)}</span>
            <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {hasVariants && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">অপশন নির্বাচন করুন</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const vOutOfStock = manageStock && v.stock_quantity <= 0;
              return (
                <button
                  key={v.id}
                  disabled={vOutOfStock}
                  onClick={() => setVariantId(v.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    variantId === v.id
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-border bg-surface text-foreground/70 hover:border-primary-300",
                    vOutOfStock && "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  {v.variant_name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">পরিমাণ</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-10 items-center justify-center hover:bg-surface-muted"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => (manageStock ? Math.min(stock, q + 1) : q + 1))}
              className="flex size-10 items-center justify-center hover:bg-surface-muted"
            >
              <Plus className="size-4" />
            </button>
          </div>
          {manageStock && (
            <span className={outOfStock ? "text-sm text-red-600" : "text-sm text-foreground/50"}>
              {outOfStock ? "স্টক নেই" : `স্টকে আছে (${stock}টি)`}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-primary-600 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:border-border disabled:text-foreground/30"
        >
          <ShoppingCart className="size-4" /> কার্টে যোগ করুন
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-accent-500 to-accent-600 text-sm font-semibold text-white shadow-sm transition-all hover:from-accent-600 hover:to-accent-700 hover:shadow-md disabled:from-border disabled:to-border disabled:text-foreground/30 disabled:shadow-none"
        >
          <Zap className="size-4" /> এখনই কিনুন
        </button>
      </div>
    </div>
  );
}
