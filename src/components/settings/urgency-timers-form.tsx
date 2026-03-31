"use client";

import { useActionState } from "react";
import { updateUrgencyTimersAction } from "@/app/(dashboard)/settings/actions";

type ActionState = { success: boolean; error?: string } | null;

type TimerRow = {
  vendorResponse: number;
  reminder: number;
  nextVendor: number;
  pmEscalation: number;
};

type TimerDefaults = {
  critical: TimerRow;
  high: TimerRow;
  medium: TimerRow;
  low: TimerRow;
};

const LEVELS = [
  { key: "critical", label: "Critical", dotColor: "bg-red-600" },
  { key: "high", label: "High", dotColor: "bg-orange-500" },
  { key: "medium", label: "Medium", dotColor: "bg-yellow-500" },
  { key: "low", label: "Low", dotColor: "bg-emerald-500" },
] as const;

export function UrgencyTimersForm({
  defaults,
}: {
  defaults: TimerDefaults;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return await updateUrgencyTimersAction(formData);
    },
    null,
  );

  return (
    <section className="bg-white border border-slate-200 shadow-sm">
      <form action={formAction}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-cyan-700 text-2xl">timer</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Urgency Response Timers</h2>
          </div>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed">Define follow-up intervals (in minutes) for vendor management based on priority.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="pb-4">Priority</th>
                  <th className="pb-4">Response</th>
                  <th className="pb-4">Reminder</th>
                  <th className="pb-4">Next Vendor</th>
                  <th className="pb-4">Escalation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LEVELS.map((level) => (
                  <tr key={level.key} className="group">
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 ${level.dotColor}`} />
                        <span className="text-xs font-bold text-slate-900 uppercase">{level.label}</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <input
                        className="w-20 p-2 text-center text-xs font-bold border border-slate-200 rounded bg-slate-50/30"
                        type="number"
                        name={`${level.key}.vendorResponse`}
                        defaultValue={defaults[level.key].vendorResponse}
                      />
                    </td>
                    <td className="py-5">
                      <input
                        className="w-20 p-2 text-center text-xs font-bold border border-slate-200 rounded bg-slate-50/30"
                        type="number"
                        name={`${level.key}.reminder`}
                        defaultValue={defaults[level.key].reminder}
                      />
                    </td>
                    <td className="py-5">
                      <input
                        className="w-20 p-2 text-center text-xs font-bold border border-slate-200 rounded bg-slate-50/30"
                        type="number"
                        name={`${level.key}.nextVendor`}
                        defaultValue={defaults[level.key].nextVendor}
                      />
                    </td>
                    <td className="py-5">
                      <input
                        className="w-20 p-2 text-center text-xs font-bold border border-slate-200 rounded bg-slate-50/30"
                        type="number"
                        name={`${level.key}.pmEscalation`}
                        defaultValue={defaults[level.key].pmEscalation}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {state?.error && (
            <p className="mt-4 text-sm text-red-600 font-medium">{state.error}</p>
          )}
          {state?.success && (
            <p className="mt-4 text-sm text-emerald-600 font-medium">Saved successfully.</p>
          )}
        </div>
        <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-cyan-800 hover:bg-cyan-900 text-white px-8 py-2 rounded font-bold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
