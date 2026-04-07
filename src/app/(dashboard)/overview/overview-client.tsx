"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatEnum, timeAgo, generateCaseSummary } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { WelcomeBanner } from "@/components/welcome-banner";
import type { Case, Property, Tenant } from "@/lib/db/schema";

interface OverviewClientProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
  hasVendors?: boolean;
}

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-error",
  high: "bg-caution",
  medium: "bg-warning-dim",
  low: "bg-success-dim",
};

// Mock: same late tenant indices as tenant-table
const LATE_TENANT_INDICES = new Set([2, 5, 8, 11]);

export function OverviewClient({ cases, properties, tenants, hasVendors = false }: OverviewClientProps) {
  const router = useRouter();
  const propertyMap = new Map(properties.map((p) => [p.id, p.address]));

  const openCases = useMemo(
    () => cases.filter((c) => !["resolved", "closed"].includes(c.status)),
    [cases]
  );

  const expiringLeases = useMemo(() => {
    const now = Date.now();
    return tenants
      .filter((t) => {
        if (!t.leaseEnd) return false;
        const days = Math.ceil((t.leaseEnd.getTime() - now) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 90;
      })
      .map((t) => ({
        ...t,
        daysLeft: Math.ceil((t.leaseEnd!.getTime() - now) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [tenants]);

  const sortedTenants = useMemo(
    () => [...tenants].sort((a, b) => a.name.localeCompare(b.name)),
    [tenants]
  );

  const lateOnRent = useMemo(
    () => sortedTenants.filter((_, i) => LATE_TENANT_INDICES.has(i)),
    [sortedTenants]
  );

  const [casesOpen, setCasesOpen] = useState(openCases.length > 0);
  const [leasesOpen, setLeasesOpen] = useState(expiringLeases.length > 0);
  const [lateRentOpen, setLateRentOpen] = useState(lateOnRent.length > 0);

  function getLeaseUrgencyColor(days: number) {
    if (days <= 30) return { bg: "bg-error/10", text: "text-error", dot: "bg-error", label: "Critical" };
    if (days <= 60) return { bg: "bg-caution/10", text: "text-caution", dot: "bg-caution", label: "Soon" };
    return { bg: "bg-warning/10", text: "text-warning-dim", dot: "bg-warning", label: "Upcoming" };
  }

  const totalActions = openCases.length + expiringLeases.length + lateOnRent.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface">Dashboard</h1>
        <p className="text-on-surface-variant text-[15px] mt-1 font-medium">
          Action items across your portfolio
        </p>
      </div>

      {/* Onboarding */}
      <WelcomeBanner
        hasProperties={properties.length > 0}
        hasCases={cases.length > 0}
        hasVendors={hasVendors}
      />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="priority_high" iconBg="bg-error/10" iconColor="text-error" value={totalActions} label="Action Items" />
        <StatCard icon="assignment" iconBg="bg-info-container" iconColor="text-info" href="/cases" value={openCases.length} label="Open Cases" />
        <StatCard icon="event_upcoming" iconBg="bg-caution-container" iconColor="text-caution" value={expiringLeases.length} label="Lease Follow-ups" />
        <StatCard icon="payments" iconBg="bg-error/10" iconColor="text-error" value={lateOnRent.length} label="Late on Rent" />
      </div>

      {/* Open Cases Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 border-l-4 border-l-info card-shadow overflow-hidden">
        <button
          onClick={() => setCasesOpen(!casesOpen)}
          aria-expanded={casesOpen}
          className="w-full px-6 py-4 flex items-center justify-between cursor-pointer select-none hover:bg-surface-container-low/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-info">assignment</span>
            <h2 className="text-lg font-bold text-on-surface">Open Cases</h2>
            <span className="bg-surface-container-high text-on-surface-variant text-[11px] font-bold px-2 py-0.5 rounded-full">{openCases.length}</span>
            {openCases.length === 0 && !casesOpen && (
              <span className="text-sm text-on-surface-variant">— All clear</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/cases" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold text-accent hover:underline underline-offset-4 decoration-2">
              View all cases
            </Link>
            <span
              className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                casesOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </div>
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: casesOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
          {openCases.length === 0 ? (
            <div className="px-6 py-6 text-center border-t border-outline-variant/10 text-on-surface-variant text-sm">No open cases. All clear.</div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/30 border-t border-t-outline-variant/10">
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-32">Urgency</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-44">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-24">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {openCases.slice(0, 3).map((c) => (
                    <tr key={c.id} onClick={() => router.push(`/cases/${c.id}`)} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`} />
                          <span className="text-sm font-medium text-on-surface">{formatEnum(c.urgency ?? "low")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-on-surface font-semibold">
                          {generateCaseSummary(c.rawMessage, c.category)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {propertyMap.get(c.propertyId ?? "") ?? "\u2014"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{formatEnum(c.status)}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-outline">{timeAgo(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {openCases.length > 3 && (
                <div className="px-6 py-3 border-t border-outline-variant/10 text-center">
                  <Link href="/cases" className="text-sm font-semibold text-accent hover:underline underline-offset-4 decoration-2">
                    +{openCases.length - 3} more open cases
                  </Link>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </section>

      {/* Lease Follow-ups Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 border-l-4 border-l-caution overflow-hidden">
        <button
          onClick={() => setLeasesOpen(!leasesOpen)}
          aria-expanded={leasesOpen}
          className="w-full px-6 py-4 flex items-center justify-between cursor-pointer select-none hover:bg-surface-container-low/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-caution">event_upcoming</span>
            <h2 className="text-lg font-bold text-on-surface">Lease Renewals</h2>
            <span className="bg-surface-container-high text-on-surface-variant text-[11px] font-bold px-2 py-0.5 rounded-full">{expiringLeases.length}</span>
            {expiringLeases.length === 0 && !leasesOpen && (
              <span className="text-sm text-on-surface-variant">— All on track</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/tenants" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold text-accent hover:underline underline-offset-4 decoration-2">
              View all tenants
            </Link>
            <span
              className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                leasesOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </div>
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: leasesOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
          {expiringLeases.length === 0 ? (
            <div className="px-6 py-6 text-center border-t border-outline-variant/10">
              <span className="material-symbols-outlined text-2xl text-success mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-on-surface-variant text-sm font-medium">No leases expiring soon — all renewals are on track.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-outline-variant/10 border-t border-outline-variant/10">
                {expiringLeases.slice(0, 3).map((t) => {
                  const colors = getLeaseUrgencyColor(t.daysLeft);
                  return (
                    <Link key={t.id} href={`/tenants/${t.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/50 transition-all duration-200">
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                        <span className={`material-symbols-outlined ${colors.text} text-lg`}>calendar_today</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface">{t.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">
                          {propertyMap.get(t.propertyId) ?? "Unknown"} — Unit {t.unitNumber ?? "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${colors.bg} ${colors.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {t.daysLeft}d left
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          Expires {t.leaseEnd!.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {expiringLeases.length > 3 && (
                <div className="px-6 py-3 border-t border-outline-variant/10 text-center">
                  <Link href="/tenants" className="text-sm font-semibold text-accent hover:underline underline-offset-4 decoration-2">
                    +{expiringLeases.length - 3} more lease renewals
                  </Link>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </section>

      {/* Late on Rent Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 border-l-4 border-l-error overflow-hidden">
        <button
          onClick={() => setLateRentOpen(!lateRentOpen)}
          aria-expanded={lateRentOpen}
          className="w-full px-6 py-4 flex items-center justify-between cursor-pointer select-none hover:bg-surface-container-low/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error">payments</span>
            <h2 className="text-lg font-bold text-on-surface">Late on Rent</h2>
            <span className="bg-surface-container-high text-on-surface-variant text-[11px] font-bold px-2 py-0.5 rounded-full">{lateOnRent.length}</span>
            {lateOnRent.length === 0 && !lateRentOpen && (
              <span className="text-sm text-on-surface-variant">— All current</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/tenants" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold text-accent hover:underline underline-offset-4 decoration-2">
              View all tenants
            </Link>
            <span
              className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                lateRentOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </div>
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: lateRentOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
          {lateOnRent.length === 0 ? (
            <div className="px-6 py-6 text-center border-t border-outline-variant/10">
              <span className="material-symbols-outlined text-2xl text-success mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-on-surface-variant text-sm font-medium">All tenants are current on rent — nothing to follow up on.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-outline-variant/10 border-t border-outline-variant/10">
                {lateOnRent.slice(0, 3).map((t) => (
                  <Link key={t.id} href={`/tenants/${t.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-warning-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-warning-dim text-lg">warning</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface">{t.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {propertyMap.get(t.propertyId) ?? "Unknown"} — Unit {t.unitNumber ?? "N/A"}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-error/10 text-error border border-error/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Late
                    </span>
                  </Link>
                ))}
              </div>
              {lateOnRent.length > 3 && (
                <div className="px-6 py-3 border-t border-outline-variant/10 text-center">
                  <Link href="/tenants" className="text-sm font-semibold text-accent hover:underline underline-offset-4 decoration-2">
                    +{lateOnRent.length - 3} more late tenants
                  </Link>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </section>

      {/* AI Status Bar */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-bold text-on-surface">PropAgent Active</span>
          <span className="text-xs text-on-surface-variant">Monitoring {properties.length} {properties.length === 1 ? "property" : "properties"}</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="material-symbols-outlined text-sm text-accent">bolt</span>
            <span className="font-bold text-on-surface">{cases.length.toLocaleString()}</span> cases handled
          </div>
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="material-symbols-outlined text-sm text-success">speed</span>
            <span className="font-bold text-on-surface">94.8%</span> confidence
          </div>
          <Link href="/settings" className="text-accent font-bold hover:underline underline-offset-4 decoration-2">
            Configure AI
          </Link>
        </div>
      </section>
    </div>
  );
}
