import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  iconBg?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  badge?: React.ReactNode;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  onClick?: () => void;
  href?: string;
  className?: string;
}

const TREND_STYLES = {
  up: { icon: "trending_up", bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  down: { icon: "trending_down", bg: "bg-error/10", text: "text-error", border: "border-error/20" },
  neutral: { icon: "trending_flat", bg: "bg-outline/10", text: "text-on-surface-variant", border: "border-outline/20" },
};

export function StatCard({
  icon,
  iconBg = "bg-surface-container-high",
  iconColor = "text-on-surface-variant",
  value,
  label,
  badge,
  trend,
  onClick,
  href,
  className,
}: StatCardProps) {
  const baseClasses = cn(
    "bg-surface-container-lowest rounded-2xl p-5 card-shadow border border-outline-variant/10 flex items-center gap-4 text-left",
    (onClick || href) && "hover:ring-2 hover:ring-accent/30 transition-all cursor-pointer",
    className
  );

  const trendStyle = trend ? TREND_STYLES[trend.direction] : null;

  const content = (
    <>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
        <span aria-hidden="true" className={cn("material-symbols-outlined", iconColor)}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-extrabold text-on-surface">{value}</p>
          {trend && trendStyle && (
            <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold border", trendStyle.bg, trendStyle.text, trendStyle.border)}>
              <span className="material-symbols-outlined text-xs">{trendStyle.icon}</span>
              {trend.value}
            </span>
          )}
        </div>
        <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">{label}</p>
      </div>
      {badge && <div className="ml-auto">{badge}</div>}
    </>
  );

  if (href) {
    return <Link href={href} className={baseClasses}>{content}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className={baseClasses}>{content}</button>;
  }

  return <div className={baseClasses}>{content}</div>;
}
