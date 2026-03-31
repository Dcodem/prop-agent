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
      <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-8">
          Case Controls
        </h3>
        <div className="space-y-8">
          <StatusUpdateForm
            caseId={caseData.id}
            currentStatus={caseData.status}
          />

          <div className="space-y-3">
            <label className="text-xs font-black text-on-surface uppercase tracking-wider px-1">
              Assign Contractor
            </label>
            {vendor ? (
              <div className="flex items-center gap-4 p-5 bg-primary-fixed rounded-lg border border-outline-variant/10">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-black text-lg">
                  {vendor.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-black">{vendor.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
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

          <button className="w-full py-5 bg-primary-fixed text-primary rounded-lg font-black text-sm flex items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">calendar_today</span>
            Schedule Inspection
          </button>
          <button className="w-full py-5 border-2 border-outline-variant/20 text-on-surface rounded-lg font-black text-sm flex items-center justify-center gap-3 hover:bg-surface transition-all">
            <span className="material-symbols-outlined">description</span>
            Generate Work Order
          </button>
        </div>
      </div>

      {/* Financial Ledger */}
      <div className="bg-primary-fixed rounded-2xl p-10 shadow-sm border border-outline-variant/10">
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">
          Estimated Costs
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-on-surface-variant">Service Call Fee</span>
            <span className="font-bold">$85.00</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-on-surface-variant">Labor (Est.)</span>
            <span className="font-bold">$120.00</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-on-surface-variant">Parts (Est.)</span>
            <span className="font-bold">$0.00</span>
          </div>
          <div className="h-[2px] bg-outline-variant/20 my-4"></div>
          <div className="flex justify-between items-center text-2xl">
            <span className="font-black text-on-surface tracking-tighter">
              Total Est.
            </span>
            <span className="font-black text-primary">$205.00</span>
          </div>
        </div>
        <div className="mt-8 p-4 bg-surface-container-lowest/50 rounded-lg border border-primary/10">
          <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed uppercase tracking-wider">
            Pre-approved budget:{" "}
            <span className="text-primary font-black">
              {spendingAuthorized > 0
                ? formatCurrency(spendingAuthorized)
                : "$500.00"}
            </span>
          </p>
          <div className="w-full h-1.5 bg-outline-variant/20 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: "41%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="h-56 bg-surface-container">
          <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-outline">
              map
            </span>
          </div>
        </div>
        <div className="p-8">
          <h4 className="text-lg font-black mb-4">
            {property?.address ?? "Unknown Property"}
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              <span className="material-symbols-outlined text-primary text-xl">
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
              <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <span className="material-symbols-outlined text-primary text-xl">
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
