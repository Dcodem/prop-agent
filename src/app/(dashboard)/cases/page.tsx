import Link from "next/link";
import { getOrgId } from "@/lib/db/queries/helpers";
import { listCases } from "@/lib/db/queries/cases";
import { listProperties } from "@/lib/db/queries/properties";
import { CaseFilters } from "@/components/cases/case-filters";
import { CaseTable } from "@/components/cases/case-table";
import { CaseKanban } from "@/components/cases/case-kanban";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    urgency?: string;
    propertyId?: string;
    view?: string;
  }>;
}) {
  const orgId = await getOrgId();
  const params = await searchParams;

  const [cases, properties] = await Promise.all([
    listCases(orgId, {
      status: params.status as any,
      urgency: params.urgency as any,
      propertyId: params.propertyId,
    }),
    listProperties(orgId),
  ]);

  const openCount = cases.filter(
    (c) => c.status === "open" || c.status === "in_progress"
  ).length;

  const isKanban = params.view === "kanban";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Cases</h1>
        <p className="text-slate-500 text-sm">Monitor and manage maintenance cases across your property portfolio.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Cases</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900">{cases.length}</span>
            <span className="material-symbols-outlined text-slate-300">folder_open</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-l-4 border-l-orange-500 border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Open Cases</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900">{openCount}</span>
            {openCount > 0 && (
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
            <span className="text-3xl font-bold text-slate-900">{properties.length}</span>
            <span className="material-symbols-outlined text-slate-300">apartment</span>
          </div>
        </div>
      </div>

      {/* Filter Bar with View Toggle */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <CaseFilters
          properties={properties.map((p) => ({ id: p.id, address: p.address }))}
          currentStatus={params.status}
          currentUrgency={params.urgency}
          currentPropertyId={params.propertyId}
        />
        <div className="ml-auto flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <Link
              href={`/cases?${new URLSearchParams({ ...params, view: "table" }).toString()}`}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!isKanban ? "bg-white text-cyan-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Table
            </Link>
            <Link
              href={`/cases?${new URLSearchParams({ ...params, view: "kanban" }).toString()}`}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${isKanban ? "bg-white text-cyan-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Kanban
            </Link>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button className="bg-[#00838f] hover:bg-[#006872] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <span className="material-symbols-outlined text-sm">add</span>
            New Case
          </button>
        </div>
      </div>

      {/* Table or Kanban View */}
      {isKanban ? (
        <CaseKanban cases={cases} />
      ) : (
        <CaseTable cases={cases} />
      )}
    </div>
  );
}
