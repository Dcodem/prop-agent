"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { StatsBar } from "@/components/cases/stats-bar";
import { CaseFilters } from "@/components/cases/case-filters";
import { CaseTable } from "@/components/cases/case-table";
import { CaseKanban } from "@/components/cases/case-kanban";
import { CaseCreateModal } from "@/components/cases/case-create-modal";
import type { Case, Property, Tenant, Vendor } from "@/lib/db/schema";

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

  const OPEN_STATUSES = new Set(["open", "in_progress", "waiting_on_vendor", "waiting_on_tenant"]);

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-12">
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
