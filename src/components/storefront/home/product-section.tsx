import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";

export function ProductSection({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
        <Link href={viewAllHref} className="flex items-center gap-0.5 text-sm font-medium text-primary-700 hover:underline">
          সব দেখুন <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
