"use client";

import { useState, useActionState } from "react";
import { updateConfidenceThresholdsAction } from "@/app/(dashboard)/settings/actions";

interface ConfidenceThresholdsFormProps {
  currentHigh: number;
  currentMedium: number;
}

export function ConfidenceThresholdsForm({
  currentHigh,
  currentMedium,
}: ConfidenceThresholdsFormProps) {
  const [high, setHigh] = useState(currentHigh);
  const [medium, setMedium] = useState(currentMedium);

  const [state, formAction, isPending] = useActionState(
    async (_prev: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateConfidenceThresholdsAction(formData);
      return result;
    },
    null,
  );

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <form action={formAction}>
        <input type="hidden" name="high" value={high} />
        <input type="hidden" name="medium" value={medium} />

        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-600 text-xl">psychology</span>
            <h2 className="text-lg font-bold text-slate-800">Confidence Thresholds</h2>
          </div>
          <p className="text-sm text-slate-400 mb-8">Set the confidence score requirements for AI-driven case resolutions.</p>

          <div className="space-y-8">
            {/* High confidence slider */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-slate-700">High Confidence</label>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                  {high.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={high}
                onChange={(e) => setHigh(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>

            {/* Medium confidence slider */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-slate-700">Medium Confidence</label>
                <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-sm font-bold">
                  {medium.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={medium}
                onChange={(e) => setMedium(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {state && !state.success && state.error && (
            <p className="text-red-500 text-sm mt-4">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-green-600 text-sm mt-4">Thresholds updated.</p>
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
