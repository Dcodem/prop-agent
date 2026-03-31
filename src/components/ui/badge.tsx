import { cn, formatEnum } from "@/lib/utils";

const URGENCY_STYLES = {
  critical: { bg: "bg-[#FEF2F2]", text: "text-[#991B1B]", dot: "bg-[#DC2626]", border: "border-[#FECACA]" },
  high: { bg: "bg-[#FFF7ED]", text: "text-[#9A3412]", dot: "bg-[#EA580C]", border: "border-[#FED7AA]" },
  medium: { bg: "bg-[#FFFBEB]", text: "text-[#92400E]", dot: "bg-[#D97706]", border: "border-[#FDE68A]" },
  low: { bg: "bg-[#F0FDF4]", text: "text-[#166534]", dot: "bg-[#16A34A]", border: "border-[#BBF7D0]" },
} as const;

const STATUS_STYLES = {
  open: { bg: "bg-[#EFF6FF]", text: "text-[#1E40AF]", dot: "bg-[#006872]", border: "border-[#BFDBFE]" },
  in_progress: { bg: "bg-[#F5F3FF]", text: "text-[#5B21B6]", dot: "bg-[#7C3AED]", border: "border-[#DDD6FE]" },
  waiting_on_vendor: { bg: "bg-[#FFF7ED]", text: "text-[#9A3412]", dot: "bg-[#EA580C]", border: "border-[#FED7AA]" },
  waiting_on_tenant: { bg: "bg-[#FFFBEB]", text: "text-[#92400E]", dot: "bg-[#D97706]", border: "border-[#FDE68A]" },
  resolved: { bg: "bg-[#F0FDF4]", text: "text-[#166534]", dot: "bg-[#16A34A]", border: "border-[#BBF7D0]" },
  closed: { bg: "bg-[#F9FAFB]", text: "text-[#4B5563]", dot: "bg-[#9CA3AF]", border: "border-[#E5E7EB]" },
} as const;

interface BadgeProps {
  variant: "urgency" | "status" | "trade";
  value: string;
  className?: string;
}

export function Badge({ variant, value, className }: BadgeProps) {
  if (variant === "urgency") {
    const styles = URGENCY_STYLES[value as keyof typeof URGENCY_STYLES] ?? URGENCY_STYLES.medium;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          styles.bg, styles.text, styles.border,
          className
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />
        {formatEnum(value)}
      </span>
    );
  }

  if (variant === "status") {
    const styles = STATUS_STYLES[value as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.open;
    return (
      <span
        role="status"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          styles.bg, styles.text, styles.border,
          className
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />
        {formatEnum(value)}
      </span>
    );
  }

  // trade variant
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#BFDBFE] bg-primary-fixed px-2.5 py-0.5 text-xs font-medium text-primary",
        className
      )}
    >
      {formatEnum(value)}
    </span>
  );
}
