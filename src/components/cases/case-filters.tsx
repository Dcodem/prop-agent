"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CASE_STATUSES, URGENCY_LEVELS } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";

interface CaseFiltersProps {
  properties: { id: string; address: string }[];
  currentStatus?: string;
  currentUrgency?: string;
  currentPropertyId?: string;
}

export function CaseFilters({
  properties,
  currentStatus,
  currentUrgency,
  currentPropertyId,
}: CaseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/cases?${params.toString()}`);
    },
    [router, searchParams],
  );

  const hasFilters = currentStatus || currentUrgency || currentPropertyId;

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-bold text-slate-400 uppercase">Filters:</label>
      <select
        className="bg-slate-50 border-slate-200 rounded-lg text-sm px-3 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 outline-none min-w-[120px]"
        value={currentStatus ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
      >
        <option value="">Status</option>
        {CASE_STATUSES.map((s) => (
          <option key={s} value={s}>{formatEnum(s)}</option>
        ))}
      </select>
      <select
        className="bg-slate-50 border-slate-200 rounded-lg text-sm px-3 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 outline-none min-w-[120px]"
        value={currentUrgency ?? ""}
        onChange={(e) => updateParam("urgency", e.target.value)}
      >
        <option value="">Urgency</option>
        {URGENCY_LEVELS.map((u) => (
          <option key={u} value={u}>{formatEnum(u)}</option>
        ))}
      </select>
      <select
        className="bg-slate-50 border-slate-200 rounded-lg text-sm px-3 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 outline-none min-w-[140px]"
        value={currentPropertyId ?? ""}
        onChange={(e) => updateParam("propertyId", e.target.value)}
      >
        <option value="">Property</option>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>{p.address}</option>
        ))}
      </select>
      {hasFilters && (
        <button
          onClick={() => router.push("/cases")}
          className="text-cyan-700 text-sm font-medium hover:underline ml-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
