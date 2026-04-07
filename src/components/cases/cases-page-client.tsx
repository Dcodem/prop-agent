"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { StatsBar } from "@/components/cases/stats-bar";
import { CaseFilters } from "@/components/cases/case-filters";
import { CaseTable } from "@/components/cases/case-table";
import { CaseKanban } from "@/components/cases/case-kanban";
import { CaseCreateModal } from "@/components/cases/case-create-modal";
import type { Case, Property, Tenant, Vendor } from "@/lib/db/schema";

const OPEN_STATUSES = new Set(["open", "in_progress", "waiting_on_vendor", "waiting_on_tenant"]);

interface CasesPageClientProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
  vendors: Vendor[];
}

export function CasesPageClient({ cases, properties, tenants, vendors }: CasesPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const [viewMode, setViewMode] = useState<"table" | "kanban">(
    (searchParams.get("view") as "table" | "kanban") || "table",
  );
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [urgencyFilter, setUrgencyFilter] = useState(searchParams.get("urgency") ?? "");
  const [propertyFilter, setPropertyFilter] = useState(searchParams.get("property") ?? "");
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter === "__open__") {
        if (!OPEN_STATUSES.has(c.status)) return false;
      } else if (statusFilter && c.status !== statusFilter) {
        return false;
      }
      if (urgencyFilter && c.urgency !== urgencyFilter) return false;
      if (propertyFilter && c.propertyId !== propertyFilter) return false;
      return true;
    });
  }, [cases, statusFilter, urgencyFilter, propertyFilter]);

  const openCount = cases.filter(
    (c) => !["resolved", "closed"].includes(c.status)
  ).length;

  const uniquePropertyIds = new Set(cases.map((c) => c.propertyId).filter(Boolean));

  const [alertDismissed, setAlertDismissed] = useState(false);
  const aiProcessing = cases.filter((c) => c.status === "open").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-12">
      {/* Status Alert Bar */}
      <AnimatePresence>
        {!alertDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-accent/5 border border-accent/15"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
                </span>
                <span className="text-sm font-bold text-on-surface">AI Active</span>
              </div>
              <span className="hidden sm:inline text-xs text-on-surface-variant">|</span>
              <span className="hidden sm:inline text-xs text-on-surface-variant">
                Monitoring <strong className="text-on-surface">{cases.length}</strong> cases &middot; <strong className="text-on-surface">{aiProcessing}</strong> awaiting triage
              </span>
              {aiProcessing > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/10 text-info text-[11px] font-bold border border-info/20">
                  <span className="material-symbols-outlined text-xs">autorenew</span>
                  Processing
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[11px] font-bold border border-success/20">
                <span className="material-symbols-outlined text-xs">check</span>
                94.8% confidence
              </span>
              <button onClick={() => setAlertDismissed(true)} className="p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface">Cases</h1>
        <p className="text-on-surface-variant text-sm">Monitor and manage maintenance cases across your property portfolio.</p>
      </div>

      {/* KPI Cards */}
      <StatsBar
        totalCases={cases.length}
        openCases={openCount}
        propertyCount={uniquePropertyIds.size}
        onOpenCasesClick={() => {
          if (statusFilter === "__open__") {
            setStatusFilter("");
            updateParams({ status: null });
          } else {
            setStatusFilter("__open__");
            setUrgencyFilter("");
            setPropertyFilter("");
            updateParams({ status: "__open__", urgency: null, property: null });
          }
        }}
      />

      {/* Filter Bar */}
      <CaseFilters
        properties={properties}
        viewMode={viewMode}
        onViewModeChange={(v) => { setViewMode(v); updateParams({ view: v === "table" ? null : v }); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); updateParams({ status: v || null }); }}
        urgencyFilter={urgencyFilter}
        onUrgencyFilterChange={(v) => { setUrgencyFilter(v); updateParams({ urgency: v || null }); }}
        propertyFilter={propertyFilter}
        onPropertyFilterChange={(v) => { setPropertyFilter(v); updateParams({ property: v || null }); }}
        onClearFilters={() => {
          setStatusFilter("");
          setUrgencyFilter("");
          setPropertyFilter("");
          updateParams({ status: null, urgency: null, property: null });
        }}
        onNewCase={() => setShowNewCaseModal(true)}
      />

      {/* View */}
      <div aria-live="polite" aria-atomic="false">
        {viewMode === "table" ? (
          <CaseTable cases={filteredCases} properties={properties} tenants={tenants} />
        ) : (
          <CaseKanban cases={filteredCases} properties={properties} tenants={tenants} />
        )}
      </div>

      {/* New Case Modal */}
      {showNewCaseModal && (
        <CaseCreateModal
          properties={properties}
          vendors={vendors}
          onClose={() => setShowNewCaseModal(false)}
        />
      )}
    </div>
  );
}
