"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyPayment } from "./actions";

export function PaymentVerify({
  paymentId,
  orderId,
  status,
}: {
  paymentId: string;
  orderId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  const handle = (approved: boolean) => {
    startTransition(async () => {
      try {
        await verifyPayment(paymentId, orderId, approved);
        toast.success(approved ? "পেমেন্ট ভেরিফাই করা হয়েছে" : "পেমেন্ট বাতিল করা হয়েছে");
      } catch {
        toast.error("করা যায়নি");
      }
    });
  };

  if (status === "verified") {
    return <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">✓ ভেরিফাইড</span>;
  }
  if (status === "failed") {
    return <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">বাতিল হয়েছে</span>;
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" loading={pending} onClick={() => handle(true)}>
        <Check className="size-3.5" /> ভেরিফাই করুন
      </Button>
      <Button size="sm" variant="secondary" loading={pending} onClick={() => handle(false)}>
        <X className="size-3.5" /> বাতিল
      </Button>
    </div>
  );
}
