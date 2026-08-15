import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductRowActions } from "./product-row-actions";

const PAGE_SIZE = 20;

const statusLabel: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q = "", status = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("id, name_bn, name_en, sku, regular_price, sale_price, stock_quantity, status, category_id, brand_id, product_images(image_url, is_main)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q.trim()) {
    const safe = q.trim().replace(/[,()%*]/g, " ").trim();
    query = query.or(`name_bn.ilike.%${safe}%,name_en.ilike.%${safe}%,sku.ilike.%${safe}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: products, count } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const buildHref = (params: Record<string, string>) => {
    const usp = new URLSearchParams({ q, status, ...params });
    Object.keys(Object.fromEntries(usp)).forEach((k) => {
      if (!usp.get(k)) usp.delete(k);
    });
    return `/admin/products?${usp.toString()}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">প্রোডাক্ট</h1>
          <p className="text-sm text-foreground/60">মোট {count ?? 0}টি প্রোডাক্ট</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="size-4" /> নতুন প্রোডাক্ট
          </Button>
        </Link>
      </div>

      <form className="flex flex-wrap gap-3" action="/admin/products" method="get">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <Input name="q" defaultValue={q} placeholder="নাম বা SKU দিয়ে খুঁজুন" className="pl-10" />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-xl border border-border bg-surface px-4 text-sm text-foreground"
        >
          <option value="">সব স্ট্যাটাস</option>
          {Object.entries(statusLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          খুঁজুন
        </Button>
      </form>

      {!products || products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <Package className="mx-auto mb-2 size-8 text-foreground/30" />
          কোনো প্রোডাক্ট পাওয়া যায়নি।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
              <tr>
                <th className="px-4 py-3 font-medium">ছবি</th>
                <th className="px-4 py-3 font-medium">প্রোডাক্ট</th>
                <th className="px-4 py-3 font-medium">মূল্য</th>
                <th className="px-4 py-3 font-medium">স্টক</th>
                <th className="px-4 py-3 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const mainImage = p.product_images?.find((i) => i.is_main) ?? p.product_images?.[0];
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="relative size-10 overflow-hidden rounded-lg bg-surface-muted">
                        {mainImage && (
                          <Image src={mainImage.image_url} alt="" fill className="object-cover" unoptimized />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{p.name_bn}</p>
                      <p className="text-xs text-foreground/50">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">
                      {p.sale_price ? (
                        <>
                          <span className="font-medium text-foreground">৳{p.sale_price}</span>{" "}
                          <span className="text-xs text-foreground/40 line-through">৳{p.regular_price}</span>
                        </>
                      ) : (
                        <span>৳{p.regular_price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.stock_quantity <= 0 ? "text-red-600" : "text-foreground/70"}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <ProductRowActions id={p.id} status={p.status} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={buildHref({ page: String(i + 1) })}
              className={`flex size-9 items-center justify-center rounded-lg text-sm ${
                currentPage === i + 1
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
