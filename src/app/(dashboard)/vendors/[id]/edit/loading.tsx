export default function EditVendorLoading() {
  return (
    <div className="animate-pulse pt-8 pb-24 px-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="h-3 w-48 bg-border rounded mb-4" />
          <div className="h-12 w-72 bg-border rounded-lg" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-24 bg-border rounded-lg" />
          <div className="h-12 w-32 bg-border rounded-lg" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left column */}
        <div className="col-span-8 space-y-12">
          {/* Section 1 */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-6 w-48 bg-border rounded" />
              <div className="h-[1px] flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 bg-border rounded" />
                  <div className="h-12 bg-border rounded" />
                </div>
              ))}
            </div>
          </div>
          {/* Section 2 */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-6 w-36 bg-border rounded" />
              <div className="h-[1px] flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 bg-border rounded" />
                  <div className="h-12 bg-border rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="h-6 w-48 bg-border rounded mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-border rounded" />
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="h-6 w-44 bg-border rounded mb-6" />
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-border" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-border rounded mb-1" />
                    <div className="h-3 w-20 bg-border rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-border/30 p-6 rounded-lg">
            <div className="h-4 w-40 bg-border rounded mb-3" />
            <div className="h-3 w-full bg-border rounded mb-2" />
            <div className="h-3 w-3/4 bg-border rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
