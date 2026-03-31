"use client";

import { useActionState, useState } from "react";
import { updateConfidenceThresholdsAction } from "@/app/(dashboard)/settings/actions";

type ActionState = { success: boolean; error?: string } | null;

export function ConfidenceThresholdsForm({
  defaults,
}: {
  defaults: { high: number; medium: number };
}) {
  const [high, setHigh] = useState(defaults.high);
  const [medium, setMedium] = useState(defaults.medium);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return await updateConfidenceThresholdsAction(formData);
    },
    null,
  );

  return (
    <section className="bg-white border border-slate-200 shadow-sm">
      <form action={formAction}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-cyan-700 text-2xl">psychology</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Confidence Thresholds</h2>
          </div>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed">Set the confidence score requirements for AI-driven case resolutions. Higher scores increase accuracy but may require more manual intervention.</p>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">High Confidence</label>
                <span className="px-4 py-1.5 bg-cyan-50 text-cyan-800 border border-cyan-100 rounded text-sm font-bold">{high.toFixed(2)}</span>
              </div>
              <input
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-cyan-700"
                max="1"
                min="0"
                step="0.05"
                type="range"
                name="high"
                value={high}
                onChange={(e) => setHigh(Number(e.target.value))}
              />
              <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Medium Confidence</label>
                <span className="px-4 py-1.5 bg-slate-50 text-slate-700 border border-slate-100 rounded text-sm font-bold">{medium.toFixed(2)}</span>
              </div>
              <input
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-cyan-700"
                max="1"
                min="0"
                step="0.05"
                type="range"
                name="medium"
                value={medium}
                onChange={(e) => setMedium(Number(e.target.value))}
              />
            </div>
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
