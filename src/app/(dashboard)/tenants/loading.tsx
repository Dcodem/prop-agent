export default function TenantsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-32 bg-border rounded-lg" />
          <div className="h-4 w-56 bg-border rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-border rounded-lg" />
      </div>
      {/* Search */}
      <div className="h-10 w-full max-w-sm bg-border rounded-lg mb-4" />
      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex gap-4">
          <div className="h-4 w-32 bg-border rounded" />
          <div className="h-4 w-40 bg-border rounded" />
          <div className="h-4 w-28 bg-border rounded" />
          <div className="h-4 w-24 bg-border rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-border px-4 py-4 flex gap-4 items-center"
          >
            <div className="h-4 w-36 bg-border rounded" />
            <div className="h-4 w-44 bg-border rounded" />
            <div className="h-4 w-24 bg-border rounded" />
            <div className="h-5 w-20 bg-border rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
