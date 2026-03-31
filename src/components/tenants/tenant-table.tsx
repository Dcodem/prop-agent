"use client";

import Link from "next/link";

type Tenant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  propertyId: string;
  unitNumber: string | null;
  leaseStart: Date | null;
  leaseEnd: Date | null;
};

type Property = {
  id: string;
  address: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const INITIAL_COLORS = [
  "bg-cyan-100 text-cyan-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

function getLeaseStatusClasses(leaseEnd: Date | null) {
  if (!leaseEnd) {
    return "bg-surface-container-low text-outline border-outline-variant/30";
  }
  const now = new Date();
  const daysUntilEnd = Math.ceil(
    (leaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntilEnd < 0) {
    return "bg-error-container text-error border-error/20";
  }
  if (daysUntilEnd <= 30) {
    return "bg-orange-50 text-orange-700 border-orange-100";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-100";
}

function formatDate(date: Date | null) {
  if (!date) return "No lease";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TenantTable({
  tenants,
  properties,
  onEdit,
}: {
  tenants: Tenant[];
  properties: Property[];
  onEdit?: (tenant: Tenant) => void;
}) {
  const propertyMap = new Map(properties.map((p) => [p.id, p.address]));

  return (
    <div className="bg-surface-container-lowest rounded border border-outline-variant/20 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary-fixed border-b border-outline-variant/20">
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Name
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Contact
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Property
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Unit
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Lease End
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {tenants.map((tenant, index) => {
              const colorClass =
                INITIAL_COLORS[index % INITIAL_COLORS.length];
              return (
                <tr
                  key={tenant.id}
                  className="group hover:bg-primary-fixed transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <Link
                      href={`/tenants/${tenant.id}`}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${colorClass}`}
                      >
                        {getInitials(tenant.name)}
                      </div>
                      <span className="text-sm font-bold text-on-surface tracking-tight">
                        {tenant.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-on-surface-variant font-medium">
                        {tenant.email || "--"}
                      </span>
                      <span className="text-[11px] text-outline">
                        {tenant.phone || "--"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] text-on-surface-variant">
                      {propertyMap.get(tenant.propertyId) || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-on-surface">
                      {tenant.unitNumber || "--"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getLeaseStatusClasses(tenant.leaseEnd)}`}
                    >
                      {formatDate(tenant.leaseEnd)}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className="text-outline hover:text-primary p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(tenant);
                      }}
                    >
                      <span className="material-symbols-outlined text-xl">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
            {tenants.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-outline text-sm"
                >
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination footer */}
      <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-primary-fixed/30">
        <span className="text-[12px] font-medium text-on-surface-variant">
          Showing {tenants.length} tenant{tenants.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
