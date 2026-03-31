"use client";

import type { Case, Vendor, Property } from "@/lib/db/schema";
import { StatusUpdateForm } from "./status-update-form";
import { AssignVendorForm } from "./assign-vendor-form";
import { formatCurrency } from "@/lib/utils";

export function CaseSidebar({
  caseData,
  vendor,
  property,
  allVendors,
}: {
  caseData: Case;
  vendor: Vendor | null;
  property: Property | null;
  allVendors: Vendor[];
}) {
  const spendingAuthorized = caseData.spendingAuthorized ?? 0;

  return (
    <div className="col-span-12 lg:col-span-4 space-y-10">
      {/* Quick Actions Tile */}
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#bdc9ca]/10">
        <h3 className="text-xs font-black text-[#3e494a] uppercase tracking-[0.2em] mb-8">
          Case Controls
        </h3>
        <div className="space-y-8">
          <StatusUpdateForm
            caseId={caseData.id}
            currentStatus={caseData.status}
          />

          <div className="space-y-3">
            <label className="text-xs font-black text-[#0d1c2e] uppercase tracking-wider px-1">
              Assign Contractor
            </label>
            {vendor ? (
              <div className="flex items-center gap-4 p-5 bg-[#eff4ff] rounded-lg border border-[#bdc9ca]/10">
                <div className="w-12 h-12 bg-[#006872]/10 text-[#006872] rounded-lg flex items-center justify-center font-black text-lg">
                  {vendor.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-black">{vendor.name}</p>
                  <p className="text-[10px] text-[#3e494a] font-bold uppercase tracking-wider">
                    {vendor.trade
                      ? vendor.trade.charAt(0).toUpperCase() +
                        vendor.trade.slice(1)
                      : "General"}{" "}
                    {vendor.preferenceScore
                      ? `\u2022 \u2605 ${vendor.preferenceScore.toFixed(1)}`
                      : ""}
                  </p>
                </div>
                <AssignVendorForm
                  caseId={caseData.id}
                  allVendors={allVendors}
                  currentVendorId={vendor.id}
                  mode="edit"
                />
              </div>
            ) : (
              <AssignVendorForm
                caseId={caseData.id}
                allVendors={allVendors}
                currentVendorId={null}
                mode="assign"
              />
            )}
          </div>

          <button className="w-full py-5 bg-[#c5e9ee] text-[#486a6f] rounded-lg font-black text-sm flex items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">calendar_today</span>
            Schedule Inspection
          </button>
          <button className="w-full py-5 border-2 border-[#bdc9ca]/20 text-[#0d1c2e] rounded-lg font-black text-sm flex items-center justify-center gap-3 hover:bg-[#f8f9ff] transition-all">
            <span className="material-symbols-outlined">description</span>
            Generate Work Order
          </button>
        </div>
      </div>

      {/* Financial Ledger */}
      <div className="bg-[#eff4ff] rounded-2xl p-10 shadow-sm border border-[#bdc9ca]/10">
        <h3 className="text-xs font-black text-[#3e494a] uppercase tracking-[0.2em] mb-6">
          Estimated Costs
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-[#3e494a]">Service Call Fee</span>
            <span className="font-bold">$85.00</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-[#3e494a]">Labor (Est.)</span>
            <span className="font-bold">$120.00</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-[#3e494a]">Parts (Est.)</span>
            <span className="font-bold">$0.00</span>
          </div>
          <div className="h-[2px] bg-[#bdc9ca]/20 my-4"></div>
          <div className="flex justify-between items-center text-2xl">
            <span className="font-black text-[#0d1c2e] tracking-tighter">
              Total Est.
            </span>
            <span className="font-black text-[#006872]">$205.00</span>
          </div>
        </div>
        <div className="mt-8 p-4 bg-white/50 rounded-lg border border-[#006872]/10">
          <p className="text-[10px] text-[#3e494a] font-bold leading-relaxed uppercase tracking-wider">
            Pre-approved budget:{" "}
            <span className="text-[#006872] font-black">
              {spendingAuthorized > 0
                ? formatCurrency(spendingAuthorized)
                : "$500.00"}
            </span>
          </p>
          <div className="w-full h-1.5 bg-[#d0daf0] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#006872] rounded-full"
              style={{ width: "41%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#bdc9ca]/10">
        <div className="h-56 bg-slate-200">
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-400">
              map
            </span>
          </div>
        </div>
        <div className="p-8">
          <h4 className="text-lg font-black mb-4">
            {property?.address ?? "Unknown Property"}
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-bold text-[#3e494a] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[#006872] text-xl">
                apartment
              </span>
              {property?.type
                ? property.type.charAt(0).toUpperCase() +
                  property.type.slice(1)
                : "Residential"}{" "}
              &bull;{" "}
              {property?.unitCount
                ? `${property.unitCount} Unit${property.unitCount > 1 ? "s" : ""}`
                : "1 Unit"}
            </div>
            {property?.notes && (
              <div className="flex items-center gap-4 text-xs font-bold text-[#3e494a] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[#006872] text-xl">
                  info
                </span>
                {property.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
