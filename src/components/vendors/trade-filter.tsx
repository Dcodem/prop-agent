"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { VENDOR_TRADES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";

interface TradeFilterProps {
  currentTrade?: string;
}

export function TradeFilter({ currentTrade }: TradeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("trade", e.target.value);
    } else {
      params.delete("trade");
    }
    router.push(`/vendors?${params.toString()}`);
  }

  return (
    <div className="relative">
      <select
        className="appearance-none bg-white border border-black/10 rounded-lg px-4 py-2 pr-10 text-[14px] font-medium text-slate-600 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer hover:bg-slate-50 transition-colors"
        value={currentTrade ?? ""}
        onChange={handleChange}
      >
        <option value="">All Trades</option>
        {VENDOR_TRADES.map((t) => (
          <option key={t} value={t}>
            {formatEnum(t)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
    </div>
  );
}
