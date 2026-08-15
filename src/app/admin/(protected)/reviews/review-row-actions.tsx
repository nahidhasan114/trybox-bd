"use client";

import { useTransition } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { setReviewApproval, deleteReview } from "./actions";

export function ReviewRowActions({ id, isApproved }: { id: string; isApproved: boolean }) {
  const [pending, startTransition] = useTransition();

  const handleApprove = (approved: boolean) => {
    startTransition(async () => {
      try {
        await setReviewApproval(id, approved);
        toast.success(approved ? "অনুমোদন করা হয়েছে" : "অ্যাপ্রুভাল বাতিল করা হয়েছে");
      } catch {
        toast.error("পরিবর্তন করা যায়নি");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("এই রিভিউটি মুছে ফেলতে চান?")) return;
    startTransition(async () => {
      try {
        await deleteReview(id);
        toast.success("মুছে ফেলা হয়েছে");
      } catch {
        toast.error("মুছে ফেলা যায়নি");
      }
    });
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span
        className={
          isApproved
            ? "rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
            : "rounded-full bg-surface-muted px-2 py-0.5 text-xs text-foreground/50"
        }
      >
        {isApproved ? "অনুমোদিত" : "অপেক্ষমান"}
      </span>
      {!isApproved ? (
        <button
          onClick={() => handleApprove(true)}
          disabled={pending}
          title="অনুমোদন করুন"
          className="rounded-lg p-2 text-primary-600 hover:bg-primary-50"
        >
          <Check className="size-4" />
        </button>
      ) : (
        <button
          onClick={() => handleApprove(false)}
          disabled={pending}
          title="অ্যাপ্রুভাল বাতিল করুন"
          className="rounded-lg p-2 text-foreground/50 hover:bg-surface-muted"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={pending}
        title="মুছুন"
        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
