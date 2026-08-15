"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { deleteBanner, toggleBannerActive } from "./actions";

export function BannerRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("এই ব্যানারটি মুছে ফেলতে চান?")) return;
    startTransition(async () => {
      try {
        await deleteBanner(id);
        toast.success("ব্যানার মুছে ফেলা হয়েছে");
      } catch {
        toast.error("মুছে ফেলা যায়নি");
      }
    });
  };

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleBannerActive(id, !isActive);
      } catch {
        toast.error("পরিবর্তন করা যায়নি");
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleToggle}
        disabled={pending}
        className="rounded-lg p-2 text-foreground/60 hover:bg-surface-muted"
        title={isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
      >
        {isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </button>
      <Link
        href={`/admin/banners/${id}`}
        className="rounded-lg p-2 text-foreground/60 hover:bg-surface-muted"
      >
        <Pencil className="size-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
