export default function NewCaseLoading() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-4 bg-slate-100 rounded animate-pulse"></div>
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
      </div>

      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-10 w-80 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-[500px] bg-slate-100 rounded animate-pulse"></div>
      </div>

      {/* Section 1 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-6 w-40 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100">
          <div className="space-y-6">
            <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-2 gap-8">
              <div className="h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
              <div className="h-10 bg-slate-100 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-6 w-44 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100">
          <div className="h-32 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Section 3 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-6 w-24 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100">
          <div className="grid grid-cols-2 gap-8">
            <div className="h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Section 4 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-6 w-20 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="h-40 bg-white rounded-2xl border-2 border-dashed border-slate-200 animate-pulse"></div>
      </div>

      {/* Section 5 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100">
          <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
        <div className="h-12 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
        <div className="h-12 w-40 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
