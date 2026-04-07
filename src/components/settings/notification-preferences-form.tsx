"use client";

import { useActionState, useState, useEffect } from "react";
import { updateNotificationPrefsAction } from "@/app/(dashboard)/settings/actions";
import { toast } from "sonner";

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
  const [quietStart, setQuietStart] = useState(defaults.quietHoursStart ?? "22:00");
  const [quietEnd, setQuietEnd] = useState(defaults.quietHoursEnd ?? "07:00");
  const [touched, setTouched] = useState(false);

  const quietError = touched && quietStart === quietEnd ? "Start and end times cannot be the same" : undefined;

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return await updateNotificationPrefsAction(formData);
    },
    null,
  );

  useEffect(() => {
    if (state?.success) toast.success("Notification preferences saved.");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow">
      <form action={formAction}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-caution text-2xl">notifications_active</span>
            <h2 className="text-xl font-bold text-on-surface tracking-tight">Notification Preferences</h2>
          </div>
          <p className="text-sm text-on-surface-variant mb-10 leading-relaxed">Manage how and when you receive agent activity updates and system alerts.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-3 col-span-2">
              <label className="text-sm font-bold text-on-surface uppercase tracking-widest">Communication Channels</label>
              <select
                className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded focus:ring-1 focus:ring-accent focus:border-accent font-bold text-on-surface"
                name="urgentChannel"
                defaultValue={defaults.urgentChannel}
              >
                <option value="sms">SMS/Email</option>
                <option value="email">Email Only</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface uppercase tracking-widest">Quiet Hours Start</label>
              <input
                className={`w-full px-4 py-3 bg-surface-container-low/50 border rounded focus:ring-1 focus:ring-accent focus:border-accent font-bold text-on-surface ${quietError ? "border-error" : "border-outline-variant/20"}`}
                type="time"
                name="quietHoursStart"
                value={quietStart}
                onChange={(e) => { setQuietStart(e.target.value); setTouched(true); }}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface uppercase tracking-widest">Quiet Hours End</label>
              <input
                className={`w-full px-4 py-3 bg-surface-container-low/50 border rounded focus:ring-1 focus:ring-accent focus:border-accent font-bold text-on-surface ${quietError ? "border-error" : "border-outline-variant/20"}`}
                type="time"
                name="quietHoursEnd"
                value={quietEnd}
                onChange={(e) => { setQuietEnd(e.target.value); setTouched(true); }}
              />
              {quietError && (
                <p className="text-xs text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {quietError}
                </p>
              )}
            </div>
            <div className="space-y-3 col-span-2">
              <label className="text-sm font-bold text-on-surface uppercase tracking-widest">System Timezone</label>
              <select
                className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded focus:ring-1 focus:ring-accent focus:border-accent font-bold text-on-surface"
                name="quietHoursTimezone"
                defaultValue={defaults.quietHoursTimezone}
              >
                <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                <option value="America/New_York">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                <option value="UTC">(GMT+00:00) UTC / London</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low border-t border-outline-variant/20 px-8 py-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending || Boolean(quietError)}
            className="bg-primary hover:bg-primary/90 text-on-primary px-8 py-2 rounded font-bold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
