"use client";

import { StatCard } from "@/components/ui/stat-card";

interface StatsBarProps {
  totalCases: number;
  openCases: number;
  propertyCount: number;
  onOpenCasesClick?: () => void;
}

export function StatsBar({ totalCases, openCases, propertyCount, onOpenCasesClick }: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard icon="folder" iconBg="bg-info-container" iconColor="text-info" value={totalCases} label="Total Cases" />
      <StatCard
        icon="pending_actions"
        iconBg="bg-caution-container"
        iconColor="text-caution"
        value={openCases}
        label="Open Cases"
        onClick={onOpenCasesClick}
        badge={openCases > 0 ? (
          <div className="flex items-center text-caution text-[11px] font-bold">
            <span className="w-2 h-2 bg-caution rounded-full mr-1.5 animate-pulse" />
            Active
          </div>
        ) : undefined}
      />
      <StatCard icon="domain" iconBg="bg-purple-container" iconColor="text-purple" value={propertyCount} label="Properties" />
    </div>
  );
}
