import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProductListing, type ListingFilters } from "@/lib/queries/listing";
import { FilterDrawer } from "@/components/storefront/listing/filter-drawer";
import { FilterForm } from "@/components/storefront/listing/filter-form";
import { SortSelect } from "@/components/storefront/listing/sort-select";
import { ListingResults } from "@/components/storefront/listing/listing-results";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name_bn, seo_title, seo_description")
    .eq("slug", slug)
    .maybeSingle();

  if (!category) return {};
  return {
    title: category.seo_title || category.name_bn,
    description: category.seo_description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingFilters>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) notFound();

  const filters: ListingFilters = { ...searchParamsResolved, category: slug };

  const [{ data: brands }, listing] = await Promise.all([
    supabase.from("brands").select("name, slug").eq("is_active", true).order("name"),
    getProductListing(filters),
  ]);

  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "হোম", item: siteUrl },
      { "@type": "ListItem", position: 2, name: category.name_bn, item: `${siteUrl}/categories/${category.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">{category.name_bn}</h1>
        {category.description_bn && <p className="mt-1 text-sm text-foreground/60">{category.description_bn}</p>}
      </div>

      <div className="mb-5 flex justify-end gap-2">
        <FilterDrawer>
          <FilterForm action={`/categories/${slug}`} categories={[]} brands={brands ?? []} current={filters} />
        </FilterDrawer>
        <SortSelect />
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <FilterForm action={`/categories/${slug}`} categories={[]} brands={brands ?? []} current={filters} />
        </div>
        <ListingResults
          products={listing.products}
          total={listing.total}
          page={listing.page}
          pageSize={listing.pageSize}
          basePath={`/categories/${slug}`}
          searchParams={filters}
        />
      </div>
    </div>
  );
}
