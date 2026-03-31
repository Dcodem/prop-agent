export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero skeleton */}
      <section className="pt-8 px-8">
        <div className="relative h-96 rounded-xl overflow-hidden bg-slate-200 animate-pulse">
          <div className="absolute bottom-0 left-0 p-10 w-full">
            <div className="h-6 w-32 bg-slate-300 rounded-full mb-4" />
            <div className="h-12 w-96 bg-slate-300 rounded mb-3" />
            <div className="h-5 w-64 bg-slate-300/60 rounded" />
          </div>
        </div>
      </section>

      {/* Metric cards skeleton */}
      <section className="px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl flex flex-col justify-between h-48"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-lg bg-slate-100 animate-pulse" />
              <div className="w-16 h-6 rounded bg-slate-100 animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mb-2" />
              <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </section>

      {/* Maintenance section skeleton */}
      <div className="px-8 mt-12 space-y-12">
        <section>
          <div className="h-7 w-56 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pl-8 space-y-2">
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                    <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                <div className="p-6 rounded-xl border border-slate-100">
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mb-3" />
                  <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="p-6 rounded-xl border border-slate-100">
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mb-3" />
                  <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unit table skeleton */}
        <section>
          <div className="h-7 w-40 bg-slate-200 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50">
              <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 border-t border-slate-50">
                <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
