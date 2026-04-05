import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="pt-8 pb-12 px-12 min-h-screen">
      {/* Header */}
      <header className="mb-12 flex justify-between items-end">
        <div className="max-w-2xl">
          <Skeleton className="h-10 w-72 bg-surface-container mb-2" />
          <Skeleton className="h-5 w-96 bg-surface-container-low" />
        </div>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col items-start gap-4 rounded-[3rem] p-10">
            <Skeleton className="w-12 h-12 rounded-full bg-surface-container-low" />
            <div>
              <Skeleton className="h-3 w-24 bg-surface-container-low mb-3" />
              <Skeleton className="h-8 w-12 bg-surface-container" />
            </div>
          </div>
        ))}
      </section>

      {/* Section title */}
      <Skeleton className="h-7 w-48 bg-surface-container mb-8" />

      {/* Property cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-lowest rounded-[2rem] overflow-hidden border border-outline-variant/10">
            <Skeleton className="h-64 w-full rounded-none bg-surface-container-low" />
            <div className="p-8 space-y-4">
              <div>
                <Skeleton className="h-6 w-48 bg-surface-container" />
                <Skeleton className="h-4 w-32 bg-surface-container-low mt-2" />
              </div>
              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1">
                  <Skeleton className="h-2 w-16 bg-surface-container-low" />
                  <Skeleton className="h-5 w-20 bg-surface-container" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-2 w-16 bg-surface-container-low" />
                  <Skeleton className="h-5 w-12 bg-surface-container" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
