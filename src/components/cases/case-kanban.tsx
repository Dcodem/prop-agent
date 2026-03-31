"use client";

import Link from "next/link";
import { formatEnum, timeAgo } from "@/lib/utils";
import type { Case, Property, Tenant } from "@/lib/db/schema";

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
};

const URGENCY_BORDER: Record<string, string> = {
  critical: "border-red-500",
  high: "border-red-500",
  medium: "border-amber-500",
  low: "border-blue-500",
};

/** Map case status to a kanban column key */
function statusToColumn(status: string): string {
  switch (status) {
    case "open":
      return "new";
    case "waiting_on_vendor":
    case "in_progress":
      return status;
    case "waiting_on_tenant":
      return "in_progress";
    case "resolved":
    case "closed":
      return "resolved";
    default:
      return "new";
  }
}

const COLUMNS = [
  { key: "new", label: "New Cases", dot: "bg-blue-600" },
  { key: "waiting_on_vendor", label: "Vendor Dispatched", dot: "bg-cyan-600" },
  { key: "in_progress", label: "In Progress", dot: "bg-amber-400" },
  { key: "resolved", label: "Resolved", dot: "bg-emerald-500" },
] as const;

interface CaseKanbanProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

export function CaseKanban({ cases, properties, tenants }: CaseKanbanProps) {
  const propertyMap = new Map(properties.map((p) => [p.id, p]));
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));

  // Group cases into columns
  const columns: Record<string, Case[]> = {
    new: [],
    waiting_on_vendor: [],
    in_progress: [],
    resolved: [],
  };
  for (const c of cases) {
    const col = statusToColumn(c.status);
    columns[col]?.push(c);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
      {COLUMNS.map((col) => {
        const colCases = columns[col.key] ?? [];
        const isResolved = col.key === "resolved";

        return (
          <div key={col.key} className="flex flex-col gap-4">
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                <h3 className="font-bold text-sm tracking-tight text-on-surface-variant uppercase">{col.label}</h3>
              </div>
              <span className="text-xs font-bold text-outline bg-surface-container-low px-2 py-0.5 rounded-full">
                {colCases.length}
              </span>
            </div>

            {/* Cards */}
            {colCases.map((c) => {
              const property = c.propertyId ? propertyMap.get(c.propertyId) : null;
              const tenant = c.tenantId ? tenantMap.get(c.tenantId) : null;

              return (
                <Link key={c.id} href={`/cases/${c.id}`} className="block">
                  <div
                    className={`bg-surface-container-lowest p-5 rounded-xl border-l-[3px] ${
                      isResolved
                        ? "border-outline-variant opacity-70"
                        : URGENCY_BORDER[c.urgency ?? "low"]
                    } flex flex-col gap-4 transition-all hover:translate-y-[-2px]`}
                  >
                    {/* Top row: priority dot + confidence */}
                    <div className="flex justify-between items-start">
                      {isResolved ? (
                        <>
                          <div className={`w-3 h-3 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`}></div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </>
                      ) : (
                        <>
                          <div className={`w-3 h-3 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`} title={`${formatEnum(c.urgency ?? "low")} Priority`}></div>
                          {c.confidenceScore != null && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              (c.urgency === "critical" || c.urgency === "high")
                                ? "bg-red-50 text-red-700"
                                : "bg-surface-container-low text-on-surface-variant"
                            }`}>
                              {Math.round(c.confidenceScore * 100)}% Confidence
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Title & location */}
                    <div>
                      <h4 className="font-bold text-on-surface leading-snug mb-1 line-clamp-2">{c.rawMessage}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {tenant?.unitNumber ? `Unit ${tenant.unitNumber}` : ""}
                        {tenant?.unitNumber && property ? " \u2022 " : ""}
                        {property?.address ?? ""}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                      {tenant ? (
                        <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant border-2 border-white">
                          {tenant.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <span className="text-[10px] text-outline font-medium italic">
                        {isResolved && c.resolvedAt
                          ? `Closed ${timeAgo(c.resolvedAt)}`
                          : timeAgo(c.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {colCases.length === 0 && (
              <div className="bg-surface-container-lowest/50 p-5 rounded-xl border border-dashed border-outline-variant/20 text-center">
                <p className="text-xs text-outline">No cases</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
