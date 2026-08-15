"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const options = [
  { value: "", label: "প্রাসঙ্গিক" },
  { value: "newest", label: "নতুন" },
  { value: "price_low", label: "দাম: কম থেকে বেশি" },
  { value: "price_high", label: "দাম: বেশি থেকে কম" },
  { value: "discount", label: "সবচেয়ে বেশি ছাড়" },
  { value: "best_selling", label: "বেস্ট সেলিং" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      defaultValue={searchParams.get("sort") ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-foreground"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
