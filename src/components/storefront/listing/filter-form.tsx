import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FilterForm({
  action,
  categories,
  brands,
  current,
}: {
  action: string;
  categories: { name_bn: string; slug: string }[];
  brands: { name: string; slug: string }[];
  current: {
    category?: string;
    brand?: string;
    best?: string;
    new?: string;
    free_delivery?: string;
    offer?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
    sort?: string;
  };
}) {
  return (
    <form action={action} method="get" className="w-64 shrink-0 space-y-5 rounded-2xl border border-border bg-surface p-4">
      {current.q && <input type="hidden" name="q" value={current.q} />}
      {current.sort && <input type="hidden" name="sort" value={current.sort} />}

      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">ক্যাটাগরি</p>
          <select name="category" defaultValue={current.category ?? ""} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm">
            <option value="">সব ক্যাটাগরি</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name_bn}
              </option>
            ))}
          </select>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">ব্র্যান্ড</p>
          <select name="brand" defaultValue={current.brand ?? ""} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm">
            <option value="">সব ব্র্যান্ড</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">মূল্য পরিসীমা</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            defaultValue={current.minPrice}
            placeholder="সর্বনিম্ন"
            className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm"
          />
          <span className="text-foreground/40">-</span>
          <input
            type="number"
            name="maxPrice"
            defaultValue={current.maxPrice}
            placeholder="সর্বোচ্চ"
            className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-foreground/80">
          <input type="checkbox" name="offer" value="1" defaultChecked={current.offer === "1"} className="size-4" />
          অফার প্রাইস
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/80">
          <input type="checkbox" name="best" value="1" defaultChecked={current.best === "1"} className="size-4" />
          বেস্ট সেলার
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/80">
          <input type="checkbox" name="new" value="1" defaultChecked={current.new === "1"} className="size-4" />
          নতুন পণ্য
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/80">
          <input type="checkbox" name="free_delivery" value="1" defaultChecked={current.free_delivery === "1"} className="size-4" />
          ফ্রি ডেলিভারি
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          প্রয়োগ করুন
        </Button>
        <Link href={action} className="flex h-9 items-center rounded-full border border-border px-3 text-sm text-foreground/60 hover:bg-surface-muted">
          মুছুন
        </Link>
      </div>
    </form>
  );
}
