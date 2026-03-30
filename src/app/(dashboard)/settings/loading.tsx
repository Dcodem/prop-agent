export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-8 w-32 bg-border rounded-lg" />
        <div className="h-4 w-64 bg-border rounded mt-2" />
      </div>
      {/* Setting Cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-xl p-5"
          >
            <div className="h-5 w-40 bg-border rounded-lg mb-2" />
            <div className="h-4 w-72 bg-border rounded mb-4" />
            <div className="space-y-3">
              <div className="h-10 w-full max-w-md bg-border rounded-lg" />
              <div className="h-10 w-full max-w-md bg-border rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
