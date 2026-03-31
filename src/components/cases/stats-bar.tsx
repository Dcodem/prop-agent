"use client";

interface StatsBarProps {
  totalCases: number;
  openCases: number;
  propertyCount: number;
}

export function StatsBar({ totalCases, openCases, propertyCount }: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Cases</p>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-900">{totalCases}</span>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-l-4 border-l-orange-500 border-slate-200 shadow-sm">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Open Cases</p>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-900">{openCases}</span>
          {openCases > 0 && (
            <div className="flex items-center text-orange-600 text-[10px] font-bold">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></span>
              Active
            </div>
          )}
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Properties</p>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-900">{propertyCount}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M12 6h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M8 14h.01"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
