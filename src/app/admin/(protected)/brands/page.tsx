import Link from "next/link";
import Image from "next/image";
import { Plus, Tags } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BrandRowActions } from "./brand-row-actions";

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase.from("brands").select("*").order("name");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">ব্র্যান্ড</h1>
          <p className="text-sm text-foreground/60">প্রোডাক্ট ব্র্যান্ড যোগ ও পরিচালনা করুন</p>
        </div>
        <Link href="/admin/brands/new">
          <Button>
            <Plus className="size-4" /> নতুন ব্র্যান্ড
          </Button>
        </Link>
      </div>

      {!brands || brands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <Tags className="mx-auto mb-2 size-8 text-foreground/30" />
          এখনো কোনো ব্র্যান্ড নেই।
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  {brand.logo_url && (
                    <Image src={brand.logo_url} alt="" fill className="object-contain" unoptimized />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{brand.name}</p>
                  <span
                    className={
                      brand.is_active
                        ? "text-xs text-primary-700"
                        : "text-xs text-foreground/40"
                    }
                  >
                    {brand.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </div>
              </div>
              <BrandRowActions id={brand.id} isActive={brand.is_active} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
