import { getOrgId } from "@/lib/db/queries/helpers";
import { listProperties } from "@/lib/db/queries/properties";
import { countActiveCasesByProperty } from "@/lib/db/queries/cases";
import { PropertyCard } from "@/components/properties/property-card";
import { AddPropertyButton } from "@/components/properties/add-property-button";

export default async function PropertiesPage() {
  const orgId = await getOrgId();

  const [properties, caseCounts] = await Promise.all([
    listProperties(orgId),
    countActiveCasesByProperty(orgId),
  ]);

  const totalOpenCases = Array.from(caseCounts.values()).reduce(
    (sum, c) => sum + c,
    0
  );

  return (
    <div className="pt-8 pb-12 px-12 min-h-screen">
      {/* Header Section */}
      <header className="mb-12 flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0d1c2e] mb-2">
            Portfolio Overview
          </h1>
          <p className="text-[#3e494a] leading-relaxed">
            Managing {properties.length} propert
            {properties.length === 1 ? "y" : "ies"} across your portfolio.
          </p>
        </div>
      </header>

      {/* High-Level Metrics Bento Grid */}
      <section className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
        {/* Open Cases Card */}
        <div className="bg-white border border-[#bdc9ca]/10 flex flex-col items-start gap-4 transition-all hover:shadow-md rounded-[3rem] p-10">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined">gavel</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2a4c50] uppercase tracking-widest mb-1">
              Open Cases
            </p>
            <h2 className="text-3xl font-extrabold text-cyan-950">
              {String(totalOpenCases).padStart(2, "0")}
            </h2>
            {totalOpenCases > 0 && (
              <p className="text-xs text-[#ba1a1a] font-medium mt-1">
                Requires attention
              </p>
            )}
          </div>
        </div>

        {/* Properties Card */}
        <div className="bg-white border border-[#bdc9ca]/10 flex flex-col items-start gap-4 transition-all hover:shadow-md rounded-[3rem] p-10">
          <div className="w-12 h-12 rounded-full bg-[#c5e9ee] flex items-center justify-center text-[#006872]">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2a4c50] uppercase tracking-widest mb-1">
              Properties
            </p>
            <h2 className="text-3xl font-extrabold text-cyan-950">
              {String(properties.length).padStart(2, "0")}
            </h2>
            <p className="text-xs text-green-600 font-medium mt-1">
              in portfolio
            </p>
          </div>
        </div>

        {/* Total Units Card */}
        <div className="bg-white border border-[#bdc9ca]/10 flex flex-col items-start gap-4 transition-all hover:shadow-md rounded-[3rem] p-10">
          <div className="w-12 h-12 rounded-full bg-[#ffdcc5] flex items-center justify-center text-[#8c4e19]">
            <span className="material-symbols-outlined">apartment</span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2a4c50] uppercase tracking-widest mb-1">
              Total Units
            </p>
            <h2 className="text-3xl font-extrabold text-cyan-950">
              {String(
                properties.reduce((sum, p) => sum + (p.unitCount ?? 1), 0)
              ).padStart(2, "0")}
            </h2>
            <p className="text-xs text-[#8c4e19] font-medium mt-1">
              across all properties
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <h3 className="text-2xl font-bold mb-8 text-cyan-950">
        Active Properties
      </h3>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            activeCases={caseCounts.get(property.id) ?? 0}
          />
        ))}

        {/* Add Property Card */}
        <AddPropertyButton />
      </section>
    </div>
  );
}
