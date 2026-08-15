import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_SELECT, toCardData, type RawProduct } from "@/lib/queries/products";
import { ProductGallery } from "@/components/storefront/product/product-gallery";
import { PurchasePanel } from "@/components/storefront/product/purchase-panel";
import { ProductTabs } from "@/components/storefront/product/product-tabs";
import { ProductSection } from "@/components/storefront/home/product-section";
import { getSiteUrl } from "@/lib/site-url";

async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "*, category:categories(name_bn, slug), brand:brands(name, slug), images:product_images(image_url, is_main, display_order), variants:product_variants(id, variant_name, regular_price, sale_price, stock_quantity, is_default, is_active, display_order), videos:product_videos(video_url)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const image = product.images?.find((i) => i.is_main)?.image_url ?? product.images?.[0]?.image_url;

  return {
    title: product.seo_title || product.name_bn,
    description: product.seo_description || product.short_description_bn || undefined,
    openGraph: {
      title: product.seo_title || product.name_bn,
      description: product.seo_description || product.short_description_bn || undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const supabase = await createClient();

  const images = (product.images ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => i.image_url);

  const activeVariants = (product.variants ?? [])
    .filter((v) => v.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  let related: ReturnType<typeof toCardData>[] = [];
  if (product.category_id) {
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .limit(4);
    related = ((data as RawProduct[] | null) ?? []).map(toCardData);
  }

  const siteUrl = getSiteUrl();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_bn,
    image: images,
    description: product.short_description_bn ?? undefined,
    sku: product.sku ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.sale_price ?? product.regular_price,
      availability:
        product.manage_stock && product.stock_quantity <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${siteUrl}/products/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "হোম", item: siteUrl },
      ...(product.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: product.category.name_bn,
              item: `${siteUrl}/categories/${product.category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.category ? 3 : 2,
        name: product.name_bn,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav className="mb-4 flex items-center gap-1 text-xs text-foreground/50">
        <Link href="/" className="hover:text-primary-700">হোম</Link>
        <ChevronRight className="size-3" />
        {product.category && (
          <>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-700">
              {product.category.name_bn}
            </Link>
            <ChevronRight className="size-3" />
          </>
        )}
        <span className="line-clamp-1 text-foreground/70">{product.name_bn}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name_bn} />

        <div>
          {product.brand && <p className="mb-1 text-sm font-medium text-primary-600">{product.brand.name}</p>}
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{product.name_bn}</h1>
          {product.short_description_bn && (
            <p className="mt-2 text-sm text-foreground/60">{product.short_description_bn}</p>
          )}

          <div className="mt-5">
            <PurchasePanel
              productId={product.id}
              regularPrice={product.regular_price}
              salePrice={product.sale_price}
              saleStartsAt={product.sale_starts_at}
              saleEndsAt={product.sale_ends_at}
              stockQuantity={product.stock_quantity}
              manageStock={product.manage_stock}
              variants={activeVariants}
              isCustomizable={product.is_customizable}
              customizationOptions={(product.customization_options as string[] | null) ?? []}
              customizationPickCount={product.customization_pick_count}
              customizationInstructions={product.customization_instructions}
            />
          </div>
        </div>
      </div>

      <ProductTabs descriptionBn={product.description_bn} descriptionEn={product.description_en} />

      {related.length > 0 && (
        <div className="-mx-4 sm:-mx-6">
          <ProductSection title="আপনার পছন্দ হতে পারে" viewAllHref={`/categories/${product.category?.slug ?? ""}`} products={related} />
        </div>
      )}
    </div>
  );
}
