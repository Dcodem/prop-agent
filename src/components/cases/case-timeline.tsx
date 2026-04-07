"use client";

import type { CaseTimelineEntry } from "@/lib/db/schema";

const EVENT_STYLE: Record<string, { icon: string; bg: string; text: string }> = {
  case_created: { icon: "add_circle", bg: "bg-success-container", text: "text-on-success-container" },
  status_change: { icon: "swap_horiz", bg: "bg-info-container", text: "text-info" },
  vendor_assigned: { icon: "person_add", bg: "bg-warning-container", text: "text-warning-dim" },
  note: { icon: "edit_note", bg: "bg-purple-container", text: "text-on-purple-container" },
  sms_sent: { icon: "sms", bg: "bg-accent-container", text: "text-accent" },
  email_sent: { icon: "mail", bg: "bg-accent-container", text: "text-accent" },
  ai_triage: { icon: "psychology", bg: "bg-purple-container", text: "text-on-purple-container" },
  inspection_scheduled: { icon: "event_available", bg: "bg-caution-container", text: "text-on-caution-container" },
  default: { icon: "circle", bg: "bg-surface-container-high", text: "text-on-surface-variant" },
};

function getEventStyle(type: string) {
  return EVENT_STYLE[type] ?? EVENT_STYLE.default;
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const STAGE_COLORS: Record<string, string> = {
  open: "bg-info-container text-info",
  in_progress: "bg-accent-container text-accent",
  waiting_on_vendor: "bg-caution-container text-on-caution-container",
  waiting_on_tenant: "bg-warning-container text-on-warning-container",
  resolved: "bg-success-container text-on-success-container",
  closed: "bg-surface-container-high text-on-surface-variant",
};

function getStageBadge(entry: CaseTimelineEntry): string | null {
  if (entry.type === "status_change" && entry.metadata) {
    const meta = entry.metadata as Record<string, unknown>;
    if (meta.newStatus) return String(meta.newStatus);
    if (meta.to) return String(meta.to);
  }
  if (entry.type === "case_created") return "open";
  if (entry.type === "vendor_assigned") return "in_progress";
  return null;
}

export function CaseTimeline({
  timeline,
  caseId,
  caseStatus,
}: {
  timeline: CaseTimelineEntry[];
  caseId: string;
  caseStatus: string;
}) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">System of Record</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">At-a-glance roll call of case interactions</p>
        </div>
        <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/5 px-4 py-2 rounded-full border border-accent/10">
          Audit Ready
        </span>
      </div>

      <div className="relative">
        {timeline.map((entry, idx) => {
          const isLast = idx === timeline.length - 1;
          const style = getEventStyle(entry.type);
          const stage = getStageBadge(entry);

          return (
            <div key={entry.id} className="relative flex gap-4">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className="absolute left-[15px] top-8 bottom-0 w-px bg-outline-variant/30"
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}
              >
                <span className={`material-symbols-outlined text-base ${style.text}`}>
                  {style.icon}
                </span>
              </div>

              {/* Content */}
              <div className={`flex-1 min-w-0 ${!isLast ? "pb-6" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-on-surface">
                      {formatType(entry.type)}
                    </span>
                    {stage && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          STAGE_COLORS[stage] ?? STAGE_COLORS.closed
                        }`}
                      >
                        {formatType(stage)}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium whitespace-nowrap tabular-nums">
                    {formatDate(entry.createdAt)} {formatTime(entry.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  {entry.details ?? "No details provided."}
                </p>
              </div>
            </div>
          );
        })}

        {timeline.length === 0 && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base text-on-surface-variant">pending</span>
            </div>
            <div>
              <span className="text-sm font-bold text-on-surface">No activity yet</span>
              <p className="text-sm text-on-surface-variant mt-0.5">This case has no timeline entries yet.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
