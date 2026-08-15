"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { searchSimilarProducts } from "./search-actions";

type Match = { id: string; name_bn: string; name_en: string | null; sku: string | null; status: string };

export function NameAutocompleteHint({ query, excludeId }: { query: string; excludeId?: string }) {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const results = await searchSimilarProducts(query);
      setMatches(results.filter((r) => r.id !== excludeId));
    }, 400);
    return () => clearTimeout(timer);
  }, [query, excludeId]);

  if (matches.length === 0) return null;

  return (
    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
        <AlertTriangle className="size-3.5" /> একই রকম নামের প্রোডাক্ট আগে থেকেই আছে — ডুপ্লিকেট এড়াতে চেক করুন
      </p>
      <ul className="mt-1.5 space-y-0.5 text-xs text-amber-700/80">
        {matches.map((m) => (
          <li key={m.id}>
            {m.name_bn} {m.sku && `(SKU: ${m.sku})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
