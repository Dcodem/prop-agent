import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="max-w-[800px] mx-auto py-12 px-8">
      {/* Header */}
      <div className="mb-12 border-b border-outline-variant/20 pb-8">
        <Skeleton className="h-10 w-48 bg-surface-container-low" />
        <Skeleton className="h-5 w-80 bg-surface-container-low mt-3" />
      </div>
      <div className="space-y-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-7 h-7 bg-surface-container-low" />
                <Skeleton className="h-6 w-56 bg-surface-container-low" />
              </div>
              <Skeleton className="h-4 w-full bg-surface-container-low" />
              <div className="space-y-4 mt-6">
                <Skeleton className="h-10 w-full bg-surface-container-low" />
                <Skeleton className="h-10 w-full bg-surface-container-low" />
              </div>
            </div>
            <div className="bg-surface-container-low border-t border-outline-variant/20 px-8 py-4 flex justify-end">
              <Skeleton className="h-9 w-32 bg-surface-container" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
