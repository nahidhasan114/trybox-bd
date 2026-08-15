"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateOrderStatus } from "./actions";
import { orderStatusLabels } from "@/lib/order-status";

const statuses = Object.keys(orderStatusLabels);

export function StatusUpdateForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status, note);
        toast.success("স্ট্যাটাস আপডেট হয়েছে");
        setNote("");
      } catch {
        toast.error("আপডেট করা যায়নি");
      }
    });
  };

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {orderStatusLabels[s]}
          </option>
        ))}
      </select>
      <Textarea rows={2} placeholder="নোট (ঐচ্ছিক)" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button onClick={handleUpdate} loading={pending} disabled={status === currentStatus && !note} className="w-full">
        স্ট্যাটাস আপডেট করুন
      </Button>
    </div>
  );
}
