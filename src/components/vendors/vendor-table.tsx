"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { vendors } from "@/lib/db/schema";
import { formatEnum } from "@/lib/utils";
import { TradeFilter } from "./trade-filter";

type Vendor = typeof vendors.$inferSelect;

const AVATAR_COLORS = [
  { bg: "bg-surface-container-high", text: "text-on-surface" },
  { bg: "bg-surface-container", text: "text-on-surface-variant" },
  { bg: "bg-surface-container-highest", text: "text-on-surface" },
  { bg: "bg-surface-container-high", text: "text-on-surface" },
  { bg: "bg-surface-container", text: "text-on-surface-variant" },
  { bg: "bg-surface-container-highest", text: "text-on-surface" },
  { bg: "bg-surface-container-high", text: "text-on-surface" },
  { bg: "bg-surface-container", text: "text-on-surface-variant" },
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
            i < filled ? "text-warning" : "text-outline-variant"
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
      <span className="ml-2 text-sm font-bold text-on-surface">
        {(score * 5).toFixed(1)}
      </span>
    </div>
  );
}

export function VendorTable({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const startItem = filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden mb-12 card-shadow">
      {/* Table Controls/Filters */}
      <div className="px-8 py-6 border-b border-surface flex justify-between items-center bg-surface-container-low/30">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg pl-12 pr-4 py-2 w-80 text-sm focus:ring-2 focus:ring-accent transition-all"
              placeholder="Search by name or trade..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <TradeFilter value={tradeFilter} onChange={setTradeFilter} />
        </div>
        <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          Total {filtered.length} Vendor{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Ledger List */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Vendor &amp; Trade</th>
              <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Contact Information</th>
              <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Rate Notes</th>
              <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Preference</th>
              <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {paginatedVendors.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-12 text-center"
                >
                  <span className="material-symbols-outlined text-2xl text-outline mb-1 block">search_off</span>
                  <p className="text-on-surface-variant text-sm font-medium">No vendors match your search.</p>
                  <p className="text-outline text-xs mt-1">Try adjusting your filters or add a new vendor.</p>
                </td>
              </tr>
            )}
            {paginatedVendors.map((vendor, idx) => {
              const color = getAvatarColor(vendor.name);
              return (
                <tr
                  key={vendor.id}
                  onClick={() => router.push(`/vendors/${vendor.id}`)}
                  className={`${
                    idx % 2 === 1 ? "bg-surface-container-low/20" : ""
                  } hover:bg-surface-container-low/50 transition-colors group cursor-pointer`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center ${color.text} font-bold`}
                      >
                        {getInitials(vendor.name)}
                      </div>
                      <div>
                        <div className="text-base font-bold text-on-surface">
                          {vendor.name}
                        </div>
                        <div className="text-xs text-on-surface-variant font-medium">
                          {formatEnum(vendor.trade)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-on-surface">
                      {vendor.email || "--"}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {vendor.phone || "--"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-on-surface">
                      {vendor.rateNotes || "--"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {renderStars(vendor.preferenceScore ?? 0.5)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {vendor.availabilityNotes ? (
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-wider border border-outline-variant/10">
                        {vendor.availabilityNotes}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-wider border border-outline-variant/10">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-8 py-6 bg-surface-container-low/30 border-t border-surface flex items-center justify-between text-xs font-semibold text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span>
            Showing {startItem}–{endItem} of {filtered.length} vendor{filtered.length !== 1 ? "s" : ""}
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="text-xs bg-surface-container-lowest border border-outline-variant/20 rounded px-2 py-1 text-on-surface-variant focus:ring-1 focus:ring-accent"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-xs font-bold rounded transition-colors ${
                page === currentPage
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
