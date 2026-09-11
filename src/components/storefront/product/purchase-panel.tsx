"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Zap, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart/cart-context";
import { setBuyNowItems, type BuyNowItem } from "@/lib/cart/buy-now";
import { getEffectivePrice, formatBDT } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export type VariantOption = {
  id: string;
  variant_name: string;
  regular_price: number | null;
  sale_price: number | null;
  stock_quantity: number;
  image_url?: string | null;
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
  isCustomizable = false,
  customizationOptions = [],
  customizationPickCount = 0,
  customizationInstructions = null,
}: {
  productId: string;
  regularPrice: number;
  salePrice: number | null;
  saleStartsAt: string | null;
  saleEndsAt: string | null;
  stockQuantity: number;
  manageStock: boolean;
  variants: VariantOption[];
  isCustomizable?: boolean;
  customizationOptions?: string[];
  customizationPickCount?: number;
  customizationInstructions?: string | null;
}) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const hasVariants = variants.length > 0;
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);

  const showCustomization = isCustomizable && customizationOptions.length > 0;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const pickCount = customizationPickCount > 0 ? customizationPickCount : null;
  const customizationValid = !showCustomization || !pickCount || selectedOptions.length === pickCount;

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) return prev.filter((o) => o !== option);
      if (pickCount && prev.length >= pickCount) return prev;
      return [...prev, option];
    });
  };

  const adjustVariantQty = (variantId: string, delta: number, maxQty?: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[variantId] ?? 0) + delta);
      return { ...prev, [variantId]: maxQty != null ? Math.min(next, maxQty) : next };
    });
  };

  const selectedVariants = useMemo(
    () => variants.filter((v) => (quantities[v.id] ?? 0) > 0),
    [variants, quantities],
  );

  const { price, originalPrice, onSale, discountPercent } = useMemo(
    () => getEffectivePrice({ regular_price: regularPrice, sale_price: salePrice, sale_starts_at: saleStartsAt, sale_ends_at: saleEndsAt }),
    [regularPrice, salePrice, saleStartsAt, saleEndsAt],
  );

  const variantPrices = useMemo(
    () =>
      variants.map((v) =>
        getEffectivePrice({
          regular_price: v.regular_price ?? regularPrice,
          sale_price: v.sale_price,
          sale_starts_at: saleStartsAt,
          sale_ends_at: saleEndsAt,
        }).price,
      ),
    [variants, regularPrice, saleStartsAt, saleEndsAt],
  );
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : price;

  const comboSubtotal = useMemo(
    () =>
      variants.reduce((sum, v, i) => {
        const qty = quantities[v.id] ?? 0;
        return sum + variantPrices[i] * qty;
      }, 0),
    [variants, quantities, variantPrices],
  );
  const comboTotalQty = useMemo(() => Object.values(quantities).reduce((s, q) => s + q, 0), [quantities]);

  const outOfStock = !hasVariants && manageStock && stockQuantity <= 0;
  const canSelect = !hasVariants || comboTotalQty > 0;

  const handleAddToCart = () => {
    if (!canSelect) {
      toast.error(hasVariants ? "অনুগ্রহ করে অন্তত একটি আইটেম বেছে নিন" : "অনুগ্রহ করে একটি অপশন নির্বাচন করুন");
      return;
    }
    if (!customizationValid) {
      toast.error(`অনুগ্রহ করে ঠিক ${pickCount}টি অপশন বেছে নিন`);
      return;
    }
    if (hasVariants) {
      selectedVariants.forEach((v) => addItem(productId, v.id, quantities[v.id], null));
      toast.success("কার্টে যোগ করা হয়েছে");
      openDrawer();
      return;
    }
    addItem(productId, null, quantity, showCustomization && selectedOptions.length > 0 ? selectedOptions : null);
    toast.success("কার্টে যোগ করা হয়েছে");
    openDrawer();
  };

  const handleBuyNow = () => {
    if (!canSelect) {
      toast.error(hasVariants ? "অনুগ্রহ করে অন্তত একটি আইটেম বেছে নিন" : "অনুগ্রহ করে একটি অপশন নির্বাচন করুন");
      return;
    }
    if (!customizationValid) {
      toast.error(`অনুগ্রহ করে ঠিক ${pickCount}টি অপশন বেছে নিন`);
      return;
    }
    const items: BuyNowItem[] = hasVariants
      ? selectedVariants.map((v) => ({ productId, variantId: v.id, quantity: quantities[v.id], customization: null }))
      : [
          {
            productId,
            variantId: null,
            quantity,
            customization: showCustomization && selectedOptions.length > 0 ? selectedOptions : null,
          },
        ];
    setBuyNowItems(items);
    router.push("/checkout?mode=buynow");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">
          {hasVariants ? `${formatBDT(minVariantPrice)} থেকে শুরু` : formatBDT(price)}
        </span>
        {!hasVariants && onSale && (
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
          <p className="mb-2 text-sm font-medium text-foreground">
            আইটেম বাছাই করুন <span className="font-normal text-foreground/50">(একাধিক আইটেম বিভিন্ন পরিমাণে নিতে পারবেন)</span>
          </p>
          <div className="space-y-2">
            {variants.map((v, i) => {
              const vOutOfStock = manageStock && v.stock_quantity <= 0;
              const vPrice = variantPrices[i];
              const vOnSale = v.sale_price != null && v.sale_price < (v.regular_price ?? regularPrice);
              const qty = quantities[v.id] ?? 0;
              return (
                <div
                  key={v.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-2.5 transition-colors",
                    qty > 0 ? "border-primary-300 bg-primary-50/30" : "border-border",
                    vOutOfStock && "opacity-50",
                  )}
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                    {v.image_url ? (
                      <Image src={v.image_url} alt={v.variant_name} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-foreground/20">
                        <ImageOff className="size-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{v.variant_name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className={cn("text-sm font-semibold", vOnSale ? "text-accent-600" : "text-foreground")}>
                        {formatBDT(vPrice)}
                      </span>
                    </div>
                    {manageStock && (
                      <span className={vOutOfStock ? "text-xs text-red-600" : "text-xs text-foreground/40"}>
                        {vOutOfStock ? "স্টক নেই" : `স্টকে আছে (${v.stock_quantity}টি)`}
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center rounded-full border border-border">
                    <button
                      type="button"
                      disabled={vOutOfStock}
                      onClick={() => adjustVariantQty(v.id, -1)}
                      className="flex size-8 items-center justify-center hover:bg-surface-muted disabled:opacity-30"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{qty}</span>
                    <button
                      type="button"
                      disabled={vOutOfStock}
                      onClick={() => adjustVariantQty(v.id, 1, manageStock ? v.stock_quantity : undefined)}
                      className="flex size-8 items-center justify-center hover:bg-surface-muted disabled:opacity-30"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {comboTotalQty > 0 && (
            <p className="mt-2.5 text-sm text-foreground/70">
              মোট নির্বাচিত: <span className="font-medium text-foreground">{comboTotalQty}টি</span> · সাবটোটাল:{" "}
              <span className="font-semibold text-foreground">{formatBDT(comboSubtotal)}</span>
            </p>
          )}
        </div>
      )}

      {showCustomization && (
        <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-4">
          <p className="text-sm font-medium text-foreground">
            নিজের পছন্দমতো সাজান {pickCount && <span className="text-primary-700">({selectedOptions.length}/{pickCount} নির্বাচিত)</span>}
          </p>
          {customizationInstructions && (
            <p className="mt-1 text-xs text-foreground/50">{customizationInstructions}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {customizationOptions.map((option) => {
              const active = selectedOptions.includes(option);
              const disabled = !active && pickCount !== null && selectedOptions.length >= pickCount;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-border bg-surface text-foreground/70 hover:border-primary-300",
                    disabled && "cursor-not-allowed opacity-40",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!hasVariants && (
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
                onClick={() => setQuantity((q) => (manageStock ? Math.min(stockQuantity, q + 1) : q + 1))}
                className="flex size-10 items-center justify-center hover:bg-surface-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>
            {manageStock && (
              <span className={outOfStock ? "text-sm text-red-600" : "text-sm text-foreground/50"}>
                {outOfStock ? "স্টক নেই" : `স্টকে আছে (${stockQuantity}টি)`}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || !customizationValid || (hasVariants && comboTotalQty === 0)}
          className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-primary-600 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:border-border disabled:text-foreground/30"
        >
          <ShoppingCart className="size-4" /> কার্টে যোগ করুন
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock || !customizationValid || (hasVariants && comboTotalQty === 0)}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-accent-500 to-accent-600 text-sm font-semibold text-white shadow-sm transition-all hover:from-accent-600 hover:to-accent-700 hover:shadow-md disabled:from-border disabled:to-border disabled:text-foreground/30 disabled:shadow-none"
        >
          <Zap className="size-4" /> এখনই কিনুন
        </button>
      </div>
    </div>
  );
}
