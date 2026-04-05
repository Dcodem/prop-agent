import { getOrgId } from "@/lib/db/queries/helpers";
import { listProperties } from "@/lib/db/queries/properties";
import { countActiveCasesByProperty } from "@/lib/db/queries/cases";
import { PropertyCard } from "@/components/properties/property-card";
import { AddPropertyButton } from "@/components/properties/add-property-button";
import { StatCard } from "@/components/ui/stat-card";

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
    <div>
      {/* Header Section */}
      <header className="mb-10 flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface mb-2">
            Portfolio Overview
          </h1>
          <p className="text-on-surface-variant leading-relaxed">
            Managing {properties.length} propert
            {properties.length === 1 ? "y" : "ies"} across your portfolio.
          </p>
        </div>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 gap-4 mb-12 md:grid-cols-3">
        <StatCard icon="gavel" iconBg="bg-error-container" iconColor="text-error" value={String(totalOpenCases).padStart(2, "0")} label="Open Cases" />
        <StatCard icon="domain" value={String(properties.length).padStart(2, "0")} label="Properties" />
        <StatCard icon="apartment" value={String(properties.reduce((sum, p) => sum + (p.unitCount ?? 1), 0)).padStart(2, "0")} label="Total Units" />
      </section>

      {/* Properties Grid */}
      <h3 className="text-xl font-bold mb-6 text-on-surface">
        Active Properties
      </h3>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            activeCases={caseCounts.get(property.id) ?? 0}
          />
        ))}

        <AddPropertyButton />
      </section>
    </div>
  );
}
