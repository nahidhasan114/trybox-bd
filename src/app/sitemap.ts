import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const supabase = await createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("status", "active"),
    supabase.from("categories").select("slug, updated_at").eq("is_active", true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/track-order`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/delivery-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/return-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    lastModified: c.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
