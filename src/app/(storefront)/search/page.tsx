import { getProductListing, type ListingFilters } from "@/lib/queries/listing";
import { ListingResults } from "@/components/storefront/listing/listing-results";
import { ProductSection } from "@/components/storefront/home/product-section";
import { getHomepageSections } from "@/lib/queries/products";

export const metadata = { title: "সার্চ ফলাফল" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<ListingFilters>;
}) {
  const params = await searchParams;

  const listing = await getProductListing(params);
  const showSuggestions = listing.products.length === 0 && params.q;
  const sections = showSuggestions ? await getHomepageSections() : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <h1 className="mb-5 text-xl font-semibold text-foreground">
        &quot;{params.q}&quot; এর জন্য ফলাফল
      </h1>

      <ListingResults
        products={listing.products}
        total={listing.total}
        page={listing.page}
        pageSize={listing.pageSize}
        basePath="/search"
        searchParams={params}
      />

      {sections && sections.bestSellers.length > 0 && (
        <div className="mt-6">
          <ProductSection title="জনপ্রিয় প্রোডাক্ট" viewAllHref="/shop?best=1" products={sections.bestSellers} />
        </div>
      )}
    </div>
  );
}
