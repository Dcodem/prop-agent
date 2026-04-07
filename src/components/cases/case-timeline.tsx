"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseTimelineEntry } from "@/lib/db/schema";

/* ─── Event styling ──────────────────────────────────────────── */

const EVENT_STYLE: Record<
  string,
  {
    icon: string;
    dot: string;
    iconColor: string;
    label: string;
    category: "ai" | "human" | "system";
  }
> = {
  // System events
  case_created:         { icon: "add_circle",       dot: "bg-success ring-success/30",           iconColor: "text-success",              label: "Case Created",         category: "system" },
  status_change:        { icon: "swap_horiz",        dot: "bg-info ring-info/30",                 iconColor: "text-info",                 label: "Status Changed",       category: "system" },
  sms_sent:             { icon: "sms",               dot: "bg-accent ring-accent/30",             iconColor: "text-accent",               label: "SMS Sent",             category: "system" },
  email_sent:           { icon: "mail",              dot: "bg-accent ring-accent/30",             iconColor: "text-accent",               label: "Email Sent",           category: "system" },
  resolved:             { icon: "check_circle",      dot: "bg-success ring-success/30",           iconColor: "text-success",              label: "Resolved",             category: "system" },

  // AI events
  ai_triage:            { icon: "psychology",         dot: "bg-purple ring-purple/30",             iconColor: "text-purple",               label: "AI Triage",            category: "ai" },
  classified:           { icon: "category",           dot: "bg-purple ring-purple/30",             iconColor: "text-purple",               label: "AI Classified",        category: "ai" },
  replied_to_tenant:    { icon: "reply",              dot: "bg-purple ring-purple/30",             iconColor: "text-purple",               label: "AI Replied",           category: "ai" },
  dispatched_vendor:    { icon: "local_shipping",     dot: "bg-purple ring-purple/30",             iconColor: "text-purple",               label: "Vendor Dispatched",    category: "ai" },
  follow_up_scheduled:  { icon: "schedule_send",      dot: "bg-purple ring-purple/30",             iconColor: "text-purple",               label: "Follow-up Scheduled",  category: "ai" },
  notified_manager:     { icon: "notifications",      dot: "bg-caution ring-caution/30",           iconColor: "text-on-caution-container", label: "PM Notified",          category: "ai" },
  vendor_declined:      { icon: "person_off",         dot: "bg-warning ring-warning/30",           iconColor: "text-warning-dim",          label: "Vendor Declined",      category: "ai" },

  // Human events
  vendor_assigned:      { icon: "person_add",         dot: "bg-warning ring-warning/30",           iconColor: "text-warning-dim",          label: "Vendor Assigned",      category: "human" },
  note:                 { icon: "edit_note",          dot: "bg-on-surface-variant ring-outline/30", iconColor: "text-on-surface-variant",  label: "Note",                 category: "human" },
  inspection_scheduled: { icon: "event_available",    dot: "bg-caution ring-caution/30",           iconColor: "text-on-caution-container", label: "Inspection Scheduled", category: "human" },

  // Fallback
  default:              { icon: "circle",             dot: "bg-outline ring-outline/20",           iconColor: "text-outline",              label: "Event",                category: "system" },
};

function getStyle(type: string) {
  return EVENT_STYLE[type] ?? EVENT_STYLE.default;
}

const STAGE_COLORS: Record<string, string> = {
  open: "bg-info/10 text-info border-info/20",
  in_progress: "bg-accent/10 text-accent border-accent/20",
  waiting_on_vendor: "bg-caution/10 text-on-caution-container border-caution/20",
  waiting_on_tenant: "bg-warning/10 text-warning-dim border-warning/20",
  resolved: "bg-success/10 text-success border-success/20",
  closed: "bg-surface-container-high text-on-surface-variant border-outline-variant/20",
};

/* ─── Helpers ────────────────────────────────────────────────── */

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatType(type: string) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

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

/* ─── Component ──────────────────────────────────────────────── */

const INITIAL_COUNT = 6;

export function CaseTimeline({
  timeline,
  caseId,
  caseStatus,
}: {
  timeline: CaseTimelineEntry[];
  caseId: string;
  caseStatus: string;
}) {
  const [filter, setFilter] = useState<"all" | "ai" | "human" | "system">("all");
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return timeline;
    return timeline.filter((e) => getStyle(e.type).category === filter);
  }, [timeline, filter]);

  const visibleItems = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  const FILTERS = [
    { key: "all" as const, label: "All", icon: "list" },
    { key: "ai" as const, label: "AI", icon: "smart_toy" },
    { key: "human" as const, label: "Human", icon: "person" },
    { key: "system" as const, label: "System", icon: "settings" },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-8 lg:p-10 shadow-sm border border-outline-variant/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Activity
          </h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            {timeline.length} event{timeline.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filter === f.key
                  ? "bg-accent text-on-accent shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-outline">
              pending
            </span>
          </div>
          <p className="text-sm font-bold text-on-surface">No activity yet</p>
          <p className="text-xs text-on-surface-variant">
            Events will appear here as the case progresses.
          </p>
        </div>
      )}

      {/* Timeline — Codehagen-inspired grid layout */}
      <ul className="space-y-0">
        {visibleItems.map((entry, i) => {
          const style = getStyle(entry.type);
          const stage = getStageBadge(entry);
          const isExpanded = expandedId === entry.id;
          const hasExpandableContent =
            entry.type === "ai_triage" ||
            entry.type === "classified" ||
            entry.type === "dispatched_vendor" ||
            entry.type === "vendor_assigned" ||
            entry.type === "inspection_scheduled" ||
            (entry.details && entry.details.length > 80);

          return (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.04,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="list-none"
            >
              {/* Desktop: grid with date left, dot center, content right */}
              <div
                onClick={() =>
                  hasExpandableContent
                    ? setExpandedId(isExpanded ? null : entry.id)
                    : undefined
                }
                className={`group hidden md:grid grid-cols-[140px_32px_1fr] items-start transition-colors rounded-lg -mx-3 px-3 ${
                  hasExpandableContent
                    ? "cursor-pointer hover:bg-surface-container-low/50"
                    : ""
                } ${isExpanded ? "bg-surface-container-low/50" : ""}`}
              >
                {/* Date column */}
                <div className="py-4 pr-4 text-right">
                  <p className="text-xs font-medium text-on-surface-variant/70 leading-tight">
                    {formatDate(entry.createdAt)}
                  </p>
                  <p className="text-[11px] text-outline font-medium tabular-nums mt-0.5">
                    {formatTime(entry.createdAt)}
                  </p>
                </div>

                {/* Dot + connector */}
                <div className="relative flex flex-col items-center py-4">
                  <div
                    className={`relative z-10 w-[10px] h-[10px] rounded-full ring-2 mt-1.5 transition-transform group-hover:scale-125 ${style.dot}`}
                  />
                  {i < visibleItems.length - 1 && (
                    <div className="w-px flex-1 bg-outline-variant/20 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="py-4 pl-4 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`material-symbols-outlined text-[16px] ${style.iconColor}`}
                    >
                      {style.icon}
                    </span>
                    <span className="text-sm font-bold text-on-surface-variant transition-colors group-hover:text-on-surface">
                      {style.label}
                    </span>
                    {stage && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          STAGE_COLORS[stage] ?? STAGE_COLORS.closed
                        }`}
                      >
                        {formatType(stage)}
                      </span>
                    )}
                    {style.category === "ai" && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-purple/10 text-purple text-[9px] font-bold uppercase tracking-wider border border-purple/20">
                        <span className="material-symbols-outlined text-[10px]">
                          smart_toy
                        </span>
                        AI
                      </span>
                    )}
                    {hasExpandableContent && (
                      <span
                        className={`material-symbols-outlined text-xs text-outline transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    )}
                  </div>

                  {/* Detail preview */}
                  {entry.details && !isExpanded && (
                    <p className="text-xs text-on-surface-variant/70 mt-1 line-clamp-1">
                      {entry.details}
                    </p>
                  )}

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && entry.details && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/10 text-sm text-on-surface-variant leading-relaxed">
                          {entry.details}
                          {entry.metadata &&
                            Object.keys(entry.metadata).length > 0 && (
                              <div className="mt-3 pt-3 border-t border-outline-variant/10 flex flex-wrap gap-2">
                                {Object.entries(entry.metadata).map(
                                  ([k, v]) => (
                                    <span
                                      key={k}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant"
                                    >
                                      <span className="text-outline">
                                        {formatType(k)}:
                                      </span>
                                      <span className="text-on-surface">
                                        {String(v)}
                                      </span>
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile: stacked layout */}
              <div
                onClick={() =>
                  hasExpandableContent
                    ? setExpandedId(isExpanded ? null : entry.id)
                    : undefined
                }
                className={`md:hidden flex items-start gap-3 py-3 px-3 -mx-3 rounded-xl transition-all ${
                  hasExpandableContent
                    ? "cursor-pointer hover:bg-surface-container-low/50"
                    : ""
                } ${isExpanded ? "bg-surface-container-low/50" : ""}`}
              >
                {/* Dot + connector */}
                <div className="relative flex flex-col items-center pt-1">
                  <div
                    className={`relative z-10 w-[10px] h-[10px] rounded-full ring-2 ${style.dot}`}
                  />
                  {i < visibleItems.length - 1 && (
                    <div className="w-px flex-1 bg-outline-variant/20 mt-1 min-h-[24px]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`material-symbols-outlined text-[14px] ${style.iconColor}`}
                    >
                      {style.icon}
                    </span>
                    <span className="text-sm font-bold text-on-surface">
                      {style.label}
                    </span>
                    {stage && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          STAGE_COLORS[stage] ?? STAGE_COLORS.closed
                        }`}
                      >
                        {formatType(stage)}
                      </span>
                    )}
                    {style.category === "ai" && (
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-purple/10 text-purple text-[8px] font-bold uppercase border border-purple/20">
                        AI
                      </span>
                    )}
                  </div>
                  {entry.details && !isExpanded && (
                    <p className="text-xs text-on-surface-variant/70 mt-0.5 line-clamp-1">
                      {entry.details}
                    </p>
                  )}
                  <p className="text-[10px] text-outline font-medium mt-1">
                    {formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}
                  </p>

                  {/* Expanded detail (mobile) */}
                  <AnimatePresence>
                    {isExpanded && entry.details && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/10 text-sm text-on-surface-variant leading-relaxed">
                          {entry.details}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>

      {/* Load More / Show Less */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          >
            {showAll ? "Show Less" : `Load More (${filtered.length - INITIAL_COUNT})`}
            <motion.span
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-base"
            >
              expand_more
            </motion.span>
          </button>
        </motion.div>
      )}
    </section>
  );
}
