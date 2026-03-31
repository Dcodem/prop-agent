"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { vendors } from "@/lib/db/schema";
import { formatEnum } from "@/lib/utils";
import { TradeFilter } from "./trade-filter";

type Vendor = typeof vendors.$inferSelect;

const AVATAR_COLORS = [
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-slate-200", text: "text-slate-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function renderStars(score: number) {
  const filled = Math.round(score * 5);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${
            i < filled ? "text-[#00838f]" : "text-[#bdc9ca]"
          }`}
          style={
            i < filled
              ? { fontVariationSettings: "'FILL' 1" }
              : undefined
          }
        >
          star
        </span>
      ))}
      <span className="ml-2 text-sm font-bold text-[#0d1c2e]">
        {(score * 5).toFixed(1)}
      </span>
    </div>
  );
}

export function VendorTable({ vendors }: { vendors: Vendor[] }) {
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        formatEnum(v.trade).toLowerCase().includes(search.toLowerCase());
      const matchesTrade = tradeFilter === "all" || v.trade === tradeFilter;
      return matchesSearch && matchesTrade;
    });
  }, [vendors, search, tradeFilter]);

  return (
    <section className="bg-white rounded-[1rem] border border-[#bdc9ca]/20 overflow-hidden mb-12">
      {/* Table Controls/Filters */}
      <div className="px-8 py-6 border-b border-[#bdc9ca]/10 flex justify-between items-center bg-[#eff4ff]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6e797b]">
              search
            </span>
            <input
              className="bg-white border-0 ring-1 ring-[#bdc9ca]/30 rounded-[0.5rem] pl-12 pr-4 py-2 w-80 text-sm focus:ring-2 focus:ring-[#006872] transition-all"
              placeholder="Search by name or trade..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <TradeFilter value={tradeFilter} onChange={setTradeFilter} />
        </div>
        <div className="text-xs font-bold text-[#6e797b] uppercase tracking-widest">
          Total {filtered.length} Vendor{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Ledger List */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff] text-[#3e494a] uppercase text-[11px] font-bold tracking-[0.15em]">
              <th className="px-8 py-4">Vendor &amp; Trade</th>
              <th className="px-8 py-4">Contact Information</th>
              <th className="px-8 py-4">Rate Notes</th>
              <th className="px-8 py-4">Preference</th>
              <th className="px-8 py-4 text-right">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bdc9ca]/10">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-12 text-center text-[#3e494a]"
                >
                  No vendors found.
                </td>
              </tr>
            )}
            {filtered.map((vendor, idx) => {
              const color = getAvatarColor(vendor.name);
              return (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.id}`}
                  className="contents"
                >
                  <tr
                    className={`${
                      idx % 2 === 1 ? "bg-[#eff4ff]/30" : ""
                    } hover:bg-[#eff4ff] transition-colors group cursor-pointer`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center ${color.text} font-bold`}
                        >
                          {getInitials(vendor.name)}
                        </div>
                        <div>
                          <div className="text-base font-bold text-[#0d1c2e]">
                            {vendor.name}
                          </div>
                          <div className="text-xs text-[#3e494a] font-medium">
                            {formatEnum(vendor.trade)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-[#0d1c2e]">
                        {vendor.email || "--"}
                      </div>
                      <div className="text-xs text-[#3e494a]">
                        {vendor.phone || "--"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-[#0d1c2e]">
                        {vendor.rateNotes || "--"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {renderStars(vendor.preferenceScore ?? 0.5)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {vendor.availabilityNotes ? (
                        <span className="px-3 py-1 bg-[#c5e9ee] text-[#2a4c50] rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {vendor.availabilityNotes}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-[#c5e9ee] text-[#2a4c50] rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                </Link>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="px-8 py-4 bg-[#eff4ff] flex justify-between items-center text-xs font-semibold text-[#3e494a]">
        <div>
          Showing {filtered.length} of {vendors.length}
        </div>
      </div>
    </section>
  );
}
