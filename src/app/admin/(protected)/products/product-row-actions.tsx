"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct, updateProductStatus } from "./actions";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

export function ProductRowActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("এই প্রোডাক্টটি স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("মুছে ফেলা হয়েছে");
      } catch {
        toast.error("মুছে ফেলা যায়নি");
      }
    });
  };

  const handleStatusChange = (next: string) => {
    startTransition(async () => {
      try {
        await updateProductStatus(id, next);
        toast.success("স্ট্যাটাস পরিবর্তন হয়েছে");
      } catch {
        toast.error("পরিবর্তন করা যায়নি");
      }
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={status}
        disabled={pending}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-foreground"
      >
        {statusOptions.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Link href={`/admin/products/${id}`} className="rounded-lg p-2 text-foreground/60 hover:bg-surface-muted">
        <Pencil className="size-4" />
      </Link>
      <button onClick={handleDelete} disabled={pending} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
