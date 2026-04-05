import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-8 pb-12">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-48 bg-surface-container" />
        <Skeleton className="h-4 w-72 bg-surface-container-low mt-2" />
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-lg bg-surface-container mb-4" />
            <Skeleton className="h-8 w-16 bg-surface-container mb-1" />
            <Skeleton className="h-3 w-24 bg-surface-container-low" />
          </div>
        ))}
      </div>

      {/* Open Cases Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded bg-surface-container" />
            <Skeleton className="h-5 w-32 bg-surface-container" />
          </div>
          <Skeleton className="h-4 w-24 bg-surface-container-low" />
        </div>
        <div className="divide-y divide-outline-variant/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-6">
              <Skeleton className="h-4 w-20 bg-surface-container-low" />
              <Skeleton className="h-4 w-64 bg-surface-container-low" />
              <Skeleton className="h-4 w-40 bg-surface-container-low" />
              <Skeleton className="h-4 w-24 bg-surface-container-low" />
              <Skeleton className="h-3 w-16 bg-surface-container-low" />
            </div>
          ))}
        </div>
      </div>

      {/* Lease Renewals */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded bg-surface-container" />
          <Skeleton className="h-5 w-36 bg-surface-container" />
        </div>
        <div className="divide-y divide-outline-variant/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-lg bg-surface-container" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32 bg-surface-container" />
                <Skeleton className="h-3 w-48 bg-surface-container-low" />
              </div>
              <Skeleton className="h-6 w-16 rounded bg-surface-container-low" />
            </div>
          ))}
        </div>
      </div>

      {/* PropAgent Overview */}
      <Skeleton className="h-64 w-full rounded-xl bg-surface-container-low" />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl bg-surface-container-low" />
        ))}
      </div>
    </div>
  );
}
