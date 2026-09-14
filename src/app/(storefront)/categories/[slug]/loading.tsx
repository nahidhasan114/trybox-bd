import { ProductGridSkeleton } from "@/components/storefront/product-grid-skeleton";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-5 h-7 w-48 animate-pulse rounded bg-surface-muted" />
      <ProductGridSkeleton count={12} />
    </div>
  );
}
