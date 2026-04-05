"use client";

import { useState, useMemo } from "react";
import { TenantSearch } from "@/components/tenants/tenant-search";
import { TenantTable } from "@/components/tenants/tenant-table";
import { TenantForm } from "@/components/tenants/tenant-form";
import { StatCard } from "@/components/ui/stat-card";

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
  const leasesByWindow = useMemo(() => {
    let d30 = 0, d60 = 0, d90 = 0;
    for (const t of tenants) {
      if (!t.leaseEnd) continue;
      const days = Math.ceil((t.leaseEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (days > 0 && days <= 30) d30++;
      else if (days > 30 && days <= 60) d60++;
      else if (days > 60 && days <= 90) d90++;
    }
    return { d30, d60, d90, total: d30 + d60 + d90 };
  }, [tenants]);
  const activeCases = 0; // Placeholder -- would need case data

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface mb-2">
            Tenants
          </h1>
          <p className="text-on-surface-variant max-w-lg leading-relaxed">
            Manage your occupants, lease terms, and rent collection across all properties.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTenant(null);
            setShowForm(true);
          }}
          className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add Tenant
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="groups" iconBg="bg-info-container" iconColor="text-info" value={totalTenants} label="Total Tenants" />
        <StatCard
          icon="event_upcoming"
          iconBg="bg-caution-container"
          iconColor="text-caution"
          value={leasesByWindow.total}
          label="Leases Expiring"
          badge={
            leasesByWindow.total > 0 ? (
              <div className="flex flex-col gap-0.5">
                {leasesByWindow.d30 > 0 && (
                  <span className="text-[11px] font-bold text-error bg-error/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />{leasesByWindow.d30} within 30d
                  </span>
                )}
                {leasesByWindow.d60 > 0 && (
                  <span className="text-[11px] font-bold text-caution bg-caution/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-caution" />{leasesByWindow.d60} within 60d
                  </span>
                )}
                {leasesByWindow.d90 > 0 && (
                  <span className="text-[11px] font-bold text-warning-dim bg-warning/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />{leasesByWindow.d90} within 90d
                  </span>
                )}
              </div>
            ) : undefined
          }
        />
        <StatCard
          icon="trending_up"
          iconBg="bg-primary-fixed-dim"
          iconColor="text-primary"
          value={totalTenants > 0 ? "100%" : "0%"}
          label="Occupancy"
        />
        <StatCard icon="assignment" iconBg="bg-purple-container" iconColor="text-purple" value={activeCases} label="Active Cases" />
      </div>

      {/* Search */}
      <div className="mb-8">
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
