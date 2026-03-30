"use client";

import { useState, useActionState } from "react";
import { updateNotificationPrefsAction } from "@/app/(dashboard)/settings/actions";

interface NotificationPrefs {
  urgentChannel: string;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  quietHoursTimezone: string;
}

interface NotificationPreferencesFormProps {
  currentPrefs: NotificationPrefs | null;
}

const TIMEZONE_OPTIONS = [
  { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time (US & Canada)" },
  { value: "America/New_York", label: "(GMT-05:00) Eastern Time (US & Canada)" },
  { value: "UTC", label: "(GMT+00:00) UTC / London" },
];

const CHANNEL_OPTIONS = [
  { value: "sms_email", label: "SMS/Email" },
  { value: "email", label: "Email Only" },
  { value: "sms", label: "SMS Only" },
  { value: "push", label: "Push Notification Only" },
];

export function NotificationPreferencesForm({ currentPrefs }: NotificationPreferencesFormProps) {
  const defaults: NotificationPrefs = {
    urgentChannel: "sms_email",
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    quietHoursTimezone: "America/Los_Angeles",
  };

  const prefs = currentPrefs ?? defaults;

  const [urgentChannel, setUrgentChannel] = useState(prefs.urgentChannel);
  const [quietStart, setQuietStart] = useState(prefs.quietHoursStart ?? "22:00");
  const [quietEnd, setQuietEnd] = useState(prefs.quietHoursEnd ?? "07:00");
  const [timezone, setTimezone] = useState(prefs.quietHoursTimezone);

  const [state, formAction, isPending] = useActionState(
    async (_prev: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await updateNotificationPrefsAction(formData);
      return result;
    },
    null,
  );

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <form action={formAction}>
        <input type="hidden" name="urgentChannel" value={urgentChannel} />
        <input type="hidden" name="quietHoursStart" value={quietStart} />
        <input type="hidden" name="quietHoursEnd" value={quietEnd} />
        <input type="hidden" name="quietHoursTimezone" value={timezone} />

        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-600 text-xl">notifications_active</span>
            <h2 className="text-lg font-bold text-slate-800">Notification Preferences</h2>
          </div>
          <p className="text-sm text-slate-400 mb-8">Manage how and when you receive agent activity updates.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Communication Channels - col-span-2 */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold text-slate-700">Communication Channels</label>
              <select
                value={urgentChannel}
                onChange={(e) => setUrgentChannel(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                {CHANNEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quiet Hours Start */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Quiet Hours Start</label>
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              />
            </div>

            {/* Quiet Hours End */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Quiet Hours End</label>
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              />
            </div>

            {/* System Timezone - col-span-2 */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold text-slate-700">System Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                {TIMEZONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state && !state.success && state.error && (
            <p className="text-red-500 text-sm mt-4">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-green-600 text-sm mt-4">Preferences updated.</p>
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
