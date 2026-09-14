export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-surface-muted" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-surface-muted" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
          <div className="h-7 w-4/5 animate-pulse rounded bg-surface-muted" />
          <div className="h-8 w-32 animate-pulse rounded bg-surface-muted" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-surface-muted" />
          <div className="h-12 w-full animate-pulse rounded-full bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}
