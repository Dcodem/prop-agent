"use client";

import { useState, type ReactNode } from "react";

const TABS = [
  { id: "ai", label: "AI Settings", icon: "smart_toy" },
  { id: "stages", label: "Stages", icon: "reorder" },
  { id: "labels", label: "Labels", icon: "label" },
  { id: "admin", label: "Admin", icon: "admin_panel_settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STAGES = [
  { name: "Open", color: "bg-blue-500", enabled: true },
  { name: "In Progress", color: "bg-amber-500", enabled: true },
  { name: "Waiting on Vendor", color: "bg-orange-500", enabled: true },
  { name: "Waiting on Tenant", color: "bg-purple-500", enabled: true },
  { name: "Resolved", color: "bg-green-500", enabled: true },
  { name: "Closed", color: "bg-gray-500", enabled: true },
];

const LABELS = [
  { name: "Plumbing", color: "bg-blue-500", count: 24 },
  { name: "Electrical", color: "bg-amber-500", count: 18 },
  { name: "HVAC", color: "bg-red-500", count: 12 },
  { name: "Appliance", color: "bg-emerald-500", count: 9 },
  { name: "Structural", color: "bg-orange-500", count: 6 },
  { name: "Pest Control", color: "bg-purple-500", count: 3 },
  { name: "General", color: "bg-slate-500", count: 15 },
  { name: "Other", color: "bg-gray-400", count: 7 },
];

const TEAM = [
  {
    name: "Sarah Chen",
    role: "Property Manager",
    email: "sarah@propagent.io",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    name: "Mike Rodriguez",
    role: "Maintenance Coordinator",
    email: "mike@propagent.io",
    status: "Active",
    lastActive: "15 min ago",
  },
  {
    name: "Jamie Park",
    role: "Front Desk",
    email: "jamie@propagent.io",
    status: "Invited",
    lastActive: "—",
  },
];

export function SettingsTabsClient({
  aiSettingsContent,
}: {
  aiSettingsContent: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("ai");
  const [stages, setStages] = useState(STAGES);

  function toggleStage(index: number) {
    setStages((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, enabled: !s.enabled } : s
      )
    );
  }

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-2 mb-10 bg-surface-container-low p-1.5 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-on-primary shadow-md"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "ai" && (
        <div className="space-y-10">{aiSettingsContent}</div>
      )}

      {activeTab === "stages" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Workflow Stages
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Configure the stages a case moves through from creation to
                resolution.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Stage
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
            {stages.map((stage, i) => (
              <div
                key={stage.name}
                className={`flex items-center gap-4 px-6 py-5 ${
                  i < stages.length - 1
                    ? "border-b border-outline-variant/10"
                    : ""
                } ${!stage.enabled ? "opacity-50" : ""}`}
              >
                <span className="material-symbols-outlined text-on-surface-variant cursor-grab">
                  drag_indicator
                </span>
                <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="text-sm font-bold text-on-surface flex-1">
                  {stage.name}
                </span>
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mr-4">
                  Step {i + 1}
                </span>
                <button
                  onClick={() => toggleStage(i)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    stage.enabled ? "bg-primary" : "bg-outline-variant"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      stage.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant">
            Drag to reorder stages. Disabling a stage will prevent cases from
            being moved to it.
          </p>
        </div>
      )}

      {activeTab === "labels" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Case Categories
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Manage the labels used to categorize maintenance cases.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Create Label
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LABELS.map((label) => (
              <div
                key={label.name}
                className="bg-surface-container-lowest p-5 rounded-xl hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 rounded-full ${label.color}`}
                    />
                    <span className="text-sm font-bold text-on-surface">
                      {label.name}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    edit
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-on-surface">
                  {label.count}
                </p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                  Cases
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "admin" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Team Management
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Manage user access and roles for your organization.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">
                person_add
              </span>
              Invite User
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {TEAM.map((member) => (
                  <tr
                    key={member.email}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {member.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">
                            {member.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-on-surface">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          member.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === "Active"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {member.lastActive}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          more_horiz
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">
              info
            </span>
            <div>
              <p className="text-sm font-bold text-on-surface">
                Role Permissions
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Property Managers have full access. Maintenance Coordinators can
                manage cases and vendors. Front Desk can view and create cases
                only.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
