import { Skeleton } from "@/components/ui/skeleton";

export default function TenantDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto pt-8 pb-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded bg-surface-container" />
        <Skeleton className="h-3 w-16 bg-surface-container-low" />
        <Skeleton className="h-3 w-4 bg-surface-container-low" />
        <Skeleton className="h-3 w-32 bg-surface-container" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-xl bg-surface-container" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 bg-surface-container" />
            <Skeleton className="h-4 w-40 bg-surface-container-low" />
            <Skeleton className="h-4 w-64 bg-surface-container-low" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg bg-surface-container-low" />
          <Skeleton className="h-10 w-28 rounded-lg bg-surface-container-low" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
            <Skeleton className="h-3 w-20 bg-surface-container-low mb-3" />
            <Skeleton className="h-7 w-24 bg-surface-container" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-80 rounded-2xl bg-surface-container-low" />
          <Skeleton className="h-64 rounded-2xl bg-surface-container-low" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-56 rounded-2xl bg-surface-container-low" />
          <Skeleton className="h-48 rounded-2xl bg-surface-container-low" />
        </div>
      </div>
    </div>
  );
}
