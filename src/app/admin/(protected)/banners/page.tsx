import Link from "next/link";
import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BannerRowActions } from "./banner-row-actions";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">হোমপেজ ব্যানার</h1>
          <p className="text-sm text-foreground/60">
            ব্যানার যোগ, পরিবর্তন ও সময়সীমা (duration) নিয়ন্ত্রণ করুন
          </p>
        </div>
        <Link href="/admin/banners/new">
          <Button>
            <Plus className="size-4" /> নতুন ব্যানার
          </Button>
        </Link>
      </div>

      {!banners || banners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <ImageOff className="mx-auto mb-2 size-8 text-foreground/30" />
          এখনো কোনো ব্যানার যোগ করা হয়নি।
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {banners.map((banner) => (
            <div key={banner.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="relative aspect-video bg-surface-muted">
                <Image
                  src={banner.desktop_image_url}
                  alt={banner.title ?? ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!banner.is_active && (
                  <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
                    নিষ্ক্রিয়
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {banner.title || "শিরোনামহীন ব্যানার"}
                  </p>
                  <p className="text-xs text-foreground/50">ক্রম: {banner.display_order}</p>
                </div>
                <BannerRowActions id={banner.id} isActive={banner.is_active} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
