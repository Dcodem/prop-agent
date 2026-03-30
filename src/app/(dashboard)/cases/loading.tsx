export default function CasesLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-32 bg-border rounded-lg" />
          <div className="h-4 w-64 bg-border rounded mt-2" />
        </div>
      </div>
      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="h-10 w-36 bg-border rounded-lg" />
        <div className="h-10 w-36 bg-border rounded-lg" />
        <div className="h-10 w-36 bg-border rounded-lg" />
      </div>
      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex gap-4">
          <div className="h-4 w-16 bg-border rounded" />
          <div className="h-4 w-48 bg-border rounded" />
          <div className="h-4 w-24 bg-border rounded" />
          <div className="h-4 w-20 bg-border rounded" />
          <div className="h-4 w-20 bg-border rounded" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-border px-4 py-4 flex gap-4 items-center"
          >
            <div className="h-5 w-14 bg-border rounded-full" />
            <div className="h-4 w-56 bg-border rounded" />
            <div className="h-4 w-28 bg-border rounded" />
            <div className="h-5 w-20 bg-border rounded-full" />
            <div className="h-4 w-16 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
