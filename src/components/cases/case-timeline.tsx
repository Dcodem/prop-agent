import { cn, timeAgo, formatEnum } from "@/lib/utils";
import type { CaseTimelineEntry } from "@/lib/db/schema";

interface CaseTimelineProps {
  timeline: CaseTimelineEntry[];
  className?: string;
}

function getEventColor(type: string): string {
  const map: Record<string, string> = {
    case_created: "border-slate-200",
    classified: "border-slate-300",
    status_change: "border-purple-500",
    vendor_assigned: "border-orange-500",
    vendor_dispatched: "border-orange-500",
    vendor_accepted: "border-green-500",
    replied_to_tenant: "border-blue-500",
    pm_notified: "border-slate-300",
    note: "border-blue-400",
  };
  return map[type] ?? "border-slate-300";
}

function getDotColor(type: string): string {
  const map: Record<string, string> = {
    case_created: "bg-slate-200",
    classified: "bg-slate-300",
    status_change: "bg-purple-500",
    vendor_assigned: "bg-orange-500",
    vendor_dispatched: "bg-orange-500",
    vendor_accepted: "bg-green-500",
    replied_to_tenant: "bg-blue-500",
    pm_notified: "bg-slate-300",
    note: "bg-blue-400",
  };
  return map[type] ?? "bg-slate-300";
}

export function CaseTimeline({ timeline, className }: CaseTimelineProps) {
  if (timeline.length === 0) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <p className="text-sm text-slate-400">No timeline events yet</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-slate-100",
        className
      )}
    >
      {timeline.map((entry) => (
        <div key={entry.id} className="relative flex items-center gap-4 group">
          {/* Circle */}
          <div
            className={cn(
              "absolute left-0 w-10 h-10 flex items-center justify-center bg-white border-2 rounded-full z-10",
              getEventColor(entry.type)
            )}
          >
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                getDotColor(entry.type)
              )}
            />
          </div>

          {/* Content */}
          <div className="ml-12">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                {formatEnum(entry.type)}
              </span>
              <span className="text-xs text-slate-400">
                {timeAgo(entry.createdAt)}
              </span>
            </div>
            {entry.details && (
              <p className="text-xs text-slate-500">{entry.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
