import Link from "next/link";
import Image from "next/image";
import { Plus, FolderTree } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CategoryRowActions } from "./category-row-actions";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">ক্যাটাগরি</h1>
          <p className="text-sm text-foreground/60">প্রোডাক্ট ক্যাটাগরি যোগ ও পরিচালনা করুন</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="size-4" /> নতুন ক্যাটাগরি
          </Button>
        </Link>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <FolderTree className="mx-auto mb-2 size-8 text-foreground/30" />
          এখনো কোনো ক্যাটাগরি নেই।
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
              <tr>
                <th className="px-4 py-3 font-medium">ছবি</th>
                <th className="px-4 py-3 font-medium">নাম</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">ক্রম</th>
                <th className="px-4 py-3 font-medium">স্ট্যাটাস</th>
                <th className="px-4 py-3 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-3">
                    <div className="relative size-10 overflow-hidden rounded-lg bg-surface-muted">
                      {cat.image_url && (
                        <Image src={cat.image_url} alt="" fill className="object-cover" unoptimized />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{cat.name_bn}</p>
                    <p className="text-xs text-foreground/50">{cat.name_en}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground/60">{cat.slug}</td>
                  <td className="px-4 py-3 text-foreground/60">{cat.display_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        cat.is_active
                          ? "rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                          : "rounded-full bg-surface-muted px-2 py-0.5 text-xs text-foreground/50"
                      }
                    >
                      {cat.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <CategoryRowActions id={cat.id} isActive={cat.is_active} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
