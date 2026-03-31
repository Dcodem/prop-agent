"use client";

import { useState, useMemo } from "react";
import { TenantSearch } from "@/components/tenants/tenant-search";
import { TenantTable } from "@/components/tenants/tenant-table";
import { TenantForm } from "@/components/tenants/tenant-form";

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

export function TenantsPageClient({
  tenants,
  properties,
}: {
  tenants: Tenant[];
  properties: Property[];
}) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return tenants;
    const q = search.toLowerCase();
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.unitNumber && t.unitNumber.toLowerCase().includes(q)) ||
        (t.phone && t.phone.includes(q))
    );
  }, [tenants, search]);

  // Compute stats
  const totalTenants = tenants.length;
  const expiringSoon = tenants.filter((t) => {
    if (!t.leaseEnd) return false;
    const days = Math.ceil(
      (t.leaseEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 && days <= 30;
  }).length;
  const activeCases = 0; // Placeholder -- would need case data

  return (
    <div className="pt-8 pb-12 px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-cyan-900 tracking-tighter">
            Tenants
          </h2>
          <p className="text-slate-500 text-[15px] mt-1 font-medium">
            Your architectural ledger of occupants
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTenant(null);
            setShowForm(true);
          }}
          className="bg-[#00838F] hover:bg-[#006d78] text-white font-bold py-2.5 px-6 rounded flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">
            person_add
          </span>
          <span className="text-sm">+ Add Tenant</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Total Tenants
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-900 tracking-tighter">
              {totalTenants}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Expiring Soon
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-orange-600 tracking-tighter">
              {expiringSoon}
            </span>
            <span className="text-[11px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
              30 days
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Occupancy
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-cyan-900 tracking-tighter">
              {totalTenants > 0 ? "100%" : "0%"}
            </span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600"
                style={{ width: totalTenants > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Active Cases
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-900 tracking-tighter">
              {activeCases}
            </span>
            <span className="text-[11px] text-cyan-600 font-bold bg-cyan-50 px-2 py-0.5 rounded">
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <TenantSearch value={search} onChange={setSearch} />
      </div>

      {/* Table */}
      <TenantTable
        tenants={filtered}
        properties={properties}
        onEdit={(tenant) => {
          setEditingTenant(tenant);
          setShowForm(true);
        }}
      />

      {/* Add/Edit Modal */}
      {showForm && (
        <TenantForm
          properties={properties}
          tenant={editingTenant}
          onClose={() => {
            setShowForm(false);
            setEditingTenant(null);
          }}
        />
      )}
    </div>
  );
}
