export default function CaseDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Back link */}
      <div className="h-4 w-24 bg-border rounded mb-4" />
      {/* Header with badges */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-48 bg-border rounded-lg" />
        <div className="h-6 w-20 bg-border rounded-full" />
        <div className="h-6 w-16 bg-border rounded-full" />
      </div>
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Timeline */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5">
          <div className="h-5 w-28 bg-border rounded-lg mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-border rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-40 bg-border rounded mb-2" />
                  <div className="h-4 w-full bg-border rounded mb-1" />
                  <div className="h-4 w-3/4 bg-border rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Info cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-xl p-5"
            >
              <div className="h-5 w-28 bg-border rounded-lg mb-3" />
              <div className="h-4 w-full bg-border rounded mb-2" />
              <div className="h-4 w-3/4 bg-border rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
