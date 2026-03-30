import { getOrgId, getCurrentUser } from "@/lib/db/queries/helpers";
import { getOrganization } from "@/lib/db/queries/organizations";
import { ConfidenceThresholdsForm } from "@/components/settings/confidence-thresholds-form";
import { SpendingLimitsForm } from "@/components/settings/spending-limits-form";
import { UrgencyTimersForm } from "@/components/settings/urgency-timers-form";
import { NotificationPreferencesForm } from "@/components/settings/notification-preferences-form";

export default async function SettingsPage() {
  const orgId = await getOrgId();
  const [org, user] = await Promise.all([
    getOrganization(orgId),
    getCurrentUser(),
  ]);

  if (!org || !user) return null;

  return (
    <div className="max-w-[768px] mx-auto py-12 px-6">
      <div className="mb-10">
        <div className="inline-block px-3 py-1 rounded-full bg-[#c5e9ee] text-[#2a4c50] text-xs font-bold mb-3 tracking-wide uppercase">Configuration</div>
        <h1 className="text-3xl font-extrabold text-[#0d1c2e] tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>Settings</h1>
        <p className="text-[#3e494a] mt-1">Configure your AI agent&apos;s behavior and preferences</p>
      </div>

      <div className="space-y-6">
        <ConfidenceThresholdsForm
          currentHigh={org.confidenceThresholds?.high ?? 0.85}
          currentMedium={org.confidenceThresholds?.medium ?? 0.5}
        />
        <SpendingLimitsForm
          currentSpending={org.spendingLimit ?? 50000}
          currentEmergency={org.emergencySpendingLimit ?? 100000}
        />
        <UrgencyTimersForm currentTimers={org.defaultUrgencyTimers ?? null} />
        <NotificationPreferencesForm currentPrefs={user.notificationPreferences} />
      </div>

      <footer className="mt-12 text-center">
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">PropAgent AI Dashboard v2.4.0</p>
      </footer>
    </div>
  );
}
