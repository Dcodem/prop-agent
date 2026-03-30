import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: string;
  subtitle?: string;
}

interface StatsBarProps {
  stats: Stat[];
  className?: string;
}

export function StatsBar({ stats, className }: StatsBarProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-edge bg-surface p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                stat.accent ?? "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-tertiary truncate">{stat.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular-nums">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-[11px] text-ink-tertiary truncate">{stat.subtitle}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
