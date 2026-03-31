"use client";

import { VENDOR_TRADES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";

interface TradeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TradeFilter({ value, onChange }: TradeFilterProps) {
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#426469] hover:bg-[#e6eeff] transition-colors rounded-[0.5rem] cursor-pointer"
        onClick={(e) => {
          const menu = (e.currentTarget.nextElementSibling as HTMLElement);
          menu.classList.toggle("hidden");
        }}
      >
        <span className="material-symbols-outlined text-lg">filter_list</span>
        {value === "all" ? "Filter" : formatEnum(value)}
      </button>
      <div className="hidden absolute top-full left-0 mt-1 z-20 bg-white rounded-lg shadow-lg border border-[#bdc9ca]/30 py-1 min-w-[200px]">
        <button
          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#eff4ff] transition-colors cursor-pointer ${
            value === "all" ? "font-bold text-[#006872]" : "text-[#0d1c2e]"
          }`}
          onClick={(e) => {
            onChange("all");
            (e.currentTarget.parentElement as HTMLElement).classList.add("hidden");
          }}
        >
          All Trades
        </button>
        {VENDOR_TRADES.map((trade) => (
          <button
            key={trade}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#eff4ff] transition-colors cursor-pointer ${
              value === trade ? "font-bold text-[#006872]" : "text-[#0d1c2e]"
            }`}
            onClick={(e) => {
              onChange(trade);
              (e.currentTarget.parentElement as HTMLElement).classList.add("hidden");
            }}
          >
            {formatEnum(trade)}
          </button>
        ))}
      </div>
    </div>
  );
}
