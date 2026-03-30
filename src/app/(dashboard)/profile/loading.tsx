export default function ProfileLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex items-center gap-8">
        <div className="w-32 h-32 rounded-xl bg-[#e6e8ea]"></div>
        <div className="flex-1 space-y-3">
          <div className="h-10 w-64 bg-[#e6e8ea] rounded-lg"></div>
          <div className="h-5 w-48 bg-[#e6e8ea] rounded-lg"></div>
          <div className="h-3 w-32 bg-[#e6e8ea] rounded-lg"></div>
        </div>
        <div className="h-10 w-36 bg-[#e6e8ea] rounded-lg"></div>
      </div>

      {/* PropAgent Overview Skeleton */}
      <div className="bg-white rounded-xl p-8 border-l-4 border-[#e6e8ea]">
        <div className="h-6 w-28 bg-[#e6e8ea] rounded-full mb-4"></div>
        <div className="h-7 w-48 bg-[#e6e8ea] rounded-lg mb-2"></div>
        <div className="h-4 w-80 bg-[#e6e8ea] rounded-lg mb-6"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#f7f9fb] p-5 rounded-lg h-24"></div>
          <div className="bg-[#f7f9fb] p-5 rounded-lg h-24"></div>
          <div className="bg-[#f7f9fb] p-5 rounded-lg h-24"></div>
        </div>
      </div>

      {/* Performance Metrics Skeleton */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#f2f4f6] p-8 rounded-xl h-48"></div>
        <div className="bg-[#f2f4f6] p-8 rounded-xl h-48"></div>
        <div className="bg-[#f2f4f6] p-8 rounded-xl h-48"></div>
      </div>

      {/* Account Details Skeleton */}
      <div className="bg-white rounded-xl p-8">
        <div className="h-7 w-40 bg-[#e6e8ea] rounded-lg mb-6"></div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-[#e6e8ea] rounded"></div>
            <div className="bg-[#e6e8ea] p-4 rounded-lg h-12"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-[#e6e8ea] rounded"></div>
            <div className="bg-[#e6e8ea] p-4 rounded-lg h-12"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-12 w-full bg-[#f7f9fb] rounded-lg"></div>
          <div className="h-12 w-full bg-[#f7f9fb] rounded-lg"></div>
          <div className="h-12 w-full bg-[#f7f9fb] rounded-lg"></div>
        </div>
      </div>

      {/* Security Skeleton */}
      <div className="bg-white rounded-xl p-8 border-t-4 border-[#e6e8ea]">
        <div className="h-7 w-40 bg-[#e6e8ea] rounded-lg mb-6"></div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#f7f9fb] p-6 rounded-lg h-36"></div>
          <div className="bg-[#f7f9fb] p-6 rounded-lg h-36"></div>
        </div>
      </div>
    </div>
  );
}
