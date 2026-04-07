"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatEnum, timeAgo, generateCaseSummary } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingBulkAction, setPendingBulkAction] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(cases.length / itemsPerPage));
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return cases.slice(start, start + itemsPerPage);
  }, [cases, currentPage, itemsPerPage]);

  // Reset to page 1 when items per page or data changes
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const allPageSelected = paginatedCases.length > 0 && paginatedCases.every((c) => selectedIds.has(c.id));
  const somePageSelected = paginatedCases.some((c) => selectedIds.has(c.id));

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        paginatedCases.forEach((c) => next.delete(c.id));
      } else {
        paginatedCases.forEach((c) => next.add(c.id));
      }
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBulkAction(action: string) {
    const count = selectedIds.size;
    const previousSelection = new Set(selectedIds);
    setSelectedIds(new Set());
    toast.success(`${action} applied to ${count} case${count !== 1 ? "s" : ""}`, {
      action: {
        label: "Undo",
        onClick: () => {
          setSelectedIds(previousSelection);
          toast.info("Action undone — cases re-selected");
        },
      },
    });
  }

  if (cases.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow overflow-hidden">
        <div className="px-6 py-16 text-center">
          <span className="material-symbols-outlined text-3xl text-success mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <p className="text-on-surface font-semibold text-sm">All clear — no cases match your filters.</p>
          <p className="text-on-surface-variant text-xs mt-1">Try adjusting your filters or create a new case.</p>
        </div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, cases.length);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow overflow-hidden">
      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-accent/[0.06] border-b border-accent/20 flex items-center gap-4 animate-fade-in-up">
          <span className="text-sm font-bold text-accent">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction("Mark as Resolved")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-success-container text-on-success-container hover:bg-success-container/80 transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm">check_circle</span>
              Resolve
            </button>
            <button
              onClick={() => setPendingBulkAction("Closed")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm">archive</span>
              Close
            </button>
            <button
              onClick={() => setPendingBulkAction("Escalated")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-caution-container text-on-caution-container hover:bg-caution-container/80 transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm">priority_high</span>
              Escalate
            </button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/30">
            <th className="pl-6 pr-2 py-4 w-10">
              <input
                type="checkbox"
                checked={allPageSelected}
                ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                onChange={toggleAll}
                aria-label="Select all cases on this page"
                className="w-4 h-4 rounded border-outline-variant accent-accent cursor-pointer"
              />
            </th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-32">Urgency</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Subject</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-40">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-32">Source</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-44">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-24">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {paginatedCases.map((c) => (
            <tr
              key={c.id}
              className={`hover:bg-surface-container-low/50 transition-colors group ${selectedIds.has(c.id) ? "bg-accent/[0.03]" : ""}`}
            >
              <td className="pl-6 pr-2 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggleOne(c.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select case: ${generateCaseSummary(c.rawMessage, c.category)}`}
                  className="w-4 h-4 rounded border-outline-variant accent-accent cursor-pointer"
                />
              </td>
              <td className="px-6 py-4">
                <Link href={`/cases/${c.id}`} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`}></span>
                  <span className="text-sm font-medium text-on-surface">{formatEnum(c.urgency ?? "low")}</span>
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/cases/${c.id}`} className="block text-sm text-on-surface font-semibold">
                  {generateCaseSummary(c.rawMessage, c.category)}
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/cases/${c.id}`}>
                  <span className={`${CATEGORY_BADGE[c.category ?? "general"]} text-[11px] font-bold px-2.5 py-1 rounded-full uppercase`}>
                    {formatEnum(c.category ?? "general")}
                  </span>
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/cases/${c.id}`} className="flex items-center gap-2 text-on-surface-variant">
                  {SOURCE_ICON[c.source] ?? SOURCE_ICON.email}
                  <span className="text-xs font-medium">{c.source.toUpperCase()}</span>
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/cases/${c.id}`} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STATUS_DOT[c.status]}`}></span>
                  <span className={`text-sm font-medium ${STATUS_TEXT[c.status]}`}>{formatEnum(c.status)}</span>
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link href={`/cases/${c.id}`} className="text-xs text-outline font-medium">
                  {timeAgo(c.createdAt)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-on-surface-variant">
            Showing {startItem}–{endItem} of {cases.length} case{cases.length !== 1 ? "s" : ""}
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="text-xs bg-surface-container-lowest border border-outline-variant/20 rounded px-2 py-1 text-on-surface-variant focus:ring-1 focus:ring-accent"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`w-8 h-8 text-xs font-bold rounded transition-colors ${
                page === currentPage
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={pendingBulkAction !== null}
        onClose={() => setPendingBulkAction(null)}
        onConfirm={() => {
          if (pendingBulkAction) handleBulkAction(pendingBulkAction);
          setPendingBulkAction(null);
        }}
        title={`${pendingBulkAction === "Closed" ? "Close" : "Escalate"} ${selectedIds.size} case${selectedIds.size !== 1 ? "s" : ""}?`}
        description={
          pendingBulkAction === "Closed"
            ? "Closed cases will no longer appear in your active queue. You can undo this immediately after."
            : "Escalated cases will be flagged for urgent review. You can undo this immediately after."
        }
        confirmLabel={pendingBulkAction === "Closed" ? "Close Cases" : "Escalate Cases"}
        confirmVariant={pendingBulkAction === "Closed" ? "destructive" : "primary"}
      />
    </div>
  );
}
