import { getProductListing, type ListingFilters } from "@/lib/queries/listing";
import { getActiveCategories, getActiveBrands } from "@/lib/queries/categories";
import { FilterDrawer } from "@/components/storefront/listing/filter-drawer";
import { FilterForm } from "@/components/storefront/listing/filter-form";
import { SortSelect } from "@/components/storefront/listing/sort-select";
import { ListingResults } from "@/components/storefront/listing/listing-results";

export const metadata = { title: "শপ" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ListingFilters>;
}) {
  const params = await searchParams;

  const [categories, brands, listing] = await Promise.all([
    getActiveCategories(),
    getActiveBrands(),
    getProductListing(params),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">সকল প্রোডাক্ট</h1>
        <div className="flex items-center gap-2">
          <FilterDrawer>
            <FilterForm action="/shop" categories={categories ?? []} brands={brands ?? []} current={params} />
          </FilterDrawer>
          <SortSelect />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <FilterForm action="/shop" categories={categories ?? []} brands={brands ?? []} current={params} />
        </div>
        <ListingResults
          products={listing.products}
          total={listing.total}
          page={listing.page}
          pageSize={listing.pageSize}
          basePath="/shop"
          searchParams={params}
        />
      </div>
    </div>
  );
}
