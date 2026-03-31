"use client";

import type { CaseTimelineEntry } from "@/lib/db/schema";
import { AddNoteForm } from "./add-note-form";

const ICON_MAP: Record<string, string> = {
  case_created: "flag",
  status_change: "sync",
  vendor_assigned: "engineering",
  note: "description",
  sms_sent: "sms",
  email_sent: "mail",
  ai_triage: "psychology",
  inspection_scheduled: "event_available",
  default: "pending",
};

function getIcon(type: string) {
  return ICON_MAP[type] ?? ICON_MAP.default;
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
    <section className="bg-white rounded-2xl p-10 shadow-sm border border-[#bdc9ca]/10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight">
            System of Record
          </h2>
          <p className="text-sm text-[#3e494a] font-medium mt-1">
            At-a-glance roll call of case interactions
          </p>
        </div>
        <span className="text-xs font-black text-[#006872] uppercase tracking-widest bg-[#006872]/5 px-4 py-2 rounded-full border border-[#006872]/10">
          Audit Ready
        </span>
      </div>
      <div className="relative space-y-0 pl-4">
        {/* Vertical Line Connector */}
        <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#006872] via-[#006872]/30 to-[#d0daf0]"></div>

        {timeline.map((entry, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === timeline.length - 1;

          return (
            <div
              key={entry.id}
              className={`relative flex gap-8 ${!isLast ? "pb-10" : ""}`}
            >
              <div
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white ${
                  isFirst
                    ? "bg-[#006872] text-white shadow-lg"
                    : isLast
                      ? "bg-[#00838f] text-white shadow-md animate-pulse"
                      : "bg-[#d0daf0] text-[#006872]"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {getIcon(entry.type)}
                </span>
              </div>
              <div className="flex-grow pt-1">
                <div className="flex justify-between items-start mb-1">
                  <h4
                    className={`font-bold ${isLast ? "text-[#006872]" : "text-[#0d1c2e]"}`}
                  >
                    {isLast
                      ? `Current Stage: ${formatType(caseStatus)}`
                      : formatType(entry.type)}
                  </h4>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      isLast ? "text-[#006872]" : "text-[#3e494a]"
                    }`}
                  >
                    {isLast ? "Now" : formatTime(entry.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[#3e494a]">
                  {entry.details ?? "No details provided."}
                </p>
              </div>
            </div>
          );
        })}

        {timeline.length === 0 && (
          <div className="relative flex gap-8">
            <div className="relative z-10 w-9 h-9 rounded-full bg-[#00838f] flex items-center justify-center text-white shadow-md ring-4 ring-white animate-pulse">
              <span className="material-symbols-outlined text-lg">
                pending
              </span>
            </div>
            <div className="flex-grow pt-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-[#006872]">No activity yet</h4>
                <span className="text-[10px] font-black text-[#006872] uppercase tracking-wider">
                  Now
                </span>
              </div>
              <p className="text-sm text-[#3e494a]">
                This case has no timeline entries yet.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Note Form */}
      <div className="mt-10 pt-8 border-t border-[#bdc9ca]/20">
        <AddNoteForm caseId={caseId} />
      </div>
    </section>
  );
}
