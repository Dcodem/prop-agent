"use client";

import { useState, useActionState } from "react";
import { updateUrgencyTimersAction } from "@/app/(dashboard)/settings/actions";

interface TimerValues {
  vendorResponse: number;
  reminder: number;
  nextVendor: number;
  pmEscalation: number;
}

interface UrgencyTimersFormProps {
  currentTimers: {
    critical: TimerValues;
    high: TimerValues;
    medium: TimerValues;
    low: TimerValues;
  } | null;
}

const DEFAULT_TIMERS: UrgencyTimersFormProps["currentTimers"] = {
  critical: { vendorResponse: 15, reminder: 30, nextVendor: 60, pmEscalation: 120 },
  high: { vendorResponse: 30, reminder: 60, nextVendor: 120, pmEscalation: 240 },
  medium: { vendorResponse: 60, reminder: 120, nextVendor: 240, pmEscalation: 480 },
  low: { vendorResponse: 120, reminder: 240, nextVendor: 480, pmEscalation: 1440 },
};

const LEVELS = ["critical", "high", "medium", "low"] as const;
const COLUMNS = [
  { key: "vendorResponse", label: "Vendor Response" },
  { key: "reminder", label: "Reminder" },
  { key: "nextVendor", label: "Next Vendor" },
  { key: "pmEscalation", label: "PM Escalation" },
] as const;

const DOT_COLORS: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export function UrgencyTimersForm({ currentTimers }: UrgencyTimersFormProps) {
  const timers = currentTimers ?? DEFAULT_TIMERS;
  const [values, setValues] = useState(timers);

  const [state, formAction, isPending] = useActionState(
    async (_prev: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateUrgencyTimersAction(formData);
      return result;
    },
    null,
  );

  function handleChange(level: string, field: string, val: number) {
    setValues((prev) => {
      if (!prev) return prev;
      const levelTimers = prev[level as keyof typeof prev];
      return {
        ...prev,
        [level]: { ...levelTimers, [field]: val },
      };
    });
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <form action={formAction}>
        {/* Hidden fields for form submission */}
        {LEVELS.map((level) =>
          COLUMNS.map((col) => (
            <input
              key={`${level}.${col.key}`}
              type="hidden"
              name={`${level}.${col.key}`}
              value={values![level][col.key]}
            />
          )),
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-600 text-xl">timer</span>
            <h2 className="text-lg font-bold text-slate-800">Urgency Response Timers</h2>
          </div>
          <p className="text-sm text-slate-400 mb-8">Define follow-up intervals for vendor management based on priority.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 font-bold">Priority</th>
                  <th className="pb-4 font-bold">Vendor Response</th>
                  <th className="pb-4 font-bold">Reminder</th>
                  <th className="pb-4 font-bold">Next Vendor</th>
                  <th className="pb-4 font-bold">PM Escalation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LEVELS.map((level) => (
                  <tr key={level}>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${DOT_COLORS[level]}`} />
                        <span className="text-sm font-medium capitalize">{level}</span>
                      </div>
                    </td>
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="py-4">
                        <input
                          type="number"
                          min={1}
                          value={values![level][col.key]}
                          onChange={(e) => handleChange(level, col.key, Number(e.target.value))}
                          className="w-16 p-1 text-center text-xs border border-slate-200 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {state && !state.success && "error" in state && state.error && (
            <p className="text-red-500 text-sm mt-4">{String(state.error)}</p>
          )}
          {state?.success && (
            <p className="text-green-600 text-sm mt-4">Timers updated.</p>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-orange-500 hover:opacity-90 text-white px-6 py-2 rounded-lg font-bold text-sm transition-opacity shadow-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}
