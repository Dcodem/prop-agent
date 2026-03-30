import Link from "next/link";
import { timeAgo, formatEnum } from "@/lib/utils";
import type { Case } from "@/lib/db/schema";

interface CaseKanbanProps {
  cases: Case[];
}

const COLUMNS = [
  { key: "open", label: "New Cases", dot: "bg-[#006872]", statuses: ["open"] },
  { key: "dispatched", label: "Vendor Dispatched", dot: "bg-cyan-600", statuses: ["waiting_on_vendor"] },
  { key: "progress", label: "In Progress", dot: "bg-amber-400", statuses: ["in_progress", "waiting_on_tenant"] },
  { key: "resolved", label: "Resolved", dot: "bg-emerald-500", statuses: ["resolved", "closed"] },
];

const URGENCY_BORDER: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-amber-500",
  low: "border-l-blue-500",
};

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
};

export function CaseKanban({ cases }: CaseKanbanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
      {COLUMNS.map((col) => {
        const colCases = cases.filter((c) => col.statuses.includes(c.status));
        const isResolved = col.key === "resolved";

        return (
          <div key={col.key} className="flex flex-col gap-4">
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                <h3 className="font-bold text-sm tracking-tight text-slate-500 uppercase">{col.label}</h3>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{colCases.length}</span>
            </div>

            {/* Cards */}
            {colCases.map((c) => {
              const urgencyBorder = URGENCY_BORDER[c.urgency ?? "low"] ?? "border-l-slate-300";
              const urgencyDot = URGENCY_DOT[c.urgency ?? "low"] ?? "bg-slate-400";
              const confidence = c.confidenceScore != null ? Math.round(c.confidenceScore * 100) : null;

              return (
                <Link key={c.id} href={`/cases/${c.id}`}>
                  <div className={`bg-white p-5 rounded-xl border-l-[3px] ${urgencyBorder} flex flex-col gap-4 transition-all hover:translate-y-[-2px] ${isResolved ? "opacity-70 grayscale-[0.3]" : ""}`}>
                    <div className="flex justify-between items-start">
                      <div className={`w-3 h-3 rounded-full ${urgencyDot}`} title={c.urgency ? formatEnum(c.urgency) : ""}></div>
                      {confidence != null && (
                        <span className="text-[10px] font-bold bg-[#c5e9ee] text-[#2a4c50] px-2 py-0.5 rounded-full">{confidence}% Confidence</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-snug mb-1 line-clamp-2">{c.rawMessage}</h4>
                      {c.category && (
                        <p className="text-xs text-slate-500 font-medium">{formatEnum(c.category)}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="material-symbols-outlined text-sm">{c.source === "email" ? "mail" : "sms"}</span>
                        <span>{c.source === "email" ? "Email" : "SMS"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium italic">{timeAgo(c.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {colCases.length === 0 && (
              <div className="bg-slate-50 p-5 rounded-xl border-2 border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-400 font-medium">No cases</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
