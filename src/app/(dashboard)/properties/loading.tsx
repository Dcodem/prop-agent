export default function PropertiesLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-40 bg-border rounded-lg" />
          <div className="h-4 w-72 bg-border rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-border rounded-lg" />
      </div>
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-xl p-5"
          >
            <div className="h-5 w-40 bg-border rounded-lg mb-3" />
            <div className="h-4 w-32 bg-border rounded mb-2" />
            <div className="h-4 w-24 bg-border rounded mb-4" />
            <div className="h-6 w-16 bg-border rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
