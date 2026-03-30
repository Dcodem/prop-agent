"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface TenantWithProperty {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  unitNumber: string | null;
  leaseEnd: Date | null;
  propertyAddress: string;
}

interface TenantTableProps {
  tenants: TenantWithProperty[];
  searchQuery: string;
}

const AVATAR_COLORS = [
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
];

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function getLeaseStatus(leaseEnd: Date | null): { text: string; classes: string } {
  if (!leaseEnd) return { text: "—", classes: "bg-slate-50 text-slate-500 border-slate-100" };
  const now = new Date();
  const end = new Date(leaseEnd);
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (daysLeft < 0) return { text: formatted, classes: "bg-red-50 text-red-700 border-red-100" };
  if (daysLeft < 90) return { text: formatted, classes: "bg-orange-50 text-orange-700 border-orange-100" };
  return { text: formatted, classes: "bg-emerald-50 text-emerald-700 border-emerald-100" };
}

export function TenantTable({ tenants, searchQuery }: TenantTableProps) {
  const filtered = searchQuery
    ? tenants.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          (t.email?.toLowerCase().includes(q) ?? false) ||
          (t.phone?.toLowerCase().includes(q) ?? false)
        );
      })
    : tenants;

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={searchQuery ? "No tenants found" : "No tenants yet"}
        description={searchQuery ? "Try adjusting your search query." : "Add your first tenant to get started."}
      />
    );
  }

  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Property</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Unit</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lease End</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tenant, i) => {
              const colors = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const lease = getLeaseStatus(tenant.leaseEnd);

              return (
                <tr key={tenant.id} className="group hover:bg-cyan-50/30 transition-colors cursor-pointer">
                  <td className="px-6 py-5">
                    <Link href={`/tenants/${tenant.id}`} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded ${colors.bg} flex items-center justify-center ${colors.text} font-bold text-xs`}>
                        {getInitials(tenant.name)}
                      </div>
                      <span className="text-sm font-bold text-slate-800 tracking-tight">{tenant.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-slate-600 font-medium">{tenant.email ?? "—"}</span>
                      <span className="text-[11px] text-slate-400">{tenant.phone ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] text-slate-600">{tenant.propertyAddress}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-slate-800">{tenant.unitNumber ?? "—"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${lease.classes}`}>
                      {lease.text}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-400 hover:text-cyan-600 p-1">
                      <span className="material-symbols-outlined text-xl">more_horiz</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <span className="text-[12px] font-medium text-slate-500">Showing {filtered.length} of {tenants.length} tenants</span>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 text-[12px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Previous</button>
          <button className="px-4 py-1.5 text-[12px] font-bold text-white bg-cyan-700 rounded">1</button>
          <button className="px-4 py-1.5 text-[12px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
