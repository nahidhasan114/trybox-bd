import type { Metadata } from "next";
import { getProductListing, type ListingFilters } from "@/lib/queries/listing";
import { getActiveCategories, getActiveBrands } from "@/lib/queries/categories";
import { FilterDrawer } from "@/components/storefront/listing/filter-drawer";
import { FilterForm } from "@/components/storefront/listing/filter-form";
import { SortSelect } from "@/components/storefront/listing/sort-select";
import { ListingResults } from "@/components/storefront/listing/listing-results";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ListingFilters>;
}): Promise<Metadata> {
  const params = await searchParams;

  if (params.q?.trim()) {
    return {
      title: `"${params.q.trim()}" এর সার্চ ফলাফল`,
      description: `TryBox BD-তে "${params.q.trim()}" খুঁজে পাওয়া বেবি ও মাদার কেয়ার প্রোডাক্ট দেখুন।`,
    };
  }
  if (params.type === "combo") {
    return { title: "কম্বো অফার", description: "TryBox BD-এর সেরা বেবি কম্বো ও প্যাকেজ অফার — এক জায়গায় সাশ্রয়ী দামে।" };
  }
  if (params.best === "1") {
    return { title: "বেস্ট সেলার প্রোডাক্ট", description: "TryBox BD-এর সবচেয়ে বেশি বিক্রিত বেবি ও মাদার কেয়ার প্রোডাক্ট।" };
  }
  if (params.new === "1") {
    return { title: "নতুন প্রোডাক্ট", description: "TryBox BD-তে সদ্য যুক্ত হওয়া নতুন বেবি প্রোডাক্ট দেখুন।" };
  }
  if (params.offer === "1") {
    return { title: "অফার ও ডিসকাউন্ট", description: "TryBox BD-এর চলমান অফার ও ডিসকাউন্ট প্রাইসের প্রোডাক্ট।" };
  }
  return {
    title: "সকল প্রোডাক্ট",
    description: "TryBox BD-এর সকল বেবি ডায়াপার, ফিডিং, নেবুলাইজার ও মাদার কেয়ার প্রোডাক্ট এক জায়গায়।",
  };
}

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
