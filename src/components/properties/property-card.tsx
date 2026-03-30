import Link from "next/link";
import type { Property } from "@/lib/db/schema";

interface PropertyCardProps {
  property: Property;
  activeCaseCount: number;
}

export function PropertyCard({ property, activeCaseCount }: PropertyCardProps) {
  const isCommercial = property.type === "commercial";
  const unitCount = property.unitCount ?? 1;

  // Status badge
  let badgeText = `${unitCount} ${unitCount === 1 ? "Unit" : "Units"}`;
  let badgeClass = "bg-[#c5e9ee] text-[#486a6f]";
  if (activeCaseCount > 0) {
    badgeText = `${activeCaseCount} Active Case${activeCaseCount > 1 ? "s" : ""}`;
    badgeClass = "bg-[#ffdad6] text-[#93000a]";
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden border border-[#bdc9ca]/10 hover:border-[#006872]/30 transition-all duration-300">
        {/* Image area — colored placeholder since we don't have real photos */}
        <div className={`h-64 overflow-hidden relative flex items-center justify-center ${isCommercial ? "bg-slate-100" : "bg-cyan-50"}`}>
          <span className={`material-symbols-outlined text-6xl ${isCommercial ? "text-slate-300" : "text-cyan-200"} group-hover:scale-110 transition-transform duration-700`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isCommercial ? "business" : "home_work"}
          </span>
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tighter ${badgeClass}`}>
              {badgeText}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-left space-y-4">
          <div>
            <h4 className="text-xl font-extrabold text-cyan-950" style={{ fontFamily: "'Manrope', sans-serif" }}>{property.address}</h4>
            <div className="flex items-center gap-1 text-slate-500 mt-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-sm">{isCommercial ? "Commercial" : "Residential"}</span>
            </div>
          </div>

          <div className="flex justify-between items-end pt-2">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory</p>
              <p className="text-lg font-bold text-cyan-800">{unitCount} {unitCount === 1 ? "Unit" : "Units"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cases</p>
              <p className={`text-lg font-bold ${activeCaseCount > 0 ? "text-[#ba1a1a]" : "text-[#006872]"}`}>
                {activeCaseCount > 0 ? `${activeCaseCount} Open` : "None"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
