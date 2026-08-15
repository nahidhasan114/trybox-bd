import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";

export function ListingResults({
  products,
  total,
  page,
  pageSize,
  basePath,
  searchParams,
}: {
  products: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
        <PackageSearch className="size-10 text-foreground/20" />
        <p className="text-sm font-medium text-foreground">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
        <p className="max-w-xs text-sm text-foreground/50">
          অন্য কিওয়ার্ড দিয়ে খুঁজুন অথবা ফিল্টার পরিবর্তন করুন।
        </p>
        <Link href="/shop" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          সব প্রোডাক্ট দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <p className="mb-3 text-sm text-foreground/50">মোট {total}টি প্রোডাক্ট</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={buildHref(i + 1)}
              className={`flex size-9 items-center justify-center rounded-lg text-sm ${
                page === i + 1
                  ? "bg-primary-600 text-white"
                  : "border border-border text-foreground/60 hover:bg-surface-muted"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
