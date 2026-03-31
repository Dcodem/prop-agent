"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteTenantAction } from "@/app/(dashboard)/tenants/actions";
import { TenantForm } from "@/components/tenants/tenant-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatEnum, timeAgo } from "@/lib/utils";

type SerializedTenant = {
  id: string;
  propertyId: string;
  orgId: string;
  name: string;
  email: string | null;
  phone: string | null;
  unitNumber: string | null;
  leaseStart: string | null;
  leaseEnd: string | null;
  createdAt: string;
  updatedAt: string;
};

type SerializedProperty = {
  id: string;
  orgId: string;
  address: string;
  unitCount: number | null;
  type: "residential" | "commercial";
  accessInstructions: string | null;
  parkingInstructions: string | null;
  unitAccessNotes: string | null;
  specialInstructions: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
} | null;

type SerializedCase = {
  id: string;
  orgId: string;
  tenantId: string | null;
  propertyId: string | null;
  source: "email" | "sms";
  rawMessage: string;
  category: string | null;
  urgency: string | null;
  confidenceScore: number | null;
  status: string;
  spendingAuthorized: number | null;
  spendingApprovedBy: string | null;
  vendorId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  messages: {
    id: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  }[];
};

type Property = {
  id: string;
  address: string;
};

// Mock payment history data
const paymentHistory = [
  {
    date: "Oct 01, 2023",
    description: "Monthly Rent - October",
    amount: "$3,200.00",
    status: "Paid",
    statusColor: "bg-primary/10 text-primary",
  },
  {
    date: "Sep 01, 2023",
    description: "Monthly Rent - September",
    amount: "$3,200.00",
    status: "Paid",
    statusColor: "bg-primary/10 text-primary",
  },
  {
    date: "Aug 03, 2023",
    description: "Monthly Rent - August",
    amount: "$3,200.00",
    status: "Late",
    statusColor: "bg-error/10 text-error",
  },
];

export function TenantDetailClient({
  tenant,
  property,
  cases,
  properties,
}: {
  tenant: SerializedTenant;
  property: SerializedProperty;
  cases: SerializedCase[];
  properties: Property[];
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const tenantForForm = {
    ...tenant,
    leaseStart: tenant.leaseStart ? new Date(tenant.leaseStart) : null,
    leaseEnd: tenant.leaseEnd ? new Date(tenant.leaseEnd) : null,
  };

  const leaseEndFormatted = tenant.leaseEnd
    ? new Date(tenant.leaseEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const activeCases = cases.filter(
    (c) => !["resolved", "closed"].includes(c.status)
  );

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteTenantAction(tenant.id);
    });
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      {/* Hero Section: Asymmetric Editorial Style */}
      <section className="grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Link
            href="/tenants"
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-sm mb-6 transition-colors group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to Tenants
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <span className="bg-surface-container text-on-surface-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              Resident Status
            </span>
            <span className="flex items-center gap-1.5 text-primary font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Active
            </span>
          </div>
          <h2 className="text-6xl font-extrabold tracking-tighter text-on-surface leading-none">
            {tenant.name}
          </h2>
          <p className="text-2xl font-light text-on-surface-variant font-['Plus_Jakarta_Sans']">
            {property?.address ?? "Unknown Property"} — Unit{" "}
            {tenant.unitNumber ?? "N/A"}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex justify-end">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4 rounded-xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
            <div className="w-80 h-48 rounded-xl shadow-sm bg-gradient-to-br from-primary/20 via-primary/15 to-primary-fixed/20"></div>
          </div>
        </div>
      </section>

      {/* Quick Stats: Tonal Layering */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Current Rent
          </p>
          <p className="text-3xl font-extrabold text-on-surface">
            $3,200
            <span className="text-sm font-medium text-on-surface-variant">/mo</span>
          </p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Lease End
          </p>
          <p className="text-3xl font-extrabold text-on-surface">
            {leaseEndFormatted}
          </p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Payment Status
          </p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              check_circle
            </span>
            <p className="text-3xl font-extrabold text-on-surface">Paid</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Maintenance
          </p>
          <p className="text-3xl font-extrabold text-on-surface">
            {activeCases.length}{" "}
            <span className="text-sm font-medium text-on-surface-variant">
              Requests
            </span>
          </p>
        </div>
      </section>

      {/* Main Content Area: Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lease Information & Payments (Left/Center) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Lease Terms Card */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl space-y-6">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold tracking-tight">
                Lease Information
              </h3>
              <button className="text-primary font-semibold text-sm hover:underline">
                View Full Agreement
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="label-md text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
                  Security Deposit
                </p>
                <p className="text-xl font-semibold">$3,200.00</p>
              </div>
              <div>
                <p className="label-md text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
                  Lease Term
                </p>
                <p className="text-xl font-semibold">12 Months (Fixed)</p>
              </div>
              <div className="col-span-2">
                <p className="label-md text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2">
                  Included Utilities
                </p>
                <div className="flex gap-4">
                  <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium">
                    High-speed Fiber
                  </span>
                  <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium">
                    Water &amp; Trash
                  </span>
                  <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium">
                    Gym Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table (The Architectural Ledger) */}
          <div className="bg-surface-container-lowest overflow-hidden rounded-2xl">
            <div className="p-8 pb-4">
              <h3 className="text-2xl font-bold tracking-tight">
                Payment History
              </h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {paymentHistory.map((payment, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-8 py-6 text-sm font-medium">
                      {payment.date}
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant">
                      {payment.description}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold">
                      {payment.amount}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${payment.statusColor}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">
                        download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Maintenance Requests (Right Sidebar) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">
              Active Requests
            </h3>
            <button className="bg-surface-container-high p-2 rounded-lg hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          <div className="space-y-4">
            {/* Request Card 1 */}
            {activeCases.length > 0 ? (
              activeCases.map((c) => (
                <div
                  key={c.id}
                  className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {c.category ? formatEnum(c.category) : "General"}
                    </span>
                    <span className="bg-primary-fixed text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {formatEnum(c.status)}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">
                    {c.category ? formatEnum(c.category) : "Case"}
                  </h4>
                  <p className="text-sm text-on-surface-variant mb-4">
                    {c.rawMessage.length > 100
                      ? c.rawMessage.slice(0, 100) + "..."
                      : c.rawMessage}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      event
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Submitted {timeAgo(new Date(c.createdAt))}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Static fallback cards matching Stitch design */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Plumbing
                    </span>
                    <span className="bg-primary-fixed text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      In Progress
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">Clogged Sink</h4>
                  <p className="text-sm text-on-surface-variant mb-4">
                    Kitchen island sink draining slowly. Maintenance assigned:
                    Mike R.
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      event
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Submitted 2 days ago
                    </span>
                  </div>
                </div>
                {/* Request Card 2 */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-outline-variant">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Electrical
                    </span>
                    <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Scheduled
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">Kitchen Light</h4>
                  <p className="text-sm text-on-surface-variant mb-4">
                    Under-cabinet LED strip flickering. Scheduled for Thursday
                    AM.
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      calendar_today
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Oct 26, 10:00 AM
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Contact Property Manager Glassmorphism */}
          <div className="bg-primary/5 backdrop-blur-md p-8 rounded-2xl border border-primary/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-9xl text-on-surface">
                support_agent
              </span>
            </div>
            <h4 className="text-on-surface font-bold mb-2">Need Help?</h4>
            <p className="text-sm text-on-surface-variant mb-6 relative z-10">
              Connect directly with the building management team for immediate
              assistance.
            </p>
            <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-colors relative z-10">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Sticky FAB: Contextual to Tenant Portal */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={() => setShowEditModal(true)}
          className="group flex items-center gap-2 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            chat
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold px-0 group-hover:px-2">
            Message Manager
          </span>
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <TenantForm
          properties={properties}
          tenant={tenantForForm}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Tenant"
        description={`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={isDeleting}
      />
    </div>
  );
}
