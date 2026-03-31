"use client";

import { useRouter } from "next/navigation";
import { formatEnum, timeAgo } from "@/lib/utils";
import type { Case, Property, Tenant } from "@/lib/db/schema";

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-error",
  high: "bg-caution",
  medium: "bg-warning-dim",
  low: "bg-success-dim",
};

const CATEGORY_BADGE: Record<string, string> = {
  maintenance: "bg-info-container text-info",
  emergency: "bg-error-container text-on-error-container",
  lease_question: "bg-purple-container text-on-purple-container",
  noise_complaint: "bg-neutral-container text-on-neutral-container",
  payment: "bg-success-container text-on-success-container",
  general: "bg-surface-container-high text-on-surface-variant",
};

const STATUS_DOT: Record<string, string> = {
  open: "bg-info",
  in_progress: "bg-purple",
  waiting_on_vendor: "bg-caution",
  waiting_on_tenant: "bg-warning-dim",
  resolved: "bg-success-dim",
  closed: "bg-neutral",
};

const STATUS_TEXT: Record<string, string> = {
  open: "text-info",
  in_progress: "text-on-purple-container",
  waiting_on_vendor: "text-on-caution-container",
  waiting_on_tenant: "text-on-warning-container",
  resolved: "text-on-success-container",
  closed: "text-on-neutral-container",
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
  const router = useRouter();

  if (cases.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow overflow-hidden">
        <div className="px-6 py-16 text-center">
          <p className="text-on-surface-variant text-sm">No cases found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/30">
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-32">Urgency</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Subject</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-40">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-32">Source</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-44">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-24">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {cases.map((c) => (
            <tr
              key={c.id}
              onClick={() => router.push(`/cases/${c.id}`)}
              className="hover:bg-primary-fixed/30 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`}></span>
                  <span className="text-sm font-medium text-on-surface">{formatEnum(c.urgency ?? "low")}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-on-surface font-semibold truncate max-w-[300px]">{c.rawMessage}</p>
              </td>
              <td className="px-6 py-4">
                <span className={`${CATEGORY_BADGE[c.category ?? "general"]} text-[11px] font-bold px-2.5 py-1 rounded-full uppercase`}>
                  {formatEnum(c.category ?? "general")}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-on-surface-variant">
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
              <td className="px-6 py-4 text-xs text-outline font-medium">{timeAgo(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/30">
        <span className="text-xs font-medium text-on-surface-variant">Showing {cases.length} case{cases.length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
