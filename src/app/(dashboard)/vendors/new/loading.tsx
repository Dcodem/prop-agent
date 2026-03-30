export default function AddVendorLoading() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-12">
        <div className="h-4 w-40 bg-[#e6e8ea] rounded mb-4" />
        <div className="h-10 w-72 bg-[#e6e8ea] rounded mb-4" />
        <div className="h-5 w-96 bg-[#e6e8ea] rounded" />
      </div>

      {/* Form sections skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="contents">
            <div>
              <div className="h-6 w-48 bg-[#e6e8ea] rounded mb-2" />
              <div className="h-4 w-64 bg-[#e6e8ea] rounded" />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
              <div className="h-10 w-full bg-[#f2f4f6] rounded-lg mb-6" />
              <div className="h-10 w-full bg-[#f2f4f6] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
