"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createCaseAction } from "@/app/(dashboard)/cases/new/actions";
import type { Property, Vendor } from "@/lib/db/schema";

interface CaseCreateFormProps {
  properties: Property[];
  vendors: Vendor[];
}

export function CaseCreateForm({ properties, vendors }: CaseCreateFormProps) {
  const [urgency, setUrgency] = useState<string>("medium");
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("urgency", urgency);
      await createCaseAction(formData);
    },
    null
  );

  return (
    <div className="flex-1 p-8 bg-[#f8f9ff]">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-[#6e797b]">
        <Link href="/cases" className="hover:text-[#006872] cursor-pointer">Maintenance</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-[#0d1c2e]">Log New Entry</span>
      </nav>
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0d1c2e] mb-2">Log Maintenance Entry</h1>
        <p className="text-[#3e494a] max-w-2xl">Record a new maintenance request in the ledger. Provide detailed information to ensure swift resolution by our vendor partners.</p>
      </div>
      {/* Form Layout (Architectural Ledger Style) */}
      <form action={formAction} className="max-w-4xl space-y-12 pb-24">
        {/* Section 1: Basic Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            </div>
            <h2 className="text-xl font-bold font-headline">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-[#bdc9ca]/20">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Title / Subject</label>
              <input name="rawMessage" required className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-2xl focus:ring-2 focus:ring-[#006872] transition-all" placeholder="e.g. Water leaking from kitchen ceiling" type="text" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Category</label>
              <select name="category" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-2xl focus:ring-2 focus:ring-[#006872] appearance-none">
                <option value="">Select Category</option>
                <option value="maintenance">Plumbing</option>
                <option value="noise_complaint">Electrical</option>
                <option value="emergency">HVAC</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Priority</label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-bold border-2 transition-all ${urgency === "low" ? "border-[#006872] bg-[#00838f] text-white" : "border-[#bdc9ca]/20 hover:border-[#006872]/40"}`}
                  type="button"
                  onClick={() => setUrgency("low")}
                >Low</button>
                <button
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-bold border-2 transition-all ${urgency === "medium" ? "border-[#006872] bg-[#00838f] text-white" : "border-[#bdc9ca]/20 hover:border-[#006872]/40"}`}
                  type="button"
                  onClick={() => setUrgency("medium")}
                >Medium</button>
                <button
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-bold border-2 transition-all ${urgency === "high" ? "border-[#006872] bg-[#00838f] text-white" : "border-[#bdc9ca]/20 hover:border-[#ba1a1a]/40"}`}
                  type="button"
                  onClick={() => setUrgency("high")}
                >High</button>
                <button
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-bold border-2 transition-all ${urgency === "critical" ? "border-[#ba1a1a] text-[#ba1a1a] bg-[#ffdad6]/20" : "border-[#ba1a1a] text-[#ba1a1a] bg-[#ffdad6]/20"}`}
                  type="button"
                  onClick={() => setUrgency("critical")}
                >Emergency</button>
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
            <h2 className="text-xl font-bold font-headline">Detailed Description</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#bdc9ca]/20">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Maintenance Issue Details</label>
              <textarea name="description" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-2xl focus:ring-2 focus:ring-[#006872] transition-all resize-none" placeholder="Please describe the issue in detail, including when it started and any specific observations..." rows={5}></textarea>
            </div>
          </div>
        </section>
        {/* Section 3: Location */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <h2 className="text-xl font-bold font-headline">Location</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-[#bdc9ca]/20">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Property Selection</label>
              <select name="propertyId" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-2xl focus:ring-2 focus:ring-[#006872] appearance-none">
                <option value="">Select Property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.address}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Unit Number</label>
              <input name="unitNumber" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-2xl focus:ring-2 focus:ring-[#006872] transition-all" placeholder="e.g. 402B" type="text" />
            </div>
          </div>
        </section>
        {/* Section 4: Media Upload */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c5e9ee] flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-[#486a6f]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>
            <h2 className="text-xl font-bold font-headline">Media</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-[#bdc9ca] text-center space-y-4 hover:bg-[#eff4ff] transition-colors cursor-pointer">
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
            <h2 className="text-xl font-bold font-headline">Assignment (Optional)</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#bdc9ca]/20">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0d1c2e]">Assign Vendor</label>
              <div className="relative">
                <select name="vendorId" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-2xl focus:ring-2 focus:ring-[#006872] appearance-none">
                  <option value="">Search for a vendor...</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
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
          <Link href="/cases" className="px-8 py-3 rounded-lg font-bold text-[#006872] hover:bg-[#eff4ff] transition-all">
            Cancel
          </Link>
          <button disabled={isPending} className="px-12 py-3 bg-[#00838f] text-white rounded-lg font-bold shadow-lg shadow-[#006872]/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50" type="submit">
            <span className="material-symbols-outlined">save</span>
            {isPending ? "Submitting..." : "Submit Log"}
          </button>
        </div>
      </form>
    </div>
  );
}
