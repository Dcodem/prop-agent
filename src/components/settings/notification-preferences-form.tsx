"use client";

import { useActionState } from "react";
import { updateNotificationPrefsAction } from "@/app/(dashboard)/settings/actions";

type ActionState = { success: boolean; error?: string } | null;

type NotificationPrefs = {
  urgentChannel: "sms" | "email";
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  quietHoursTimezone: string;
};

export function NotificationPreferencesForm({
  defaults,
}: {
  defaults: NotificationPrefs;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return await updateNotificationPrefsAction(formData);
    },
    null,
  );

  return (
    <section className="bg-white border border-slate-200 shadow-sm">
      <form action={formAction}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-cyan-700 text-2xl">notifications_active</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notification Preferences</h2>
          </div>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed">Manage how and when you receive agent activity updates and system alerts.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-3 col-span-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Communication Channels</label>
              <select
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-bold text-slate-900"
                name="urgentChannel"
                defaultValue={defaults.urgentChannel}
              >
                <option value="sms">SMS/Email</option>
                <option value="email">Email Only</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Quiet Hours Start</label>
              <input
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-bold text-slate-900"
                type="time"
                name="quietHoursStart"
                defaultValue={defaults.quietHoursStart ?? "22:00"}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Quiet Hours End</label>
              <input
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-bold text-slate-900"
                type="time"
                name="quietHoursEnd"
                defaultValue={defaults.quietHoursEnd ?? "07:00"}
              />
            </div>
            <div className="space-y-3 col-span-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">System Timezone</label>
              <select
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-bold text-slate-900"
                name="quietHoursTimezone"
                defaultValue={defaults.quietHoursTimezone}
              >
                <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                <option value="America/New_York">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                <option value="UTC">(GMT+00:00) UTC / London</option>
              </select>
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
