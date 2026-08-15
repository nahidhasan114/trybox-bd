import { createClient } from "@/lib/supabase/server";
import { getHomepageSections } from "@/lib/queries/products";
import { HeroBanner } from "@/components/storefront/home/hero-banner";
import { TrustBenefits } from "@/components/storefront/home/trust-benefits";
import { CategoryGrid } from "@/components/storefront/home/category-grid";
import { ProductSection } from "@/components/storefront/home/product-section";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: banners }, { data: categories }, sections] = await Promise.all([
    supabase.from("banners").select("*").order("display_order"),
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
    getHomepageSections(),
  ]);

  return (
    <>
      <HeroBanner banners={banners ?? []} />
      <TrustBenefits />
      <CategoryGrid categories={categories ?? []} />
      <ProductSection title="নতুন পণ্য" viewAllHref="/shop?new=1" products={sections.newArrivals} />
      <ProductSection title="স্পেশাল কম্বো অফার" viewAllHref="/shop?type=combo" products={sections.comboOffers} />
      <ProductSection title="বেস্ট সেলার" viewAllHref="/shop?best=1" products={sections.bestSellers} />
      <ProductSection title="ফিচার্ড প্রোডাক্ট" viewAllHref="/shop?featured=1" products={sections.featured} />
      <ProductSection title="ফ্রি ডেলিভারি প্রোডাক্ট" viewAllHref="/shop?free_delivery=1" products={sections.freeDelivery} />
    </>
  );
}
