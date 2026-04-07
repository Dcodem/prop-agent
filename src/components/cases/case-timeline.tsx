"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseTimelineEntry } from "@/lib/db/schema";

/* ─── Event styling ──────────────────────────────────────────── */

const EVENT_STYLE: Record<string, { icon: string; ring: string; iconColor: string; label: string; category: "ai" | "human" | "system" }> = {
  case_created:           { icon: "add_circle",      ring: "ring-success/30 bg-success/10",       iconColor: "text-success",                label: "Case Created",          category: "system" },
  status_change:          { icon: "swap_horiz",       ring: "ring-info/30 bg-info/10",             iconColor: "text-info",                   label: "Status Changed",        category: "system" },
  vendor_assigned:        { icon: "person_add",       ring: "ring-warning/30 bg-warning/10",       iconColor: "text-warning-dim",            label: "Vendor Assigned",       category: "human" },
  note:                   { icon: "edit_note",        ring: "ring-purple/30 bg-purple/10",         iconColor: "text-purple",                 label: "Note Added",            category: "human" },
  sms_sent:               { icon: "sms",              ring: "ring-accent/30 bg-accent/10",         iconColor: "text-accent",                 label: "SMS Sent",              category: "system" },
  email_sent:             { icon: "mail",             ring: "ring-accent/30 bg-accent/10",         iconColor: "text-accent",                 label: "Email Sent",            category: "system" },
  ai_triage:              { icon: "psychology",        ring: "ring-purple/30 bg-purple/10",         iconColor: "text-purple",                 label: "AI Triage",             category: "ai" },
  inspection_scheduled:   { icon: "event_available",  ring: "ring-caution/30 bg-caution/10",       iconColor: "text-on-caution-container",   label: "Inspection Scheduled",  category: "human" },
  default:                { icon: "circle",           ring: "ring-outline/20 bg-surface-container-high", iconColor: "text-on-surface-variant", label: "Event",               category: "system" },
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

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDateLabel(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = today.getTime() - target.getTime();
  const dayMs = 86400000;

  if (diff < dayMs) return "Today";
  if (diff < dayMs * 2) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
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

export function CaseTimeline({
  timeline,
  caseId,
  caseStatus,
}: {
  timeline: CaseTimelineEntry[];
  caseId: string;
  caseStatus: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "ai" | "human" | "system">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return timeline;
    return timeline.filter((e) => getStyle(e.type).category === filter);
  }, [timeline, filter]);

  // Group by date
  const groups = useMemo(() => {
    const map = new Map<string, CaseTimelineEntry[]>();
    for (const entry of filtered) {
      const label = getDateLabel(entry.createdAt);
      const arr = map.get(label) ?? [];
      arr.push(entry);
      map.set(label, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

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
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Activity</h2>
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

      {/* Timeline */}
      {groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-outline">pending</span>
          </div>
          <p className="text-sm font-bold text-on-surface">No activity yet</p>
          <p className="text-xs text-on-surface-variant">Events will appear here as the case progresses.</p>
        </div>
      )}

      <div className="space-y-6">
        {groups.map(([dateLabel, entries], gi) => (
          <div key={dateLabel}>
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{dateLabel}</span>
              <div className="flex-1 h-px bg-outline-variant/15" />
              <span className="text-[10px] font-bold text-outline tabular-nums">{entries.length}</span>
            </div>

            {/* Entries */}
            <div className="relative ml-4">
              {/* Connector line */}
              <div
                className="absolute left-[13px] top-3 bottom-3 w-px"
                style={{ background: "linear-gradient(to bottom, var(--color-outline-variant) 0%, transparent 100%)", opacity: 0.25 }}
                aria-hidden="true"
              />

              <div className="space-y-1">
                {entries.map((entry, ei) => {
                  const style = getStyle(entry.type);
                  const stage = getStageBadge(entry);
                  const isExpanded = expandedId === entry.id;
                  const hasExpandableContent = entry.type === "ai_triage" || entry.type === "vendor_assigned" || entry.type === "inspection_scheduled" || (entry.details && entry.details.length > 80);

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (gi * entries.length + ei) * 0.03, duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                      className="relative group"
                    >
                      <div
                        onClick={() => hasExpandableContent ? setExpandedId(isExpanded ? null : entry.id) : undefined}
                        className={`flex gap-3 items-start py-3 px-3 -ml-3 rounded-xl transition-all ${
                          hasExpandableContent ? "cursor-pointer hover:bg-surface-container-low/60" : ""
                        } ${isExpanded ? "bg-surface-container-low/60" : ""}`}
                      >
                        {/* Icon node */}
                        <div className={`relative z-10 w-[26px] h-[26px] rounded-full ring-2 ${style.ring} flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className={`material-symbols-outlined text-[14px] ${style.iconColor}`}>
                            {style.icon}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-on-surface">{style.label}</span>
                            {stage && (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                STAGE_COLORS[stage] ?? STAGE_COLORS.closed
                              }`}>
                                {formatType(stage)}
                              </span>
                            )}
                            {style.category === "ai" && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-purple/10 text-purple text-[9px] font-bold uppercase tracking-wider border border-purple/20">
                                <span className="material-symbols-outlined text-[10px]">smart_toy</span>
                                AI
                              </span>
                            )}
                            {hasExpandableContent && (
                              <span className={`material-symbols-outlined text-xs text-outline transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                                expand_more
                              </span>
                            )}
                          </div>

                          {/* Brief detail (always visible) */}
                          {entry.details && !isExpanded && (
                            <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{entry.details}</p>
                          )}

                          {/* Expanded detail card */}
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
                                  {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-outline-variant/10 flex flex-wrap gap-2">
                                      {Object.entries(entry.metadata).map(([k, v]) => (
                                        <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant">
                                          <span className="text-outline">{formatType(k)}:</span>
                                          <span className="text-on-surface">{String(v)}</span>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[11px] text-outline font-medium whitespace-nowrap tabular-nums shrink-0 opacity-60 group-hover:opacity-100 transition-opacity mt-0.5">
                          {formatTime(entry.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
