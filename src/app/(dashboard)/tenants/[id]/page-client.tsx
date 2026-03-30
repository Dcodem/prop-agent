"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { TenantForm } from "@/components/tenants/tenant-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteTenantAction } from "@/app/(dashboard)/tenants/actions";
import { formatEnum, timeAgo } from "@/lib/utils";

interface TenantDetailClientProps {
  tenant: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    propertyId: string;
    unitNumber: string | null;
    leaseStart: Date | null;
    leaseEnd: Date | null;
  };
  property: { id: string; address: string } | null;
  cases: {
    id: string;
    status: string;
    urgency: string | null;
    category: string | null;
    rawMessage: string;
    createdAt: string;
  }[];
  messages: {
    id: string;
    direction: string;
    channel: string;
    body: string;
    createdAt: string;
  }[];
}

// Mock payment history (not in DB)
const mockPayments = [
  { date: "Mar 1, 2026", description: "Monthly Rent - March", amount: "$3,200.00", status: "Paid" },
  { date: "Feb 1, 2026", description: "Monthly Rent - February", amount: "$3,200.00", status: "Paid" },
  { date: "Jan 3, 2026", description: "Monthly Rent - January", amount: "$3,200.00", status: "Late" },
  { date: "Dec 1, 2025", description: "Monthly Rent - December", amount: "$3,200.00", status: "Paid" },
  { date: "Nov 1, 2025", description: "Monthly Rent - November", amount: "$3,200.00", status: "Paid" },
];

export function TenantDetailClient({ tenant, property, cases, messages }: TenantDetailClientProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const properties = property ? [property] : [];

  function handleDelete() {
    startTransition(async () => {
      await deleteTenantAction(tenant.id);
    });
  }

  const activeCases = cases.filter(
    (c) => c.status !== "resolved" && c.status !== "closed"
  );

  const leaseEndDate = tenant.leaseEnd ? new Date(tenant.leaseEnd) : null;
  const leaseStartDate = tenant.leaseStart ? new Date(tenant.leaseStart) : null;

  // Compute lease term string
  let leaseTerm = "-";
  if (leaseStartDate && leaseEndDate) {
    const months = Math.round(
      (leaseEndDate.getTime() - leaseStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    leaseTerm = `${months} Months`;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 min-h-screen">
      {/* ── Hero Section: Asymmetric Editorial Style ── */}
      <section className="grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Back button + edit/delete actions row */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/tenants"
              className="flex items-center gap-2 text-[#006872] hover:text-[#006872]/80 font-bold text-sm transition-colors group"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to Tenants
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="p-2 text-[#3e494a] hover:text-[#006872] hover:bg-[#006872]/5 rounded-lg transition-colors"
                title="Edit Tenant"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="p-2 text-[#3e494a] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/5 rounded-lg transition-colors"
                title="Delete Tenant"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>

          {/* Resident badge */}
          <div className="flex items-center gap-4 mb-2">
            <span className="bg-[#dde3eb] text-[#5f656c] px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              Resident Status
            </span>
            <span className="flex items-center gap-1.5 text-[#006872] font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-[#006872] animate-pulse"></span>
              Active
            </span>
          </div>

          {/* Tenant name */}
          <h2 className="text-6xl font-extrabold tracking-tighter text-[#191c1e] leading-none">
            {tenant.name}
          </h2>

          {/* Unit subtitle */}
          <p className="text-2xl font-light text-[#3e494a]">
            {tenant.unitNumber ? `Unit ${tenant.unitNumber}` : ""}
            {tenant.unitNumber && property ? " \u2014 " : ""}
            {property?.address ?? ""}
          </p>
        </div>

        {/* Right 4 cols - decorative image placeholder */}
        <div className="col-span-12 lg:col-span-4 hidden lg:flex justify-end">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#006872]/10 translate-x-4 translate-y-4 rounded-xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
            <div className="w-80 h-48 rounded-xl shadow-sm bg-gradient-to-br from-[#006872]/20 via-[#006872]/10 to-[#dde3eb]/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-[#006872]/30">apartment</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Stats: Tonal Layering ── */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current Rent */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-[#006872]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e494a] mb-2">Current Rent</p>
          <p className="text-3xl font-extrabold text-[#191c1e]">$3,200<span className="text-sm font-medium text-[#3e494a]">/mo</span></p>
        </div>
        {/* Lease End */}
        <div className="bg-[#f2f4f6] p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e494a] mb-2">Lease End</p>
          <p className="text-3xl font-extrabold text-[#191c1e]">
            {leaseEndDate ? leaseEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
          </p>
        </div>
        {/* Payment Status */}
        <div className="bg-[#f2f4f6] p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e494a] mb-2">Payment Status</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006872]">check_circle</span>
            <p className="text-3xl font-extrabold text-[#191c1e]">Paid</p>
          </div>
        </div>
        {/* Maintenance */}
        <div className="bg-[#f2f4f6] p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e494a] mb-2">Maintenance</p>
          <p className="text-3xl font-extrabold text-[#191c1e]">{activeCases.length} <span className="text-sm font-medium text-[#3e494a]">Requests</span></p>
        </div>
      </section>

      {/* ── Main Content Area: Bento Style ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          {/* Lease Terms Card */}
          <div className="bg-white p-8 rounded-2xl space-y-6">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold tracking-tight">Lease Information</h3>
              <button className="text-[#006872] font-semibold text-sm hover:underline">View Full Agreement</button>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#3e494a] tracking-widest mb-1">Security Deposit</p>
                <p className="text-xl font-semibold">$3,200.00</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#3e494a] tracking-widest mb-1">Lease Term</p>
                <p className="text-xl font-semibold">{leaseTerm}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-[#3e494a] tracking-widest mb-2">Included Utilities</p>
                <div className="flex gap-4">
                  {["High-speed Fiber", "Water & Trash", "Gym Access"].map((util) => (
                    <span
                      key={util}
                      className="bg-[#e6e8ea] px-3 py-1 rounded text-xs font-medium"
                    >
                      {util}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white overflow-hidden rounded-2xl">
            <div className="p-8 pb-4">
              <h3 className="text-2xl font-bold tracking-tight">Payment History</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-[#f2f4f6] text-[10px] font-bold uppercase tracking-widest text-[#3e494a]">
                <tr>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPayments.map((p, i) => (
                  <tr key={i} className="group hover:bg-[#f2f4f6]/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-medium">{p.date}</td>
                    <td className="px-8 py-6 text-sm text-[#3e494a]">{p.description}</td>
                    <td className="px-8 py-6 text-sm font-bold">{p.amount}</td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.status === "Paid"
                            ? "bg-[#006872]/10 text-[#006872]"
                            : "bg-[#ba1a1a]/10 text-[#ba1a1a]"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="material-symbols-outlined text-[#3e494a] hover:text-[#006872]">download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1/3: Active Maintenance Requests */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Active Requests</h3>
            <button className="bg-[#e6e8ea] p-2 rounded-lg hover:bg-[#e0e3e5] transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>

          {activeCases.length === 0 ? (
            <p className="text-sm text-[#3e494a]">No active maintenance requests.</p>
          ) : (
            <div className="space-y-4">
              {activeCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-cyan-500 block hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    {c.category && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#3e494a]">
                        {formatEnum(c.category)}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        c.status === "in_progress"
                          ? "bg-cyan-50 text-cyan-700"
                          : c.status === "open"
                          ? "bg-cyan-50 text-cyan-700"
                          : c.status === "waiting_on_vendor" || c.status === "waiting_on_tenant"
                          ? "bg-[#ffdcc5] text-[#703801]"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formatEnum(c.status)}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">
                    {c.rawMessage.length > 30
                      ? c.rawMessage.slice(0, 30) + "..."
                      : c.rawMessage}
                  </h4>
                  <p className="text-sm text-[#3e494a] mb-4">
                    {c.rawMessage.length > 80
                      ? c.rawMessage.slice(0, 80) + "..."
                      : c.rawMessage}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                    <span className="material-symbols-outlined text-[#3e494a] text-sm">event</span>
                    <span className="text-xs text-[#3e494a]">
                      {timeAgo(new Date(c.createdAt))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Contact Property Manager - Glassmorphism */}
          <div className="bg-cyan-900/5 backdrop-blur-md p-8 rounded-2xl border border-cyan-900/5 relative overflow-hidden group">
            <span className="material-symbols-outlined text-9xl text-cyan-900 absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">support_agent</span>
            <h4 className="text-cyan-900 font-bold mb-2">Need Help?</h4>
            <p className="text-sm text-cyan-800/80 mb-6 relative z-10">
              Connect directly with the building management team for immediate assistance.
            </p>
            <button className="w-full bg-cyan-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-cyan-950 transition-colors relative z-10">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* ── Sticky FAB: Contextual to Tenant Portal ── */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="group flex items-center gap-2 bg-[#00838f] text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold px-0 group-hover:px-2">Message Manager</span>
        </button>
      </div>

      {/* ── Modals ── */}
      {showEdit && (
        <TenantForm
          tenant={tenant}
          properties={properties}
          onClose={() => setShowEdit(false)}
        />
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Tenant"
        description={`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`}
        loading={isPending}
      />
    </div>
  );
}
