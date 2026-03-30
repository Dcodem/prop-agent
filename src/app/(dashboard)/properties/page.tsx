import { getOrgId } from "@/lib/db/queries/helpers";
import { listProperties } from "@/lib/db/queries/properties";
import { countActiveCasesByProperty } from "@/lib/db/queries/cases";
import { PropertyCard } from "@/components/properties/property-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Building2 } from "lucide-react";
import { AddPropertyButton } from "@/components/properties/add-property-button";

export default async function PropertiesPage() {
  const orgId = await getOrgId();

  const [properties, activeCasesMap] = await Promise.all([
    listProperties(orgId),
    countActiveCasesByProperty(orgId).catch(() => new Map<string, number>()),
  ]);

  const totalActiveCases = Array.from(activeCasesMap.values()).reduce((sum, c) => sum + c, 0);
  const totalUnits = properties.reduce((sum, p) => sum + (p.unitCount ?? 1), 0);

  return (
    <div className="ml-0 pt-8 pb-12 px-12 min-h-screen">
      {/* Header Section */}
      <header className="mb-12 flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0d1c2e] mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Portfolio Overview</h1>
          <p className="text-[#3e494a] leading-relaxed">Managing {properties.length} residential and commercial assets in your portfolio.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-lg bg-[#eff4ff] text-[#006872] font-semibold hover:bg-[#e6eeff] transition-colors border border-[#bdc9ca]/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">filter_list</span>
            <span>Filter</span>
          </button>
          <AddPropertyButton />
        </div>
      </header>

      {/* High-Level Metrics */}
      <section className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
        <div className="bg-white border border-[#bdc9ca]/10 flex flex-col items-start gap-4 transition-all hover:shadow-md rounded-xl p-10">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined">gavel</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2a4c50] uppercase tracking-widest mb-1">Open Cases</p>
            <h2 className="text-3xl font-extrabold text-cyan-950" style={{ fontFamily: "'Manrope', sans-serif" }}>{totalActiveCases}</h2>
            {totalActiveCases > 0 && <p className="text-xs text-[#ba1a1a] font-medium mt-1">Requires attention</p>}
          </div>
        </div>
        <div className="bg-white border border-[#bdc9ca]/10 flex flex-col items-start gap-4 transition-all hover:shadow-md rounded-xl p-10">
          <div className="w-12 h-12 rounded-full bg-[#c5e9ee] flex items-center justify-center text-[#006872]">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2a4c50] uppercase tracking-widest mb-1">Total Properties</p>
            <h2 className="text-3xl font-extrabold text-cyan-950" style={{ fontFamily: "'Manrope', sans-serif" }}>{properties.length}</h2>
          </div>
        </div>
        <div className="bg-white border border-[#bdc9ca]/10 flex flex-col items-start gap-4 transition-all hover:shadow-md rounded-xl p-10">
          <div className="w-12 h-12 rounded-full bg-[#ffdcc5] flex items-center justify-center text-[#8c4e19]">
            <span className="material-symbols-outlined">apartment</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2a4c50] uppercase tracking-widest mb-1">Total Units</p>
            <h2 className="text-3xl font-extrabold text-cyan-950" style={{ fontFamily: "'Manrope', sans-serif" }}>{totalUnits}</h2>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <h3 className="text-2xl font-bold mb-8 text-cyan-950" style={{ fontFamily: "'Manrope', sans-serif" }}>Active Properties</h3>

      {properties.length === 0 ? (
        <EmptyState icon={Building2} title="No properties yet" description="Add your first property to start managing it." />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              activeCaseCount={activeCasesMap.get(property.id) ?? 0}
            />
          ))}
          {/* Add Property Card */}
          <div className="group bg-[#eff4ff]/50 rounded-lg overflow-hidden border-2 border-dashed border-[#bdc9ca]/30 hover:border-[#006872]/50 transition-all flex flex-col items-center justify-center p-12 text-center cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#00838f] shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">add_home</span>
            </div>
            <h4 className="text-xl font-extrabold text-cyan-950 mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Expand Portfolio</h4>
            <p className="text-sm text-[#3e494a] max-w-[180px]">Add a new commercial or residential asset to your ledger.</p>
          </div>
        </section>
      )}
    </div>
  );
}
