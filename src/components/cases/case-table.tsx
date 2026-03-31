"use client";

import Link from "next/link";
import { formatEnum, timeAgo } from "@/lib/utils";
import type { Case, Property, Tenant } from "@/lib/db/schema";

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const CATEGORY_BADGE: Record<string, string> = {
  maintenance: "bg-blue-50 text-blue-700",
  emergency: "bg-red-50 text-red-700",
  lease_question: "bg-indigo-50 text-indigo-700",
  noise_complaint: "bg-gray-50 text-gray-700",
  payment: "bg-emerald-50 text-emerald-700",
  general: "bg-slate-50 text-slate-700",
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

const SOURCE_ICON: Record<string, React.ReactNode> = {
  sms: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
};

interface CaseTableProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

export function CaseTable({ cases, properties, tenants }: CaseTableProps) {
  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-16 text-center">
          <p className="text-slate-500 text-sm">No cases found.</p>
        </div>
      </div>
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
            <Link
              key={c.id}
              href={`/cases/${c.id}`}
              legacyBehavior
            >
              <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`}></span>
                    <span className="text-sm font-medium text-slate-700">{formatEnum(c.urgency ?? "low")}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-900 font-semibold truncate max-w-[300px]">{c.rawMessage}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`${CATEGORY_BADGE[c.category ?? "general"]} text-[11px] font-bold px-2.5 py-1 rounded-full uppercase`}>
                    {formatEnum(c.category ?? "general")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    {SOURCE_ICON[c.source] ?? SOURCE_ICON.email}
                    <span className="text-xs font-medium">{c.source.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[c.status]}`}></span>
                    <span className={`text-sm font-medium ${STATUS_TEXT[c.status]}`}>{formatEnum(c.status)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400 font-medium">{timeAgo(c.createdAt)}</td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
        <span className="text-xs font-medium text-slate-500">Showing {cases.length} case{cases.length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
