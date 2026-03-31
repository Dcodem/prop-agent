"use client";

import { useState, useTransition } from "react";
import { updateProfileAction, resetPasswordAction } from "./actions";

interface ProfileClientProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    role: string;
  };
  orgName: string;
}

export function ProfileClient({ user, orgName }: ProfileClientProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone ?? "");
  const [saving, startSave] = useTransition();
  const [resetting, startReset] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleSave() {
    setSaveError(null);
    const fd = new FormData();
    fd.set("name", editName);
    fd.set("phone", editPhone);
    startSave(async () => {
      const result = await updateProfileAction(fd);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setShowEditModal(false);
      }
    });
  }

  function handleResetPassword() {
    setResetMsg(null);
    startReset(async () => {
      const result = await resetPasswordAction();
      if (result.error) {
        setResetMsg(`Error: ${result.error}`);
      } else {
        setResetMsg("Password reset email sent. Check your inbox.");
      }
    });
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto p-8 lg:p-12">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div className="flex items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-2xl bg-surface-container-high border-4 border-white">
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-on-primary text-4xl font-extrabold">
                  {initials}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-lg text-on-primary shadow-lg">
                <span className="material-symbols-outlined text-sm">verified</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold block mb-1">PropAgent Manager</span>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface leading-none mb-2">{user.name}</h1>
              <p className="text-on-surface-variant font-medium flex items-center gap-2">
                {user.role === "owner" ? "Account Owner" : user.role}
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="text-on-surface-variant">{orgName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditName(user.name);
              setEditPhone(user.phone ?? "");
              setSaveError(null);
              setShowEditModal(true);
            }}
            className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
        </section>

        <div className="space-y-12">
          {/* PropAgent Overview */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border-l-4 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">AI System Active</div>
                    <h2 className="text-2xl font-bold tracking-tight">PropAgent Overview</h2>
                  </div>
                  <p className="text-on-surface-variant text-sm max-w-md italic">Autonomous property management assistant currently monitoring your active listings.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-low p-5 rounded-lg border-l-2 border-primary-fixed-dim">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-3">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-lg font-bold">Active &amp; Learning</span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-5 rounded-lg border-l-2 border-primary-fixed-dim">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-3">Confidence</span>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-extrabold leading-none">94.8</span>
                    <span className="text-sm font-bold text-on-surface-variant mb-0.5">%</span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-5 rounded-lg border-l-2 border-primary-fixed-dim">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-3">Decision Speed</span>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-extrabold leading-none">1.2</span>
                    <span className="text-sm font-bold text-on-surface-variant mb-0.5">sec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
              <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
              <div>
                <h3 className="text-4xl font-black tracking-tighter">1,284</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Cases Automated</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
              <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
              <div>
                <h3 className="text-4xl font-black tracking-tighter">312<span className="text-xl font-medium">h</span></h3>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Time Saved</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary text-3xl">sentiment_very_satisfied</span>
                <span className="bg-surface-container text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">+4%</span>
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tighter">4.9</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tenant Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-surface-container-lowest rounded-xl p-8">
            <h2 className="text-xl font-bold tracking-tight mb-8">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Email Address</label>
                <div className="bg-surface-container-high p-4 rounded-lg text-on-surface font-medium border-l-2 border-transparent">
                  {user.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Phone Number</label>
                <div className="bg-surface-container-high p-4 rounded-lg text-on-surface font-medium border-l-2 border-transparent">
                  {user.phone ?? "Not set"}
                </div>
              </div>
              <div className="col-span-full space-y-4 pt-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Notification Preferences</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                      <span className="text-sm font-medium">Critical Performance Alerts</span>
                    </div>
                    <div className="w-10 h-5 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">sms</span>
                      <span className="text-sm font-medium">Tenant Communication Summaries</span>
                    </div>
                    <div className="w-10 h-5 bg-surface-container-highest rounded-full relative">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] p-8 border-t-4 border-on-surface">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">Security &amp; Access</h2>
              <div className="bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-3">
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Current Active Session</p>
                <span className="text-xs font-bold text-emerald-500">Active Session</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Password Control</p>
                    <p className="text-xs text-on-surface-variant">Last changed 4 months ago</p>
                  </div>
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="text-xs font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-lg border border-primary/20 transition-colors disabled:opacity-50"
                >
                  {resetting ? "Sending..." : "Reset Password"}
                </button>
              </div>
              <div className="flex items-center justify-between p-6 bg-emerald-50/30 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-emerald-600 font-medium">Enabled &amp; Secure</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200">Enabled</span>
              </div>
            </div>
            {resetMsg && (
              <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${resetMsg.startsWith("Error") ? "bg-error-container text-on-error-container" : "bg-success-container text-on-success-container"}`}>
                {resetMsg}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="max-w-3xl mx-auto pt-8">
            <div className="bg-error-container/10 rounded-xl p-10 border border-error/10 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 text-error">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Account Finality</h3>
              <p className="text-on-surface-variant text-sm mb-8 max-w-md mx-auto">Deactivating your PropAgent account will cease all autonomous operations and revoke access to historical performance logs.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-3 bg-surface-container-lowest text-error border border-error/30 text-xs font-bold rounded-lg hover:bg-error/5 transition-colors uppercase tracking-widest">Deactivate PropAgent</button>
                <button className="w-full sm:w-auto px-8 py-3 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-error transition-colors">Close Agent Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Full Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Email Address</label>
                <div className="w-full bg-surface-container-high p-3 rounded-lg text-outline text-sm">
                  {user.email}
                  <span className="text-xs ml-2">(managed by auth provider)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Phone Number</label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {saveError && (
              <div className="mt-4 bg-error-container text-on-error-container rounded-lg px-4 py-2 text-sm">
                {saveError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
