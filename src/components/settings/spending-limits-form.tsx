"use client";

import { useState, useActionState } from "react";
import { updateSpendingLimitsAction } from "@/app/(dashboard)/settings/actions";

interface SpendingLimitsFormProps {
  currentSpending: number;
  currentEmergency: number;
}

export function SpendingLimitsForm({
  currentSpending,
  currentEmergency,
}: SpendingLimitsFormProps) {
  const [spending, setSpending] = useState(currentSpending / 100);
  const [emergency, setEmergency] = useState(currentEmergency / 100);

  const [state, formAction, isPending] = useActionState(
    async (_prev: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateSpendingLimitsAction(formData);
      return result;
    },
    null,
  );

  // Format as dollar string with commas and two decimals
  const formatDollar = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <form action={formAction}>
        <input type="hidden" name="spendingLimit" value={Math.round(spending * 100)} />
        <input type="hidden" name="emergencySpendingLimit" value={Math.round(emergency * 100)} />

        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-600 text-xl">payments</span>
            <h2 className="text-lg font-bold text-slate-800">Spending Limits</h2>
          </div>
          <p className="text-sm text-slate-400 mb-8">Establish maximum budgets for autonomous agent spending.</p>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Default Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  value={formatDollar(spending)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, "");
                    const num = parseFloat(raw);
                    if (!isNaN(num)) setSpending(num);
                  }}
                  className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Emergency Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  value={formatDollar(emergency)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, "");
                    const num = parseFloat(raw);
                    if (!isNaN(num)) setEmergency(num);
                  }}
                  className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>
            </div>
          </div>

          {state && !state.success && state.error && (
            <p className="text-red-500 text-sm mt-4">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-green-600 text-sm mt-4">Spending limits updated.</p>
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
