"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEnum } from "@/lib/utils";
import type { Property, Tenant, Case } from "@/lib/db/schema";

interface PropertyDetailClientProps {
  property: Property;
  tenants: Tenant[];
  activeCases: Case[];
  allCases: Case[];
}

export function PropertyDetailClient({
  property,
  tenants,
  activeCases,
  allCases,
}: PropertyDetailClientProps) {
  const [documentsOpen, setDocumentsOpen] = useState(false);

  const occupancyRate = property.unitCount
    ? Math.round((tenants.length / property.unitCount) * 100 * 10) / 10
    : tenants.length > 0
      ? 100
      : 0;

  const formattedRevenue = "$XX,XXX";

  return (
    <div className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-sm text-[#3e494a] mb-4 font-medium uppercase tracking-wider">
          <span className="material-symbols-outlined text-base">home</span>
          <Link href="/properties" className="hover:text-[#006872] cursor-pointer transition-colors">Properties</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-[#006872] font-bold">Property Detail</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="h-96 rounded-xl overflow-hidden relative bg-gradient-to-br from-cyan-800 to-cyan-600 mb-14">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="bg-[#006872]/20 backdrop-blur-md text-[#92f1fe] border border-[#006872]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                Premium Asset
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-3" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {property.address}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  <span>{property.address}</span>
                </div>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>{formatEnum(property.type)}</span>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>{property.unitCount ?? 1} {(property.unitCount ?? 1) === 1 ? "Unit" : "Units"}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white text-[#0d1c2e] rounded-lg font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit Profile
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all">
                <span className="material-symbols-outlined text-lg">share</span>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Overview - 3 col grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {/* Active Work Orders */}
        <div className="bg-white p-8 rounded-[1rem] flex flex-col justify-between h-48 group hover:bg-[#006872] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-white/20">
              <span className="material-symbols-outlined text-[#006872] group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>engineering</span>
            </div>
            <span className="text-[#ba1a1a] font-bold flex items-center gap-1 text-sm bg-[#ffdad6] px-2 py-1 rounded group-hover:bg-white group-hover:text-[#ba1a1a]">
              <span className="material-symbols-outlined text-xs">trending_up</span> 12%
            </span>
          </div>
          <div>
            <h4 className="text-slate-500 font-medium text-sm group-hover:text-white/80">Active Work Orders</h4>
            <p className="text-3xl font-black text-[#0d1c2e] group-hover:text-white mt-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {activeCases.length}
            </p>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-8 rounded-[1rem] flex flex-col justify-between h-48 group hover:bg-[#006872] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-white/20">
              <span className="material-symbols-outlined text-[#006872] group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
            </div>
            <span className="text-[#006872] font-bold text-sm bg-[#c5e9ee] px-2 py-1 rounded group-hover:bg-white group-hover:text-[#006872]">
              STABLE
            </span>
          </div>
          <div>
            <h4 className="text-slate-500 font-medium text-sm group-hover:text-white/80">Occupancy Rate</h4>
            <p className="text-3xl font-black text-[#0d1c2e] group-hover:text-white mt-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {occupancyRate}%
            </p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-8 rounded-[1rem] flex flex-col justify-between h-48 group hover:bg-[#006872] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-white/20">
              <span className="material-symbols-outlined text-[#006872] group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <span className="text-[#006872] font-bold text-sm bg-[#c5e9ee] px-2 py-1 rounded group-hover:bg-white group-hover:text-[#006872]">
              +4.2%
            </span>
          </div>
          <div>
            <h4 className="text-slate-500 font-medium text-sm group-hover:text-white/80">Monthly Revenue</h4>
            <p className="text-3xl font-black text-[#0d1c2e] group-hover:text-white mt-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {formattedRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Highlight */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Maintenance Highlight</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#006872] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Log Entry
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Timeline */}
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Activity</h4>
              {activeCases.length === 0 ? (
                <p className="text-sm text-[#3e494a] py-4">No recent maintenance activity.</p>
              ) : (
                <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {activeCases.slice(0, 5).map((c, i) => {
                    const dotColorClasses = [
                      "bg-[#006872] ring-4 ring-[#006872]/10",
                      "bg-[#8c4e19] ring-4 ring-[#8c4e19]/10",
                      "bg-[#ba1a1a] ring-4 ring-[#ba1a1a]/10",
                      "bg-[#006872] ring-4 ring-[#006872]/10",
                      "bg-[#8c4e19] ring-4 ring-[#8c4e19]/10",
                    ];
                    const dotColor = dotColorClasses[i % dotColorClasses.length];

                    const statusBadgeClass =
                      c.status === "open" || c.status === "in_progress"
                        ? "bg-[#eff4ff] text-[#006872]"
                        : c.status === "waiting_on_vendor" || c.status === "waiting_on_tenant"
                          ? "bg-[#c5e9ee] text-[#486a6f]"
                          : c.status === "resolved" || c.status === "closed"
                            ? "bg-[#c5e9ee] text-[#486a6f]"
                            : "bg-slate-100 text-slate-600";

                    return (
                      <div key={c.id} className="relative">
                        <span className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full ${dotColor} border-4 border-white`}></span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <Link href={`/cases/${c.id}`} className="text-lg font-bold mt-1 text-[#0d1c2e] hover:text-[#006872] transition-colors block">
                          {c.rawMessage.length > 80 ? c.rawMessage.slice(0, 80) + "..." : c.rawMessage}
                        </Link>
                        <div className="mt-4 flex gap-2">
                          <span className={`px-2 py-1 ${statusBadgeClass} text-[10px] font-bold rounded uppercase`}>
                            {formatEnum(c.status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Maintenance Health */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Maintenance Health</h4>
              <div className="bg-[#eff4ff]/50 p-6 rounded-xl border border-[#bdc9ca]/30">
                <p className="text-sm font-semibold text-slate-600">Avg. Response Time</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-black text-[#0d1c2e]">2.4h</span>
                  <span className="text-[#006872] font-bold text-xs mb-1">▼ 15% this week</span>
                </div>
              </div>
              <div className="bg-[#eff4ff]/50 p-6 rounded-xl border border-[#bdc9ca]/30">
                <p className="text-sm font-semibold text-slate-600">Pending Requests</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-black text-[#0d1c2e]">{activeCases.length}</span>
                  <span className="text-slate-400 font-bold text-xs mb-1">All assigned</span>
                </div>
              </div>
              <button className="w-full py-4 bg-[#dce9ff] text-[#006872] font-bold rounded-xl hover:bg-[#006872] hover:text-white transition-all text-sm uppercase tracking-wider">
                View Full Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Breakdown */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Unit Breakdown</h3>
          <button className="text-[#006872] font-bold text-sm hover:underline">View All {tenants.length} Units</button>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {tenants.length === 0 ? (
            <p className="text-sm text-[#3e494a] py-8 text-center">No tenants assigned to this property yet.</p>
          ) : (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-6 px-6 py-4 bg-[#eff4ff] text-[10px] font-black uppercase tracking-wider text-slate-500">
                <div className="col-span-1">Unit</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Resident</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">Rent</div>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-slate-100">
                {tenants.map((tenant) => {
                  const initials = tenant.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  const isActive = tenant.leaseEnd ? new Date(tenant.leaseEnd) > new Date() : true;
                  const isExpiring = tenant.leaseEnd
                    ? new Date(tenant.leaseEnd) > new Date() &&
                      new Date(tenant.leaseEnd).getTime() - Date.now() < 90 * 24 * 60 * 60 * 1000
                    : false;

                  return (
                    <div
                      key={tenant.id}
                      className="grid grid-cols-6 px-6 py-4 items-center hover:bg-[#eff4ff] transition-colors cursor-pointer"
                    >
                      <div className="col-span-1 font-bold text-cyan-800">
                        {tenant.unitNumber ?? "—"}
                      </div>
                      <div className="col-span-1 text-sm text-slate-600">—</div>
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#006872] font-bold text-[10px]">
                          {initials}
                        </div>
                        <span className="text-sm font-semibold">{tenant.name}</span>
                      </div>
                      <div className="col-span-1">
                        {isExpiring ? (
                          <span className="bg-[#ffdcc5] text-[#703801] px-3 py-1 rounded-full text-[10px] font-black uppercase">Expiring</span>
                        ) : isActive ? (
                          <span className="bg-[#c5e9ee] text-[#486a6f] px-3 py-1 rounded-full text-[10px] font-black uppercase">Active</span>
                        ) : (
                          <span className="bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-full text-[10px] font-black uppercase">Expired</span>
                        )}
                      </div>
                      <div className="col-span-1 text-right font-bold">
                        {"—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Building Documents (collapsible) */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setDocumentsOpen(!documentsOpen)}
          className="flex items-center justify-between w-full p-6 hover:bg-[#eff4ff] transition-colors"
        >
          <h3 className="text-xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Building Documents</h3>
          <span className={`material-symbols-outlined text-[#3e494a] transition-transform duration-300 ${documentsOpen ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>

        {documentsOpen && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: "description", name: "Lease Agreements", sub: `${tenants.length} Documents \u00B7 PDF` },
                { icon: "verified_user", name: "Insurance Certs", sub: "Updated Sep 2023" },
                { icon: "architecture", name: "Building Floorplans", sub: "CAD & Vector Assets" },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-4 bg-[#eff4ff]/50 rounded-xl group hover:bg-cyan-50 cursor-pointer transition-all border border-transparent hover:border-cyan-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#006872] shadow-sm">
                      <span className="material-symbols-outlined">{doc.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{doc.sub}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#006872]">download</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-[#006872] hover:text-[#006872] transition-all">
              + Add Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
