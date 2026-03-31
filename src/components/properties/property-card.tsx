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
      className="group bg-white rounded-[2rem] overflow-hidden border border-[#bdc9ca]/10 hover:border-[#006872]/30 transition-all duration-300"
    >
      {/* Gradient placeholder for property image */}
      <div className="h-64 overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-br from-[#c5e9ee] via-[#eff4ff] to-[#006872]/20 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 right-4">
          {activeCases > 0 ? (
            <span className="px-4 py-1.5 rounded-full bg-[#c5e9ee] text-[#486a6f] text-xs font-bold uppercase tracking-tighter">
              {activeCases} Active {activeCases === 1 ? "Case" : "Cases"}
            </span>
          ) : (
            <span className="px-4 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-tighter">
              No Issues
            </span>
          )}
        </div>
      </div>
      <div className="p-8 text-left space-y-4">
        <div>
          <h4 className="text-xl font-extrabold text-cyan-950">
            {property.address}
          </h4>
          <div className="flex items-center gap-1 text-slate-500 mt-1">
            <span className="material-symbols-outlined text-sm">
              location_on
            </span>
            <span className="text-sm capitalize">{property.type}</span>
          </div>
        </div>
        <div className="flex justify-between items-end pt-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Inventory
            </p>
            <p className="text-lg font-bold text-cyan-800">
              {String(property.unitCount ?? 1).padStart(2, "0")}{" "}
              {(property.unitCount ?? 1) === 1 ? "Unit" : "Units"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Cases
            </p>
            <p className="text-lg font-bold text-[#006872]">{activeCases}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
