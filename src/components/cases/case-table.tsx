import Link from "next/link";
import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { timeAgo, formatEnum } from "@/lib/utils";
import type { Case } from "@/lib/db/schema";

interface CaseTableProps {
  cases: Case[];
}

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const STATUS_DOT: Record<string, string> = {
  open: "bg-blue-500",
  in_progress: "bg-purple-500",
  waiting_on_vendor: "bg-orange-500",
  waiting_on_tenant: "bg-amber-500",
  resolved: "bg-green-500",
  closed: "bg-slate-400",
};

const STATUS_TEXT: Record<string, string> = {
  open: "text-blue-700",
  in_progress: "text-purple-700",
  waiting_on_vendor: "text-orange-700",
  waiting_on_tenant: "text-amber-700",
  resolved: "text-green-700",
  closed: "text-slate-500",
};

const CATEGORY_STYLE: Record<string, string> = {
  emergency: "bg-red-50 text-red-700",
  maintenance: "bg-blue-50 text-blue-700",
  noise_complaint: "bg-gray-50 text-gray-700",
  lease_question: "bg-indigo-50 text-indigo-700",
  payment: "bg-emerald-50 text-emerald-700",
  general: "bg-slate-50 text-slate-700",
};

export function CaseTable({ cases }: CaseTableProps) {
  if (cases.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No cases found"
        description="Cases will appear here when tenants send messages."
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Urgency</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Source</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-44">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {cases.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[c.urgency ?? "low"] ?? "bg-slate-300"}`}></span>
                  <span className="text-sm font-medium text-slate-700">{c.urgency ? formatEnum(c.urgency) : "—"}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Link href={`/cases/${c.id}`}>
                  <p className="text-sm text-slate-900 font-semibold truncate max-w-[300px]">{c.rawMessage}</p>
                </Link>
              </td>
              <td className="px-6 py-4">
                {c.category && (
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${CATEGORY_STYLE[c.category] ?? "bg-slate-50 text-slate-700"}`}>
                    {formatEnum(c.category)}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined text-lg">{c.source === "email" ? "mail" : "sms"}</span>
                  <span className="text-xs font-medium">{c.source === "email" ? "Email" : "SMS"}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STATUS_DOT[c.status] ?? "bg-slate-300"}`}></span>
                  <span className={`text-sm font-medium ${STATUS_TEXT[c.status] ?? "text-slate-500"}`}>{formatEnum(c.status)}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-slate-400 font-medium">{timeAgo(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
        <span className="text-xs font-medium text-slate-500">Showing {cases.length} cases</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 rounded border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white">Next</button>
        </div>
      </div>
    </div>
  );
}
