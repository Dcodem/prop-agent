export default function TenantsLoading() {
  return (
    <div className="pt-8 pb-12 px-8 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="h-9 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded border border-slate-200 flex flex-col"
          >
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse mb-3" />
            <div className="h-8 w-12 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Search skeleton */}
      <div className="h-10 w-80 bg-slate-100 rounded animate-pulse mb-6" />

      {/* Table skeleton */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="flex gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-3 w-16 bg-slate-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="px-6 py-5 border-b border-slate-100 flex gap-8 items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-3 w-36 bg-slate-100 rounded animate-pulse" />
              <div className="h-2 w-20 bg-slate-50 rounded animate-pulse" />
            </div>
            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-8 bg-slate-100 rounded animate-pulse" />
            <div className="h-5 w-24 bg-slate-100 rounded animate-pulse" />
            <div className="h-5 w-6 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
