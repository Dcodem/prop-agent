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
      return "bg-primary-fixed text-primary";
    case "waiting_on_vendor":
    case "waiting_on_tenant":
      return "bg-amber-100 text-amber-900";
    case "resolved":
    case "closed":
      return "bg-primary-fixed text-primary";
    default:
      return "bg-primary-fixed text-primary";
  }
}

function getCaseUrgencyColor(urgency: string | null) {
  switch (urgency) {
    case "critical":
      return "bg-error border-white ring-error/10";
    case "high":
      return "bg-amber-600 border-white ring-amber-600/10";
    case "medium":
      return "bg-primary border-white ring-primary/10";
    case "low":
      return "bg-outline border-white ring-outline/10";
    default:
      return "bg-primary border-white ring-primary/10";
  }
}

function getCaseUrgencyBadge(urgency: string | null) {
  switch (urgency) {
    case "critical":
      return "bg-error-container text-on-error-container";
    case "high":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-primary-fixed text-primary";
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
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/20 backdrop-blur-md text-primary-fixed border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {formatEnum(property.type)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white font-headline leading-tight">
                {property.address}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-surface-container">
                <span className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-sm"
                  >
                    location_on
                  </span>{" "}
                  {property.address}
                </span>
                <span className="w-1 h-1 bg-outline rounded-full"></span>
                <span>{formatEnum(property.type)}</span>
                <span className="w-1 h-1 bg-outline rounded-full"></span>
                <span>{totalUnits} {totalUnits === 1 ? "Unit" : "Units"}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/properties/${property.id}/edit`}
                className="px-6 py-3 bg-white text-on-surface rounded-lg font-bold shadow-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors"
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
        <div className="bg-surface-container-lowest p-8 rounded-2xl border-none flex flex-col justify-between h-48 group hover:bg-primary transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary-fixed rounded-lg group-hover:bg-white/20">
              <span
                className="material-symbols-outlined text-primary group-hover:text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                engineering
              </span>
            </div>
            {activeCases.length > 0 && (
              <span className="text-error font-bold flex items-center gap-1 text-sm bg-error-container px-2 py-1 rounded group-hover:bg-white group-hover:text-error">
                <span className="material-symbols-outlined text-xs">trending_up</span>{" "}
                {activeCases.length}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm group-hover:text-white/80">
              Active Cases
            </h4>
            <p className="text-3xl font-black text-on-surface group-hover:text-white mt-1">
              {activeCases.length}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border-none flex flex-col justify-between h-48 group hover:bg-primary transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary-fixed rounded-lg group-hover:bg-white/20">
              <span
                className="material-symbols-outlined text-primary group-hover:text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                apartment
              </span>
            </div>
            <span className="text-primary font-bold flex items-center gap-1 text-sm bg-primary-fixed px-2 py-1 rounded group-hover:bg-white group-hover:text-primary">
              {Number(occupancyRate) >= 90 ? "STABLE" : "LOW"}
            </span>
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm group-hover:text-white/80">
              Occupancy Rate
            </h4>
            <p className="text-3xl font-black text-on-surface group-hover:text-white mt-1">
              {occupancyRate}%
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border-none flex flex-col justify-between h-48 group hover:bg-primary transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary-fixed rounded-lg group-hover:bg-white/20">
              <span
                className="material-symbols-outlined text-primary group-hover:text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                group
              </span>
            </div>
            <span className="text-primary font-bold flex items-center gap-1 text-sm bg-primary-fixed px-2 py-1 rounded group-hover:bg-white group-hover:text-primary">
              {tenants.length}
            </span>
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm group-hover:text-white/80">
              Total Tenants
            </h4>
            <p className="text-3xl font-black text-on-surface group-hover:text-white mt-1">
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
                className="px-4 py-2 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                View All Cases
              </Link>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 border-none shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <h4 className="text-xs font-black uppercase tracking-widest text-outline">
                  Recent Activity
                </h4>
                {recentCases.length > 0 ? (
                  <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-low">
                    {recentCases.map((c) => (
                      <div key={c.id} className="relative">
                        <span
                          className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 ring-4 ${getCaseUrgencyColor(c.urgency)}`}
                        ></span>
                        <p className="text-[10px] font-bold text-outline uppercase">
                          {timeAgo(c.createdAt)}
                        </p>
                        <h4 className="text-lg font-bold mt-1 text-on-surface">
                          {c.category ? formatEnum(c.category) : "Case"} - {formatEnum(c.status)}
                        </h4>
                        <p className="text-sm text-on-surface-variant mt-2">
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
                  <p className="text-sm text-outline">No recent cases.</p>
                )}
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-outline">
                  Property Health
                </h4>
                <div className="bg-primary-fixed/50 p-6 rounded-xl border border-outline-variant/30">
                  <p className="text-sm font-semibold text-on-surface-variant">Active Cases</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-3xl font-black text-on-surface">
                      {activeCases.length}
                    </span>
                    <span className="text-primary font-bold text-xs mb-1">
                      {activeCases.length === 0 ? "All clear" : "Needs attention"}
                    </span>
                  </div>
                </div>
                <div className="bg-primary-fixed/50 p-6 rounded-xl border border-outline-variant/30">
                  <p className="text-sm font-semibold text-on-surface-variant">Total Cases</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-3xl font-black text-on-surface">{cases.length}</span>
                    <span className="text-outline font-bold text-xs mb-1">All time</span>
                  </div>
                </div>
                <Link
                  href={`/cases?propertyId=${property.id}`}
                  className="block w-full py-4 bg-primary-fixed text-primary font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all text-sm uppercase tracking-wider text-center"
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
              className="text-primary font-bold text-sm hover:underline"
            >
              View All {totalUnits} {totalUnits === 1 ? "Unit" : "Units"}
            </Link>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-6 px-6 py-4 bg-primary-fixed text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
              <div className="col-span-1">Unit</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2">Resident</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Lease End</div>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {tenants.length > 0 ? (
                tenants.map((tenant) => {
                  const isExpiring =
                    tenant.leaseEnd &&
                    new Date(tenant.leaseEnd).getTime() - Date.now() <
                      90 * 24 * 60 * 60 * 1000;
                  return (
                    <div
                      key={tenant.id}
                      className="grid grid-cols-6 px-6 py-4 items-center hover:bg-primary-fixed transition-colors group cursor-pointer"
                    >
                      <div className="col-span-1 font-bold text-primary">
                        {tenant.unitNumber || "N/A"}
                      </div>
                      <div className="col-span-1 text-sm text-on-surface-variant">
                        {formatEnum(property.type)}
                      </div>
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[10px]">
                          {getInitials(tenant.name)}
                        </div>
                        <span className="text-sm font-semibold">{tenant.name}</span>
                      </div>
                      <div className="col-span-1">
                        {isExpiring ? (
                          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            Expiring
                          </span>
                        ) : (
                          <span className="bg-primary-fixed text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase">
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
                <div className="px-6 py-8 text-center text-outline text-sm">
                  No tenants assigned to this property yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Collapsible Building Documents Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setDocumentsOpen(!documentsOpen)}
            className="w-full flex items-center justify-between p-6 cursor-pointer select-none hover:bg-primary-fixed transition-colors text-left"
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
                  <div className="flex items-center justify-between p-4 bg-primary-fixed/50 rounded-xl group hover:bg-primary-fixed cursor-pointer transition-all border border-transparent hover:border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">key</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Access Instructions</p>
                        <p className="text-[10px] text-outline uppercase">Property Access</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">
                      info
                    </span>
                  </div>
                )}
                {property.parkingInstructions && (
                  <div className="flex items-center justify-between p-4 bg-primary-fixed/50 rounded-xl group hover:bg-primary-fixed cursor-pointer transition-all border border-transparent hover:border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">local_parking</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Parking Instructions</p>
                        <p className="text-[10px] text-outline uppercase">Vendor Parking</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">
                      info
                    </span>
                  </div>
                )}
                {property.specialInstructions && (
                  <div className="flex items-center justify-between p-4 bg-primary-fixed/50 rounded-xl group hover:bg-primary-fixed cursor-pointer transition-all border border-transparent hover:border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Special Instructions</p>
                        <p className="text-[10px] text-outline uppercase">Property Notes</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">
                      info
                    </span>
                  </div>
                )}
                {!property.accessInstructions &&
                  !property.parkingInstructions &&
                  !property.specialInstructions && (
                    <div className="col-span-full text-center text-outline text-sm py-4">
                      No documents or instructions added yet.
                    </div>
                  )}
              </div>
              {property.notes && (
                <div className="mt-4 p-4 bg-primary-fixed/50 rounded-xl border border-outline-variant/30">
                  <p className="text-xs font-bold text-outline uppercase tracking-widest mb-2">
                    Notes
                  </p>
                  <p className="text-sm text-on-surface-variant">{property.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
