import Link from "next/link";

type Property = {
  id: string;
  address: string;
  unitCount: number | null;
  type: string;
};

export function PropertyCard({
  property,
  activeCases,
}: {
  property: Property;
  activeCases: number;
}) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg transition-all duration-300 card-shadow"
    >
      <div className="h-48 overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-br from-primary-fixed via-surface-container to-primary-fixed-dim/30 group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3">
          {activeCases > 0 ? (
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold uppercase tracking-wider">
              {activeCases} Active {activeCases === 1 ? "Case" : "Cases"}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
              No Issues
            </span>
          )}
        </div>
      </div>
      <div className="p-6 text-left space-y-3">
        <div>
          <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
            {property.address}
          </h4>
          <div className="flex items-center gap-1 text-on-surface-variant mt-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-sm capitalize">{property.type}</span>
          </div>
        </div>
        <div className="flex justify-between items-end pt-2">
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Units
            </p>
            <p className="text-lg font-bold text-on-surface">
              {String(property.unitCount ?? 1).padStart(2, "0")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Cases
            </p>
            <p className="text-lg font-bold text-primary">{activeCases}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
