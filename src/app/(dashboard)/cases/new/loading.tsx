export default function NewCaseLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-12 bg-[#bdc9ca]/20 rounded" />
        <div className="h-4 w-4 bg-[#bdc9ca]/20 rounded" />
        <div className="h-4 w-24 bg-[#bdc9ca]/20 rounded" />
      </div>

      {/* Header */}
      <div className="mb-2">
        <div className="h-10 w-80 bg-[#bdc9ca]/20 rounded-lg" />
      </div>
      <div className="h-5 w-96 bg-[#bdc9ca]/20 rounded mb-12" />

      {/* Form sections */}
      <div className="max-w-4xl space-y-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#c5e9ee]/40" />
              <div className="h-6 w-40 bg-[#bdc9ca]/20 rounded" />
            </div>
            <div className="bg-white p-8 rounded-[1rem] border border-[#bdc9ca]/20">
              <div className="h-12 w-full bg-[#eff4ff]/60 rounded-[1rem] mb-4" />
              <div className="h-12 w-full bg-[#eff4ff]/60 rounded-[1rem]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
