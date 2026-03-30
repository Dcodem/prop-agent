import { Suspense } from "react";
import { getOrgId } from "@/lib/db/queries/helpers";
import { listTenants } from "@/lib/db/queries/tenants";
import { listProperties } from "@/lib/db/queries/properties";
import { TenantSearch } from "@/components/tenants/tenant-search";
import { TenantTable } from "@/components/tenants/tenant-table";
import { TenantsPageClient } from "./page-client";

interface TenantsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function TenantsPage({ searchParams }: TenantsPageProps) {
  const params = await searchParams;
  const orgId = await getOrgId();
  const [tenantList, propertyList] = await Promise.all([
    listTenants(orgId),
    listProperties(orgId),
  ]);

  const propertyMap = new Map(propertyList.map((p) => [p.id, p.address]));

  const tenantsWithProperty = tenantList.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    phone: t.phone,
    propertyId: t.propertyId,
    unitNumber: t.unitNumber,
    leaseStart: t.leaseStart,
    leaseEnd: t.leaseEnd,
    propertyAddress: propertyMap.get(t.propertyId) ?? "Unknown",
  }));

  const searchQuery = params.q ?? "";
  const properties = propertyList.map((p) => ({ id: p.id, address: p.address }));

  return (
    <div className="pt-24 pb-12 px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-cyan-900 tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>Tenants</h2>
          <p className="text-slate-500 text-[15px] mt-1 font-medium">Your architectural ledger of occupants</p>
        </div>
        <TenantsPageClient properties={properties}>
          <span></span>
        </TenantsPageClient>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Tenants</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-900 tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>{tenantsWithProperty.length}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Properties</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-900 tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>{propertyList.length}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Occupancy</span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-cyan-900 tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>—</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-slate-200 flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active Cases</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-900 tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>—</span>
            <span className="text-[11px] text-cyan-600 font-bold bg-cyan-50 px-2 py-0.5 rounded">Pending</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Suspense>
          <TenantSearch defaultValue={searchQuery} />
        </Suspense>
      </div>

      {/* Table */}
      <TenantTable tenants={tenantsWithProperty} searchQuery={searchQuery} />
    </div>
  );
}
