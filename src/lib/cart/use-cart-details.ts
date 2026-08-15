"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getEffectivePrice } from "@/lib/pricing";
import type { CartLine } from "./cart-context";

export type EnrichedCartLine = CartLine & {
  name: string;
  slug: string;
  image: string | null;
  variantName: string | null;
  price: number;
  originalPrice: number;
  onSale: boolean;
  stock: number;
  manageStock: boolean;
};

type ProductData = {
  id: string;
  name_bn: string;
  slug: string;
  regular_price: number;
  sale_price: number | null;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  stock_quantity: number;
  manage_stock: boolean;
  product_images: { image_url: string; is_main: boolean }[] | null;
  product_variants:
    | { id: string; variant_name: string; regular_price: number | null; sale_price: number | null; stock_quantity: number }[]
    | null;
};

export function useCartDetails(lines: CartLine[]) {
  const [productsData, setProductsData] = useState<Record<string, ProductData>>({});
  const [loading, setLoading] = useState(true);

  const productIds = Array.from(new Set(lines.map((l) => l.productId))).sort().join(",");

  useEffect(() => {
    let cancelled = false;
    if (!productIds) {
      setProductsData({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const ids = productIds.split(",");

    supabase
      .from("products")
      .select(
        "id, name_bn, slug, regular_price, sale_price, sale_starts_at, sale_ends_at, stock_quantity, manage_stock, product_images(image_url, is_main), product_variants(id, variant_name, regular_price, sale_price, stock_quantity)",
      )
      .in("id", ids)
      .then(({ data }) => {
        if (cancelled) return;
        const map: Record<string, ProductData> = {};
        (data ?? []).forEach((p) => {
          map[p.id] = p as ProductData;
        });
        setProductsData(map);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  const items: EnrichedCartLine[] = useMemo(() => {
    const result: EnrichedCartLine[] = [];
    for (const line of lines) {
      const product = productsData[line.productId];
      if (!product) continue;

      const mainImage = product.product_images?.find((i) => i.is_main) ?? product.product_images?.[0];
      const variant = line.variantId
        ? product.product_variants?.find((v) => v.id === line.variantId)
        : null;

      const priceSource = variant
        ? {
            regular_price: variant.regular_price ?? product.regular_price,
            sale_price: variant.sale_price,
            sale_starts_at: product.sale_starts_at,
            sale_ends_at: product.sale_ends_at,
          }
        : {
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            sale_starts_at: product.sale_starts_at,
            sale_ends_at: product.sale_ends_at,
          };
      const { price, originalPrice, onSale } = getEffectivePrice(priceSource);

      result.push({
        ...line,
        name: product.name_bn,
        slug: product.slug,
        image: mainImage?.image_url ?? null,
        variantName: variant?.variant_name ?? null,
        price,
        originalPrice,
        onSale,
        stock: variant ? variant.stock_quantity : product.stock_quantity,
        manageStock: product.manage_stock,
      });
    }
    return result;
  }, [lines, productsData]);

  return { items, loading };
}
