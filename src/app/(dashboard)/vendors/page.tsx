import { Suspense } from "react";
import { getOrgId } from "@/lib/db/queries/helpers";
import { listVendors } from "@/lib/db/queries/vendors";
import { TradeFilter } from "@/components/vendors/trade-filter";
import { VendorTable } from "@/components/vendors/vendor-table";
import { VendorsPageClient } from "./page-client";

interface VendorsPageProps {
  searchParams: Promise<{ trade?: string }>;
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const params = await searchParams;
  const orgId = await getOrgId();
  const vendorList = await listVendors(orgId);

  const currentTrade = params.trade;

  const vendors = vendorList.map((v) => ({
    id: v.id,
    name: v.name,
    trade: v.trade,
    email: v.email,
    phone: v.phone,
    rateNotes: v.rateNotes,
    availabilityNotes: v.availabilityNotes,
    preferenceScore: v.preferenceScore,
  }));

  const tradesCount = new Set(vendors.map(v => v.trade)).size;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div className="text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-[#c5e9ee] text-[#2a4c50] text-xs font-bold mb-3 tracking-wide uppercase">Partnership Network</div>
          <h1 className="text-4xl font-extrabold text-[#0d1c2e] tracking-tight mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Vendors Roster</h1>
          <p className="text-[#3e494a] max-w-lg leading-relaxed">Centralized management for your preferred trade professionals and service providers across all property portfolios.</p>
        </div>
        <VendorsPageClient vendors={vendors}>
          <span></span>
        </VendorsPageClient>
      </div>

      {/* Ledger Table Container */}
      <section className="bg-white rounded-[1rem] border border-[#bdc9ca]/20 overflow-hidden mb-12">
        {/* Table Controls/Filters */}
        <div className="px-8 py-6 border-b border-[#bdc9ca]/10 flex justify-between items-center bg-[#eff4ff]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6e797b]">search</span>
              <input className="bg-white border-0 ring-1 ring-[#bdc9ca]/30 rounded-sm pl-12 pr-4 py-2 w-80 text-sm focus:ring-2 focus:ring-[#006872] transition-all" placeholder="Search by name or trade..." type="text" />
            </div>
            <Suspense>
              <TradeFilter currentTrade={currentTrade} />
            </Suspense>
          </div>
          <div className="text-xs font-bold text-[#6e797b] uppercase tracking-widest">
            Total {vendors.length} Vendors
          </div>
        </div>

        {/* Table */}
        <VendorTable vendors={vendors} currentTrade={currentTrade} />
      </section>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-lg border border-[#bdc9ca]/10 flex flex-col justify-between group hover:border-[#00838f]/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">engineering</span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0d1c2e] mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>{vendors.length}</div>
            <div className="text-sm font-bold text-[#3e494a] uppercase tracking-widest">Active Vendors</div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-8 rounded-lg border border-[#bdc9ca]/10 flex flex-col justify-between group hover:border-[#00838f]/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">verified</span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0d1c2e] mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {vendors.length > 0
                ? (vendors.reduce((a, v) => a + (v.preferenceScore ?? 0), 0) / vendors.length * 5).toFixed(1)
                : "—"}
            </div>
            <div className="text-sm font-bold text-[#3e494a] uppercase tracking-widest">Avg Rating</div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-8 rounded-lg border border-[#bdc9ca]/10 flex flex-col justify-between group hover:border-[#00838f]/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0d1c2e] mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>{tradesCount}</div>
            <div className="text-sm font-bold text-[#3e494a] uppercase tracking-widest">Trades Covered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
