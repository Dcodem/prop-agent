import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  iconBg?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  badge?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function StatCard({
  icon,
  iconBg = "bg-surface-container-high",
  iconColor = "text-on-surface-variant",
  value,
  label,
  badge,
  onClick,
  href,
  className,
}: StatCardProps) {
  const baseClasses = cn(
    "bg-surface-container-lowest rounded-2xl p-5 card-shadow border border-outline-variant/10 flex items-center gap-4 text-left",
    (onClick || href) && "hover:ring-2 hover:ring-accent/30 transition-all cursor-pointer",
    className
  );

  const content = (
    <>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
        <span aria-hidden="true" className={cn("material-symbols-outlined", iconColor)}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-extrabold text-on-surface">{value}</p>
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
