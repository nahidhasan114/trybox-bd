"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateShippingRule } from "./actions";
import type { Tables } from "@/types/database.types";

export function ShippingRuleRow({ rule }: { rule: Tables<"shipping_rules"> }) {
  const [name, setName] = useState(rule.name);
  const [charge, setCharge] = useState(String(rule.charge));
  const [freeMin, setFreeMin] = useState(rule.free_delivery_min_order != null ? String(rule.free_delivery_min_order) : "");
  const [isActive, setIsActive] = useState(rule.is_active);
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateShippingRule({
          id: rule.id,
          name,
          charge: Number(charge) || 0,
          free_delivery_min_order: freeMin === "" ? null : Number(freeMin),
          is_active: isActive,
        });
        toast.success("সংরক্ষণ করা হয়েছে");
      } catch {
        toast.error("সংরক্ষণ করা যায়নি");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel>নাম</FieldLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <FieldLabel>ডেলিভারি চার্জ (৳)</FieldLabel>
          <Input type="number" value={charge} onChange={(e) => setCharge(e.target.value)} />
        </div>
        <div>
          <FieldLabel>এর বেশি অর্ডারে ফ্রি (৳, খালি = বন্ধ)</FieldLabel>
          <Input type="number" value={freeMin} onChange={(e) => setFreeMin(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <Switch checked={isActive} onChange={setIsActive} label="এই এলাকায় ডেলিভারি সক্রিয়" />
        </div>
        <Button onClick={handleSave} loading={pending}>
          সংরক্ষণ করুন
        </Button>
      </div>
    </div>
  );
}
