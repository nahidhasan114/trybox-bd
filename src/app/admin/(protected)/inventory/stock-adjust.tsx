"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";
import { adjustStock } from "./actions";

export function StockAdjust({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  const handle = (sign: 1 | -1) => {
    const n = Number(qty);
    if (!n || n <= 0) {
      toast.error("সঠিক পরিমাণ দিন");
      return;
    }
    startTransition(async () => {
      try {
        await adjustStock(productId, n * sign, reason || (sign === 1 ? "restock" : "damaged_or_lost"));
        toast.success("স্টক আপডেট হয়েছে");
        setQty("");
        setReason("");
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "আপডেট করা যায়নি");
      }
    });
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-medium text-primary-600 hover:underline">
        স্টক পরিবর্তন
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        placeholder="পরিমাণ"
        className="h-8 w-20 rounded-lg border border-border bg-surface px-2 text-xs"
      />
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="কারণ (ঐচ্ছিক)"
        className="h-8 w-28 rounded-lg border border-border bg-surface px-2 text-xs"
      />
      <button
        disabled={pending}
        onClick={() => handle(1)}
        className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100"
        title="স্টক যোগ করুন"
      >
        <Plus className="size-3.5" />
      </button>
      <button
        disabled={pending}
        onClick={() => handle(-1)}
        className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
        title="স্টক কমান"
      >
        <Minus className="size-3.5" />
      </button>
      <button onClick={() => setOpen(false)} className="text-xs text-foreground/40 hover:underline">
        বাতিল
      </button>
    </div>
  );
}
