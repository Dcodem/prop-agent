import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <Skeleton className="h-5 w-40 rounded-full bg-surface-container-low mb-3" />
          <Skeleton className="h-10 w-64 bg-surface-container mb-2" />
          <Skeleton className="h-5 w-96 bg-surface-container-low" />
        </div>
        <Skeleton className="h-14 w-40 bg-surface-container-low" />
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/20 overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-outline-variant/10 bg-surface-container-low">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-80 bg-surface-container" />
              <Skeleton className="h-10 w-24 bg-surface-container" />
            </div>
            <Skeleton className="h-4 w-32 bg-surface-container" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-8 py-6 border-b border-outline-variant/10 flex items-center gap-8">
            <Skeleton className="w-10 h-10 rounded-full bg-surface-container-low" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 bg-surface-container-low" />
              <Skeleton className="h-3 w-32 bg-surface-container-low" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44 bg-surface-container-low" />
              <Skeleton className="h-3 w-36 bg-surface-container-low" />
            </div>
            <Skeleton className="w-20 h-4 bg-surface-container-low" />
            <Skeleton className="w-24 h-6 rounded-full bg-surface-container-low" />
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10">
            <div className="flex justify-between items-start mb-6">
              <Skeleton className="w-12 h-12 rounded-lg bg-surface-container-low" />
              <Skeleton className="w-20 h-6 bg-surface-container-low" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-16 bg-surface-container-low" />
              <Skeleton className="h-4 w-28 bg-surface-container-low" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
