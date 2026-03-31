"use client";

import { useState, useMemo } from "react";
import { StatsBar } from "@/components/cases/stats-bar";
import { CaseFilters } from "@/components/cases/case-filters";
import { CaseTable } from "@/components/cases/case-table";
import { CaseKanban } from "@/components/cases/case-kanban";
import type { Case, Property, Tenant } from "@/lib/db/schema";

interface CasesPageClientProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

export function CasesPageClient({ cases, properties, tenants }: CasesPageClientProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false;
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Cases</h1>
        <p className="text-on-surface-variant text-sm">Monitor and manage maintenance cases across your property portfolio.</p>
      </div>

      {/* KPI Cards */}
      <StatsBar
        totalCases={cases.length}
        openCases={openCount}
        propertyCount={uniquePropertyIds.size}
      />

      {/* Filter Bar */}
      <CaseFilters
        properties={properties}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        urgencyFilter={urgencyFilter}
        onUrgencyFilterChange={setUrgencyFilter}
        propertyFilter={propertyFilter}
        onPropertyFilterChange={setPropertyFilter}
        onClearFilters={() => {
          setStatusFilter("");
          setUrgencyFilter("");
          setPropertyFilter("");
        }}
      />

      {/* View */}
      {viewMode === "table" ? (
        <CaseTable cases={filteredCases} properties={properties} tenants={tenants} />
      ) : (
        <CaseKanban cases={filteredCases} properties={properties} tenants={tenants} />
      )}
    </div>
  );
}
