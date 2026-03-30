export default function VendorDetailLoading() {
  return (
    <div className="animate-pulse pt-8 pb-24 px-12 max-w-[1600px] mx-auto">
      {/* Breadcrumb */}
      <div className="h-4 w-32 bg-border rounded mb-4" />

      {/* Header */}
      <div className="flex items-start gap-8 mb-14">
        <div className="w-24 h-24 rounded-full bg-border shrink-0" />
        <div className="flex-grow">
          <div className="h-10 w-64 bg-border rounded-lg mb-3" />
          <div className="h-5 w-32 bg-border rounded mb-3" />
          <div className="h-4 w-48 bg-border rounded" />
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="h-12 w-28 bg-border rounded-lg" />
          <div className="h-12 w-32 bg-border rounded-lg" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-3 w-24 bg-border rounded mb-3" />
            <div className="h-10 w-16 bg-border rounded" />
          </div>
        ))}
      </div>

      {/* 3-col layout */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Active Assignments */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#eceef0]">
              <div className="h-6 w-40 bg-border rounded" />
            </div>
            <div className="p-8 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-border rounded-xl" />
              ))}
            </div>
          </div>
          {/* Recent History */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#eceef0]">
              <div className="h-6 w-32 bg-border rounded" />
            </div>
            <div className="p-8 grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-border rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        {/* Contact card */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#eceef0]">
              <div className="h-6 w-40 bg-border rounded" />
            </div>
            <div className="p-8 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-border rounded-lg shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 w-16 bg-border rounded mb-2" />
                    <div className="h-4 w-32 bg-border rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
