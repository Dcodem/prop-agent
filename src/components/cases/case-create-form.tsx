"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCaseAction } from "@/app/(dashboard)/cases/new/actions";

const CATEGORIES = [
  { value: "maintenance", label: "Maintenance" },
  { value: "noise_complaint", label: "Noise Complaint" },
  { value: "lease_question", label: "Lease Question" },
  { value: "payment", label: "Payment" },
  { value: "emergency", label: "Emergency" },
  { value: "general", label: "General" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "emergency", label: "Emergency" },
];

interface CaseCreateFormProps {
  properties: { id: string; address: string }[];
  vendors: { id: string; name: string; trade: string }[];
}

export function CaseCreateForm({ properties, vendors }: CaseCreateFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCaseAction, null);
  const [selectedPriority, setSelectedPriority] = useState("medium");

  useEffect(() => {
    if (state && "success" in state && state.success && state.caseId) {
      router.push(`/cases/${state.caseId}`);
    }
  }, [state, router]);

  const getPriorityClasses = (value: string) => {
    if (selectedPriority !== value) {
      return "border-[#bdc9ca]/20 hover:border-[#006872]/40";
    }
    if (value === "emergency") {
      return "border-[#ba1a1a] text-[#ba1a1a] bg-[#ffdad6]/20";
    }
    return "border-[#006872] bg-[#00838f] text-white";
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-[#6e797b]">
        <Link href="/cases" className="hover:text-[#006872] cursor-pointer">Maintenance</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-[#0d1c2e]">Log New Entry</span>
      </nav>

      {/* Header */}
      <h1 className="text-4xl font-extrabold tracking-tight text-[#0d1c2e] mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Log Maintenance Entry</h1>
      <p className="text-[#3e494a] max-w-2xl">Record a new maintenance request in the ledger. Provide detailed information to ensure swift resolution by our vendor partners.</p>

      {/* Error message */}
      {state && "error" in state && (
        <div className="mt-6 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#ba1a1a] px-4 py-3 rounded-[1rem] text-sm font-medium">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-12 max-w-4xl space-y-12 pb-24">
        {/* Hidden priority field */}
        <input type="hidden" name="urgency" value={selectedPriority} />

        {/* Section 1: Basic Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-[1rem] border border-[#bdc9ca]/20">
            {/* Title — full width */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-[#0d1c2e]">Title / Subject</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. Water leaking from kitchen ceiling"
                className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-[1rem] focus:ring-2 focus:ring-[#006872] transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-[#0d1c2e]">Category</label>
              <select
                id="category"
                name="category"
                defaultValue="maintenance"
                className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-[1rem] focus:ring-2 focus:ring-[#006872] transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setSelectedPriority(p.value)}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-bold border-2 transition-all ${getPriorityClasses(p.value)}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Detailed Description */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Detailed Description</h2>
          </div>
          <div className="bg-white p-8 rounded-[1rem] border border-[#bdc9ca]/20">
            <div className="space-y-2">
              <label htmlFor="rawMessage" className="block text-sm font-semibold text-[#0d1c2e]">Maintenance Issue Details</label>
              <textarea
                id="rawMessage"
                name="rawMessage"
                rows={5}
                required
                placeholder="Please describe the issue in detail, including when it started and any specific observations..."
                className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-[1rem] focus:ring-2 focus:ring-[#006872] transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Location */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Location</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-[1rem] border border-[#bdc9ca]/20">
            {/* Property */}
            <div className="space-y-2">
              <label htmlFor="propertyId" className="block text-sm font-semibold text-[#0d1c2e]">Property Selection</label>
              <select
                id="propertyId"
                name="propertyId"
                defaultValue=""
                className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-[1rem] focus:ring-2 focus:ring-[#006872] transition-all"
              >
                <option value="">Select Property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.address}</option>
                ))}
              </select>
            </div>

            {/* Unit Number */}
            <div className="space-y-2">
              <label htmlFor="unitNumber" className="block text-sm font-semibold text-[#0d1c2e]">Unit Number</label>
              <input
                type="text"
                id="unitNumber"
                name="unitNumber"
                placeholder="e.g. 402B"
                className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-[1rem] focus:ring-2 focus:ring-[#006872] transition-all"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Media Upload */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Media</h2>
          </div>
          <div className="bg-white p-8 rounded-[1rem] border-2 border-dashed border-[#bdc9ca] text-center space-y-4 hover:bg-[#eff4ff] transition-colors cursor-pointer">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#c5e9ee]/50 flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[#006872] text-2xl">cloud_upload</span>
            </div>
            <div>
              <p className="font-bold text-[#0d1c2e]">Click to upload or drag and drop</p>
              <p className="text-sm text-[#3e494a]">SVG, PNG, JPG or MP4 (max. 50MB)</p>
            </div>
            <input className="hidden" type="file" />
          </div>
        </section>

        {/* Section 5: Assignment */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_ind</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Assignment (Optional)</h2>
          </div>
          <div className="bg-white p-8 rounded-[1rem] border border-[#bdc9ca]/20">
            <div className="space-y-2">
              <label htmlFor="vendorId" className="block text-sm font-semibold text-[#0d1c2e]">Assign Vendor</label>
              <div className="relative">
                <select
                  id="vendorId"
                  name="vendorId"
                  defaultValue=""
                  className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-[1rem] focus:ring-2 focus:ring-[#006872] transition-all appearance-none"
                >
                  <option value="">Search for a vendor...</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} — {v.trade}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e797b]">search</span>
              </div>
              <p className="text-xs text-[#3e494a] mt-2 italic">Leave empty to auto-assign based on category.</p>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-[#bdc9ca]/20">
          <Link href="/cases" className="px-8 py-3 rounded-lg font-bold text-[#006872] hover:bg-[#eff4ff] transition-all">Cancel</Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-12 py-3 bg-[#00838f] text-white rounded-lg font-bold shadow-lg shadow-[#006872]/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">save</span>
            {isPending ? "Submitting..." : "Submit Log"}
          </button>
        </div>
      </form>
    </>
  );
}
