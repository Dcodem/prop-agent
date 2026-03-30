import { Wrench } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatEnum } from "@/lib/utils";

interface Vendor {
  id: string;
  name: string;
  trade: string;
  email: string | null;
  phone: string | null;
  rateNotes: string | null;
  preferenceScore: number | null;
}

interface VendorTableProps {
  vendors: Vendor[];
  currentTrade?: string;
}

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  plumber: { bg: "bg-cyan-100", text: "text-cyan-700" },
  electrician: { bg: "bg-slate-200", text: "text-slate-700" },
  hvac: { bg: "bg-teal-100", text: "text-teal-700" },
  general: { bg: "bg-slate-200", text: "text-slate-600" },
  locksmith: { bg: "bg-green-100", text: "text-green-700" },
  appliance_repair: { bg: "bg-amber-100", text: "text-amber-700" },
  pest_control: { bg: "bg-red-100", text: "text-red-700" },
  cleaning: { bg: "bg-amber-100", text: "text-amber-700" },
  landscaping: { bg: "bg-emerald-100", text: "text-emerald-700" },
  roofing: { bg: "bg-orange-100", text: "text-orange-700" },
  painting: { bg: "bg-pink-100", text: "text-pink-700" },
  other: { bg: "bg-slate-200", text: "text-slate-600" },
};

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function StarRating({ score }: { score: number }) {
  const stars = Math.round(score * 5);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${i <= stars ? "text-[#00838f]" : "text-[#bdc9ca]"}`}
          style={i <= stars ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          star
        </span>
      ))}
      <span className="ml-2 text-sm font-bold text-[#0d1c2e]">{(score * 5).toFixed(1)}</span>
    </div>
  );
}

export function VendorTable({ vendors, currentTrade }: VendorTableProps) {
  const filtered = currentTrade
    ? vendors.filter((v) => v.trade === currentTrade)
    : vendors;

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title={currentTrade ? "No vendors for this trade" : "No vendors yet"}
        description={currentTrade ? "Try selecting a different trade filter." : "Add your first vendor to get started."}
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff] text-[#3e494a] uppercase text-[11px] font-bold tracking-[0.15em]">
              <th className="px-8 py-4">Vendor &amp; Trade</th>
              <th className="px-8 py-4">Contact Information</th>
              <th className="px-8 py-4">Standard Rate</th>
              <th className="px-8 py-4">Preference</th>
              <th className="px-8 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bdc9ca]/10">
            {filtered.map((vendor, i) => {
              const colors = AVATAR_COLORS[vendor.trade] ?? AVATAR_COLORS.other;
              const score = vendor.preferenceScore ?? 0.5;

              return (
                <tr
                  key={vendor.id}
                  className={`hover:bg-[#eff4ff] transition-colors group cursor-pointer ${i % 2 === 1 ? "bg-[#eff4ff]/30" : ""}`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} font-bold`}>
                        {getInitials(vendor.name)}
                      </div>
                      <div>
                        <div className="text-base font-bold text-[#0d1c2e]">{vendor.name}</div>
                        <div className="text-xs text-[#3e494a] font-medium">{formatEnum(vendor.trade)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-[#0d1c2e]">{vendor.email ?? "—"}</div>
                    <div className="text-xs text-[#3e494a]">{vendor.phone ?? "—"}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-[#0d1c2e]">{vendor.rateNotes ?? "—"}</div>
                  </td>
                  <td className="px-8 py-6">
                    <StarRating score={score} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 bg-[#c5e9ee] text-[#2a4c50] rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 bg-[#eff4ff] flex justify-between items-center text-xs font-semibold text-[#3e494a]">
        <div>Showing 1-{filtered.length} of {vendors.length}</div>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-white ring-1 ring-[#bdc9ca]/30 hover:bg-white transition-all">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#00838f] text-white">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-white ring-1 ring-[#bdc9ca]/30 hover:bg-white transition-all">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </>
  );
}
