import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";

export function ProductSection({
  title,
  viewAllHref,
  products,
  tint = false,
}: {
  title: string;
  viewAllHref: string;
  products: ProductCardData[];
  tint?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <section className={tint ? "bg-surface-muted/60" : undefined}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground sm:text-xl">
            <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-primary-500 to-accent-500" />
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="flex items-center gap-0.5 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 hover:underline"
          >
            সব দেখুন <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
