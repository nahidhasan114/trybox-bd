export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="aspect-square animate-pulse bg-surface-muted" />
          <div className="space-y-2 p-3">
            <div className="h-3.5 w-4/5 animate-pulse rounded bg-surface-muted" />
            <div className="h-3.5 w-2/5 animate-pulse rounded bg-surface-muted" />
            <div className="h-9 w-full animate-pulse rounded-full bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
