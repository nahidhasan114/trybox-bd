"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductTabs({
  descriptionBn,
  descriptionEn,
}: {
  descriptionBn: string | null;
  descriptionEn: string | null;
}) {
  const tabs = [
    { key: "description", label: "বিবরণ" },
    { key: "delivery", label: "ডেলিভারি তথ্য" },
    { key: "return", label: "রিটার্ন নীতি" },
  ];
  const [active, setActive] = useState("description");

  return (
    <div className="mt-10">
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium",
              active === t.key ? "border-primary-600 text-primary-700" : "border-transparent text-foreground/50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="py-5 text-sm leading-relaxed text-foreground/80">
        {active === "description" && (
          <div className="whitespace-pre-line">
            {descriptionBn || descriptionEn || "এই প্রোডাক্টের জন্য কোনো বিস্তারিত বিবরণ যোগ করা হয়নি।"}
          </div>
        )}
        {active === "delivery" && (
          <div className="space-y-1.5">
            <p>ঢাকার ভিতরে সাধারণত ১-২ দিনে ডেলিভারি হয়।</p>
            <p>ঢাকার বাইরে সাধারণত ২-৫ দিনে ডেলিভারি হয়।</p>
            <p>Cash on Delivery সুবিধা রয়েছে — পণ্য হাতে পেয়ে টাকা পরিশোধ করতে পারবেন।</p>
          </div>
        )}
        {active === "return" && (
          <div className="space-y-1.5">
            <p>পণ্য হাতে পাওয়ার ২৪ ঘণ্টার মধ্যে সমস্যা থাকলে জানাতে হবে।</p>
            <p>ভুল/ত্রুটিপূর্ণ পণ্য পেলে পরিবর্তন করা হবে।</p>
            <p>বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।</p>
          </div>
        )}
      </div>
    </div>
  );
}
