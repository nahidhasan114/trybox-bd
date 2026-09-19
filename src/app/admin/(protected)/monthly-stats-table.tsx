"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatBDT } from "@/lib/pricing";
import { deleteMonthOrders } from "./dashboard-actions";

export type MonthRow = {
  month: string;
  label: string;
  total: number;
  delivered: number;
  cancelled: number;
  revenue: number;
  archived: boolean;
  isCurrent: boolean;
};

function DeleteCell({ row }: { row: MonthRow }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = () => {
    startTransition(async () => {
      const res = await deleteMonthOrders(row.month);
      if (res.ok) {
        toast.success(`${row.label}: ${res.deleted}টি অর্ডার ডাটাবেজ থেকে মুছে ফেলা হয়েছে`);
      } else {
        toast.error(res.error);
      }
      setConfirming(false);
    });
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="size-3.5" /> অর্ডার ডিলিট
      </button>
    );
  }

  return (
    <div className="max-w-64 space-y-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
      <p>
        {row.label}-এর সব অর্ডারের বিস্তারিত ডাটাবেজ থেকে <b>চিরতরে</b> মুছে যাবে। শুধু মাসের হিসাব (সংখ্যা ও বিক্রি) থাকবে।
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={run}
          className="rounded-lg bg-red-600 px-2.5 py-1.5 font-medium text-white disabled:opacity-50"
        >
          {pending ? "মুছছে..." : "হ্যাঁ, ডিলিট করুন"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-red-200 bg-white px-2.5 py-1.5 font-medium text-foreground/70"
        >
          না
        </button>
      </div>
    </div>
  );
}

export function MonthlyStatsTable({
  rows,
  canDelete,
  rpcReady,
}: {
  rows: MonthRow[];
  canDelete: boolean;
  rpcReady: boolean;
}) {
  const sum = rows.reduce(
    (a, r) => ({
      total: a.total + r.total,
      delivered: a.delivered + r.delivered,
      cancelled: a.cancelled + r.cancelled,
      revenue: a.revenue + r.revenue,
    }),
    { total: 0, delivered: 0, cancelled: 0, revenue: 0 },
  );

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-muted text-left text-xs text-foreground/50">
            <tr>
              <th className="px-4 py-3 font-medium">মাস</th>
              <th className="px-4 py-3 font-medium">মোট অর্ডার</th>
              <th className="px-4 py-3 font-medium">ডেলিভারি</th>
              <th className="px-4 py-3 font-medium">বাতিল</th>
              <th className="px-4 py-3 font-medium">বিক্রি</th>
              {canDelete && <th className="px-4 py-3 font-medium">ডাটাবেজ পরিষ্কার</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={canDelete ? 6 : 5} className="px-4 py-6 text-center text-foreground/50">
                  এখনো কোনো অর্ডার নেই
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.month} className={r.isCurrent ? "bg-primary-50/40" : ""}>
                <td className="px-4 py-3 font-medium text-foreground">
                  {r.label}
                  {r.isCurrent && <span className="ml-1.5 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] text-primary-700">চলতি</span>}
                </td>
                <td className="px-4 py-3">{r.total}</td>
                <td className="px-4 py-3">{r.delivered}</td>
                <td className="px-4 py-3">{r.cancelled}</td>
                <td className="px-4 py-3 font-medium">{formatBDT(r.revenue)}</td>
                {canDelete && (
                  <td className="px-4 py-3">
                    {r.isCurrent ? (
                      <span className="text-xs text-foreground/40">চলতি মাস</span>
                    ) : r.archived ? (
                      <span className="text-xs text-foreground/50">✓ ডিলিট হয়েছে, হিসাব সংরক্ষিত</span>
                    ) : (
                      <DeleteCell row={r} />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot className="border-t border-border bg-surface-muted text-sm font-semibold">
              <tr>
                <td className="px-4 py-3">সর্বমোট</td>
                <td className="px-4 py-3">{sum.total}</td>
                <td className="px-4 py-3">{sum.delivered}</td>
                <td className="px-4 py-3">{sum.cancelled}</td>
                <td className="px-4 py-3">{formatBDT(sum.revenue)}</td>
                {canDelete && <td />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {!rpcReady && (
        <p className="text-xs text-amber-700">
          ডিলিট অপশন চালু করতে ডাটাবেজে একবার SQL সেটআপ চালাতে হবে — এর আগে হিসাব দেখা যাবে, কিন্তু ডিলিট বাটন কাজ করবে না।
        </p>
      )}
    </div>
  );
}
