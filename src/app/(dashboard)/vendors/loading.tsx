export default function VendorsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Header skeleton */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="h-5 w-40 bg-[#e6eeff] rounded-full mb-3 animate-pulse" />
          <div className="h-10 w-64 bg-[#e6eeff] rounded-lg mb-2 animate-pulse" />
          <div className="h-5 w-96 bg-[#e6eeff] rounded-lg animate-pulse" />
        </div>
        <div className="h-14 w-40 bg-[#e6eeff] rounded-lg animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-[1rem] border border-[#bdc9ca]/20 overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-[#bdc9ca]/10 bg-[#eff4ff]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-10 w-80 bg-[#e6eeff] rounded-[0.5rem] animate-pulse" />
              <div className="h-10 w-24 bg-[#e6eeff] rounded-[0.5rem] animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-[#e6eeff] rounded animate-pulse" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-8 py-6 border-b border-[#bdc9ca]/10 flex items-center gap-8">
            <div className="w-10 h-10 rounded-full bg-[#e6eeff] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-[#e6eeff] rounded animate-pulse" />
              <div className="h-3 w-32 bg-[#e6eeff] rounded animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-44 bg-[#e6eeff] rounded animate-pulse" />
              <div className="h-3 w-36 bg-[#e6eeff] rounded animate-pulse" />
            </div>
            <div className="w-20 h-4 bg-[#e6eeff] rounded animate-pulse" />
            <div className="w-24 h-6 bg-[#e6eeff] rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-8 rounded-lg border border-[#bdc9ca]/10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#e6eeff] animate-pulse" />
              <div className="w-20 h-6 bg-[#e6eeff] rounded-[0.5rem] animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-[#e6eeff] rounded animate-pulse" />
              <div className="h-4 w-28 bg-[#e6eeff] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
