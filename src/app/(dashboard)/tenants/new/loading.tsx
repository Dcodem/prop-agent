export default function AddTenantLoading() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-12">
        <div className="h-3 w-40 bg-[#e6e8ea] rounded mb-4" />
        <div className="h-10 w-64 bg-[#e6e8ea] rounded-lg mb-4" />
        <div className="h-4 w-96 bg-[#e6e8ea] rounded" />
      </div>
      {/* Form sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#e6e8ea] p-8"
          >
            <div className="h-5 w-40 bg-[#e6e8ea] rounded mb-6" />
            <div className="space-y-6">
              <div>
                <div className="h-3 w-20 bg-[#e6e8ea] rounded mb-2" />
                <div className="h-12 w-full bg-[#f2f4f6] rounded-lg" />
              </div>
              <div>
                <div className="h-3 w-24 bg-[#e6e8ea] rounded mb-2" />
                <div className="h-12 w-full bg-[#f2f4f6] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Actions */}
      <div className="flex items-center justify-end gap-4 mt-10 pt-8 border-t border-[#e6e8ea]">
        <div className="h-12 w-28 bg-[#e6e8ea] rounded-xl" />
        <div className="h-12 w-40 bg-[#e6e8ea] rounded-xl" />
      </div>
    </div>
  );
}
