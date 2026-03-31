"use client";

import { useState } from "react";
import Link from "next/link";
import type { Property, Tenant, Case } from "@/lib/db/schema";
import { formatEnum, timeAgo } from "@/lib/utils";

type Props = {
  property: Property;
  tenants: Tenant[];
  cases: Case[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getCaseStatusColor(status: string) {
  switch (status) {
    case "open":
    case "in_progress":
      return "bg-[#eff4ff] text-[#006872]";
    case "waiting_on_vendor":
    case "waiting_on_tenant":
      return "bg-[#ffdcc5] text-[#703801]";
    case "resolved":
    case "closed":
      return "bg-[#c5e9ee] text-[#486a6f]";
    default:
      return "bg-[#eff4ff] text-[#006872]";
  }
}

function getCaseUrgencyColor(urgency: string | null) {
  switch (urgency) {
    case "critical":
      return "bg-[#ba1a1a] border-white ring-[#ba1a1a]/10";
    case "high":
      return "bg-[#aa662f] border-white ring-[#aa662f]/10";
    case "medium":
      return "bg-[#006872] border-white ring-[#006872]/10";
    case "low":
      return "bg-slate-400 border-white ring-slate-400/10";
    default:
      return "bg-[#006872] border-white ring-[#006872]/10";
  }
}

function getCaseUrgencyBadge(urgency: string | null) {
  switch (urgency) {
    case "critical":
      return "bg-[#ffdad6] text-[#93000a]";
    case "high":
      return "bg-[#ffdcc5] text-[#703801]";
    default:
      return "bg-[#eff4ff] text-[#006872]";
  }
}

export function PropertyDetailClient({ property, tenants, cases }: Props) {
  const [documentsOpen, setDocumentsOpen] = useState(false);

  const activeCases = cases.filter(
    (c) => !["resolved", "closed"].includes(c.status)
  );
  const occupiedUnits = tenants.length;
  const totalUnits = property.unitCount ?? 1;
  const occupancyRate =
    totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : "0";

  // Take the 3 most recent cases for the maintenance timeline
  const recentCases = cases.slice(0, 3);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="pt-8 px-8">
        <div className="relative h-96 rounded-xl overflow-hidden group">
          <div className="w-full h-full bg-gradient-to-br from-cyan-800 to-cyan-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#006872]/20 backdrop-blur-md text-[#92f1fe] border border-[#006872]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {formatEnum(property.type)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white font-headline leading-tight">
                {property.address}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-slate-200">
                <span className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-sm"
                  >
                    location_on
                  </span>{" "}
                  {property.address}
                </span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span>{formatEnum(property.type)}</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span>{totalUnits} {totalUnits === 1 ? "Unit" : "Units"}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/properties/${property.id}/edit`}
                className="px-6 py-3 bg-white text-cyan-900 rounded-lg font-bold shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">edit</span>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Overview Cards */}
      <section className="px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border-none flex flex-col justify-between h-48 group hover:bg-[#006872] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-white/20">
              <span
                className="material-symbols-outlined text-[#006872] group-hover:text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                engineering
              </span>
            </div>
            {activeCases.length > 0 && (
              <span className="text-[#ba1a1a] font-bold flex items-center gap-1 text-sm bg-[#ffdad6] px-2 py-1 rounded group-hover:bg-white group-hover:text-[#ba1a1a]">
                <span className="material-symbols-outlined text-xs">trending_up</span>{" "}
                {activeCases.length}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-slate-500 font-medium text-sm group-hover:text-white/80">
              Active Cases
            </h4>
            <p className="text-3xl font-black text-[#0d1c2e] group-hover:text-white mt-1">
              {activeCases.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border-none flex flex-col justify-between h-48 group hover:bg-[#006872] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-white/20">
              <span
                className="material-symbols-outlined text-[#006872] group-hover:text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                apartment
              </span>
            </div>
            <span className="text-[#006872] font-bold flex items-center gap-1 text-sm bg-[#c5e9ee] px-2 py-1 rounded group-hover:bg-white group-hover:text-[#006872]">
              {Number(occupancyRate) >= 90 ? "STABLE" : "LOW"}
            </span>
          </div>
          <div>
            <h4 className="text-slate-500 font-medium text-sm group-hover:text-white/80">
              Occupancy Rate
            </h4>
            <p className="text-3xl font-black text-[#0d1c2e] group-hover:text-white mt-1">
              {occupancyRate}%
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border-none flex flex-col justify-between h-48 group hover:bg-[#006872] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-white/20">
              <span
                className="material-symbols-outlined text-[#006872] group-hover:text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                group
              </span>
            </div>
            <span className="text-[#006872] font-bold flex items-center gap-1 text-sm bg-[#c5e9ee] px-2 py-1 rounded group-hover:bg-white group-hover:text-[#006872]">
              {tenants.length}
            </span>
          </div>
          <div>
            <h4 className="text-slate-500 font-medium text-sm group-hover:text-white/80">
              Total Tenants
            </h4>
            <p className="text-3xl font-black text-[#0d1c2e] group-hover:text-white mt-1">
              {tenants.length}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="px-8 mt-12 space-y-12">
        {/* Maintenance Highlight */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold font-headline">Maintenance Highlight</h3>
            <div className="flex gap-2">
              <Link
                href={`/cases?propertyId=${property.id}`}
                className="px-4 py-2 bg-[#006872] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                View All Cases
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 border-none shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Recent Activity
                </h4>
                {recentCases.length > 0 ? (
                  <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {recentCases.map((c) => (
                      <div key={c.id} className="relative">
                        <span
                          className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 ring-4 ${getCaseUrgencyColor(c.urgency)}`}
                        ></span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {timeAgo(c.createdAt)}
                        </p>
                        <h4 className="text-lg font-bold mt-1 text-[#0d1c2e]">
                          {c.category ? formatEnum(c.category) : "Case"} - {formatEnum(c.status)}
                        </h4>
                        <p className="text-sm text-slate-500 mt-2">
                          {c.rawMessage.length > 120
                            ? c.rawMessage.slice(0, 120) + "..."
                            : c.rawMessage}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${getCaseStatusColor(c.status)}`}
                          >
                            {formatEnum(c.status)}
                          </span>
                          {c.urgency && (
                            <span
                              className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${getCaseUrgencyBadge(c.urgency)}`}
                            >
                              {formatEnum(c.urgency)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No recent cases.</p>
                )}
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Property Health
                </h4>
                <div className="bg-[#eff4ff]/50 p-6 rounded-xl border border-[#bdc9ca]/30">
                  <p className="text-sm font-semibold text-slate-600">Active Cases</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-3xl font-black text-[#0d1c2e]">
                      {activeCases.length}
                    </span>
                    <span className="text-[#006872] font-bold text-xs mb-1">
                      {activeCases.length === 0 ? "All clear" : "Needs attention"}
                    </span>
                  </div>
                </div>
                <div className="bg-[#eff4ff]/50 p-6 rounded-xl border border-[#bdc9ca]/30">
                  <p className="text-sm font-semibold text-slate-600">Total Cases</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-3xl font-black text-[#0d1c2e]">{cases.length}</span>
                    <span className="text-slate-400 font-bold text-xs mb-1">All time</span>
                  </div>
                </div>
                <Link
                  href={`/cases?propertyId=${property.id}`}
                  className="block w-full py-4 bg-[#dce9ff] text-[#006872] font-bold rounded-xl hover:bg-[#006872] hover:text-white transition-all text-sm uppercase tracking-wider text-center"
                >
                  View Full Analytics
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Unit Breakdown */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-headline">Unit Breakdown</h3>
            <Link
              href={`/tenants?propertyId=${property.id}`}
              className="text-[#006872] font-bold text-sm hover:underline"
            >
              View All {totalUnits} {totalUnits === 1 ? "Unit" : "Units"}
            </Link>
          </div>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-6 px-6 py-4 bg-[#eff4ff] text-[10px] font-black uppercase tracking-wider text-slate-500">
              <div className="col-span-1">Unit</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2">Resident</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Lease End</div>
            </div>
            <div className="divide-y divide-slate-100">
              {tenants.length > 0 ? (
                tenants.map((tenant) => {
                  const isExpiring =
                    tenant.leaseEnd &&
                    new Date(tenant.leaseEnd).getTime() - Date.now() <
                      90 * 24 * 60 * 60 * 1000;
                  return (
                    <div
                      key={tenant.id}
                      className="grid grid-cols-6 px-6 py-4 items-center hover:bg-[#eff4ff] transition-colors group cursor-pointer"
                    >
                      <div className="col-span-1 font-bold text-cyan-800">
                        {tenant.unitNumber || "N/A"}
                      </div>
                      <div className="col-span-1 text-sm text-slate-600">
                        {formatEnum(property.type)}
                      </div>
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#006872] font-bold text-[10px]">
                          {getInitials(tenant.name)}
                        </div>
                        <span className="text-sm font-semibold">{tenant.name}</span>
                      </div>
                      <div className="col-span-1">
                        {isExpiring ? (
                          <span className="bg-[#ffdcc5] text-[#703801] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            Expiring
                          </span>
                        ) : (
                          <span className="bg-[#c5e9ee] text-[#486a6f] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="col-span-1 text-right font-bold">
                        {tenant.leaseEnd
                          ? new Date(tenant.leaseEnd).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center text-slate-400 text-sm">
                  No tenants assigned to this property yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Collapsible Building Documents Section */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setDocumentsOpen(!documentsOpen)}
            className="w-full flex items-center justify-between p-6 cursor-pointer select-none hover:bg-[#eff4ff] transition-colors text-left"
          >
            <h3 className="text-xl font-bold font-headline">Building Documents</h3>
            <span
              className={`material-symbols-outlined transition-transform duration-300 ${
                documentsOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: documentsOpen ? "1000px" : "0px",
              paddingBottom: documentsOpen ? "1.5rem" : "0",
            }}
          >
            <div className="px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {property.accessInstructions && (
                  <div className="flex items-center justify-between p-4 bg-[#eff4ff]/50 rounded-xl group hover:bg-cyan-50 cursor-pointer transition-all border border-transparent hover:border-cyan-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#006872] shadow-sm">
                        <span className="material-symbols-outlined">key</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Access Instructions</p>
                        <p className="text-[10px] text-slate-400 uppercase">Property Access</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#006872]">
                      info
                    </span>
                  </div>
                )}
                {property.parkingInstructions && (
                  <div className="flex items-center justify-between p-4 bg-[#eff4ff]/50 rounded-xl group hover:bg-cyan-50 cursor-pointer transition-all border border-transparent hover:border-cyan-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#006872] shadow-sm">
                        <span className="material-symbols-outlined">local_parking</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Parking Instructions</p>
                        <p className="text-[10px] text-slate-400 uppercase">Vendor Parking</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#006872]">
                      info
                    </span>
                  </div>
                )}
                {property.specialInstructions && (
                  <div className="flex items-center justify-between p-4 bg-[#eff4ff]/50 rounded-xl group hover:bg-cyan-50 cursor-pointer transition-all border border-transparent hover:border-cyan-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#006872] shadow-sm">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Special Instructions</p>
                        <p className="text-[10px] text-slate-400 uppercase">Property Notes</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#006872]">
                      info
                    </span>
                  </div>
                )}
                {!property.accessInstructions &&
                  !property.parkingInstructions &&
                  !property.specialInstructions && (
                    <div className="col-span-full text-center text-slate-400 text-sm py-4">
                      No documents or instructions added yet.
                    </div>
                  )}
              </div>
              {property.notes && (
                <div className="mt-4 p-4 bg-[#eff4ff]/50 rounded-xl border border-[#bdc9ca]/30">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Notes
                  </p>
                  <p className="text-sm text-slate-600">{property.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
