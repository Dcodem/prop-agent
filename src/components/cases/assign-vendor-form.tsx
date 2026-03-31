"use client";

import { useTransition, useState } from "react";
import { assignVendorAction } from "@/app/(dashboard)/cases/actions";
import type { Vendor } from "@/lib/db/schema";

export function AssignVendorForm({
  caseId,
  allVendors,
  currentVendorId,
  mode,
}: {
  caseId: string;
  allVendors: Vendor[];
  currentVendorId: string | null;
  mode: "assign" | "edit";
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  function handleAssign(vendorId: string) {
    startTransition(async () => {
      await assignVendorAction(caseId, vendorId);
      setIsOpen(false);
    });
  }

  if (mode === "edit") {
    return (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#3e494a] hover:text-[#006872] p-2 rounded-lg transition-colors bg-white shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-20 w-72 bg-white rounded-lg shadow-xl border border-[#bdc9ca]/20 p-2 max-h-64 overflow-y-auto">
            {allVendors.map((v) => (
              <button
                key={v.id}
                onClick={() => handleAssign(v.id)}
                disabled={isPending || v.id === currentVendorId}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#eff4ff] transition-colors disabled:opacity-50 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-[#006872]/10 text-[#006872] rounded-md flex items-center justify-center font-bold text-xs">
                  {v.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0d1c2e]">{v.name}</p>
                  <p className="text-[10px] text-[#3e494a] uppercase tracking-wider">
                    {v.trade}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </>
    );
  }

  // mode === "assign"
  return (
    <div className="relative">
      <div className="relative group">
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) handleAssign(e.target.value);
          }}
          disabled={isPending}
          className="w-full appearance-none bg-[#eff4ff] border-2 border-transparent rounded-lg px-5 py-4 text-sm font-bold focus:ring-0 focus:border-[#006872] transition-all disabled:opacity-50"
        >
          <option value="" disabled>
            {isPending ? "Assigning..." : "Select a contractor..."}
          </option>
          {allVendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.trade})
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-5 top-4 pointer-events-none text-[#3e494a] opacity-50">
          expand_more
        </span>
      </div>
    </div>
  );
}
