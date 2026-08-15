import { createClient } from "@/lib/supabase/server";
import { getHomepageSections } from "@/lib/queries/products";
import { getActiveCategories } from "@/lib/queries/categories";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";
import { HeroBanner } from "@/components/storefront/home/hero-banner";
import { HeroFallback } from "@/components/storefront/home/hero-fallback";
import { TrustBenefits } from "@/components/storefront/home/trust-benefits";
import { CategoryGrid } from "@/components/storefront/home/category-grid";
import { ProductSection } from "@/components/storefront/home/product-section";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: banners }, categories, sections, settings] = await Promise.all([
    supabase.from("banners").select("*").order("display_order"),
    getActiveCategories(),
    getHomepageSections(),
    getSiteSettings(),
  ]);

  const siteUrl = getSiteUrl();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.business_name,
      url: siteUrl,
      logo: settings.logo_url || undefined,
      sameAs: [settings.facebook_url].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.business_name,
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  const hasBanners = (banners?.length ?? 0) > 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {hasBanners ? (
        <>
          <h1 className="sr-only">{settings.seo_default_title || settings.business_name}</h1>
          <HeroBanner banners={banners ?? []} />
        </>
      ) : (
        <HeroFallback businessName={settings.business_name} />
      )}
      <TrustBenefits />
      <CategoryGrid categories={categories} />
      <ProductSection title="নতুন পণ্য" viewAllHref="/shop?new=1" products={sections.newArrivals} />
      <ProductSection title="স্পেশাল কম্বো অফার" viewAllHref="/shop?type=combo" products={sections.comboOffers} tint />
      <ProductSection title="বেস্ট সেলার" viewAllHref="/shop?best=1" products={sections.bestSellers} />
      <ProductSection title="ফিচার্ড প্রোডাক্ট" viewAllHref="/shop?featured=1" products={sections.featured} tint />
      <ProductSection title="ফ্রি ডেলিভারি প্রোডাক্ট" viewAllHref="/shop?free_delivery=1" products={sections.freeDelivery} />
    </>
  );
}
