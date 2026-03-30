import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-edge p-8 sm:p-12",
        className
      )}
    >
      {/* Icon in bordered box */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-edge bg-canvas shadow-sm">
        <Icon className="h-7 w-7 text-ink-tertiary" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-ink tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-secondary leading-relaxed">
          {description}
        </p>
      )}

      {children && (
        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
          {children}
        </div>
      )}
    </div>
  );
}
