"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createVendorAction } from "@/app/(dashboard)/vendors/actions";
import { VENDOR_TRADES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";

type FormState = { success?: boolean; error?: Record<string, string[]> | null };

export default function AddVendorPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await createVendorAction(formData);
      if ("success" in result && result.success) {
        return { success: true };
      }
      return result as FormState;
    },
    { error: null }
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/vendors");
    }
  }, [state?.success, router]);

  const errors = state?.error;

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#006872] font-semibold text-xs uppercase tracking-widest mb-2 font-['Plus_Jakarta_Sans']">
            <span>Vendors</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>Registration</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#191c1e] font-['Plus_Jakarta_Sans'] tracking-tight mb-4">Add New Vendor</h1>
          <p className="text-[#3e494a] max-w-2xl leading-relaxed">Onboard a new service provider into the PropAgent ecosystem. Ensure all compliance documents are uploaded for seamless invoicing.</p>
        </div>
        {/* Form Canvas */}
        <form action={formAction} className="space-y-12">
          {/* Primary Upload Action Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mb-1">Quick Registration</h2>
              <p className="text-sm text-[#3e494a]">Fast-track onboarding by uploading existing vendor documentation.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="border-2 border-dashed border-[#006872]/30 rounded-xl p-10 text-center bg-[#006872]/5 hover:bg-[#006872]/10 transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-5xl text-[#006872] mb-4 block group-hover:scale-110 transition-transform">cloud_upload</span>
                <h3 className="text-lg font-bold text-[#191c1e] mb-2">Create Vendor by Uploading Receipt or Document</h3>
                <p className="text-sm text-[#3e494a] mb-6">Our AI will automatically extract company details, tax ID, and contact information for you.</p>
                <button className="bg-[#006872] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-[#006872]/20 hover:shadow-xl transition-all" type="button">Browse Local Files</button>
                <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-semibold">Supported: PDF, JPG, PNG (Max 20MB)</p>
              </div>
            </div>
          </div>
          {/* Section 1: Company Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mb-1">Company Information</h2>
              <p className="text-sm text-[#3e494a]">Core identification and industry classification for the vendor.</p>
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Vendor Name</label>
                  <input name="name" className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all" placeholder="e.g. Apex Plumbing Solutions" type="text" />
                  {errors?.name && <p className="text-xs text-[#ba1a1a] mt-1">{errors.name[0]}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Trade Category</label>
                  <select name="trade" className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all">
                    <option value="">Select Trade</option>
                    {VENDOR_TRADES.map((trade) => (
                      <option key={trade} value={trade}>{formatEnum(trade)}</option>
                    ))}
                  </select>
                  {errors?.trade && <p className="text-xs text-[#ba1a1a] mt-1">{errors.trade[0]}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Tax ID (EIN/SSN)</label>
                  <input className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all" placeholder="XX-XXXXXXX" type="text" />
                </div>
              </div>
            </div>
          </div>
          {/* Section 2: Contact Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mb-1">Contact Details</h2>
              <p className="text-sm text-[#3e494a]">Direct communication lines for scheduling and coordination.</p>
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Primary Contact Name</label>
                  <input className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all" placeholder="Full Name" type="text" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Phone Number</label>
                  <input name="phone" className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all" placeholder="+1 (555) 000-0000" type="tel" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Email Address</label>
                  <input name="email" className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all" placeholder="contact@company.com" type="email" />
                  {errors?.email && <p className="text-xs text-[#ba1a1a] mt-1">{errors.email[0]}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Office Address</label>
                  <textarea className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all" placeholder="123 Industry Blvd, Suite 400..." rows={3}></textarea>
                </div>
              </div>
            </div>
          </div>
          {/* Section 3: Rates & Availability */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mb-1">Rates &amp; Availability</h2>
              <p className="text-sm text-[#3e494a]">Standard pricing structures and operational range.</p>
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Standard Hourly Rate ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input name="rateNotes" className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 pl-8 text-[#191c1e] transition-all" placeholder="0.00" type="text" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Emergency Rate ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 pl-8 text-[#191c1e] transition-all" placeholder="0.00" type="text" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">Service Areas</label>
                  <div className="bg-[#f2f4f6] rounded-lg p-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-[#dde3eb] text-[#5f656c] px-3 py-1 rounded-full text-xs font-semibold">
                      Downtown <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#dde3eb] text-[#5f656c] px-3 py-1 rounded-full text-xs font-semibold">
                      North Heights <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#dde3eb] text-[#5f656c] px-3 py-1 rounded-full text-xs font-semibold">
                      West Industrial <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span>
                    </span>
                    <button className="text-[#006872] font-bold text-xs px-2" type="button">+ Add Area</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Section 4: Compliance & Insurance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] mb-1">Compliance &amp; Insurance</h2>
              <p className="text-sm text-[#3e494a]">Legal validation and liability protection records.</p>
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#f2f4f6] rounded-lg">
                  <div className="col-span-2 flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[#006872]">General Liability Insurance</span>
                    <span className="material-symbols-outlined text-green-600">verified_user</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#3e494a] mb-1">Policy Number</label>
                    <input className="w-full bg-white border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-2 text-sm" placeholder="GL-9938221" type="text" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#3e494a] mb-1">Expiration Date</label>
                    <input className="w-full bg-white border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-2 text-sm" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#f2f4f6] rounded-lg">
                  <div className="col-span-2 flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[#006872]">Workers&apos; Compensation</span>
                    <span className="material-symbols-outlined text-slate-400">upload_file</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#3e494a] mb-1">Policy Number</label>
                    <input className="w-full bg-white border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-2 text-sm" placeholder="WC-442100" type="text" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#3e494a] mb-1">Expiration Date</label>
                    <input className="w-full bg-white border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-2 text-sm" type="date" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden fields for schema compliance */}
          <input type="hidden" name="availabilityNotes" value="" />
          <input type="hidden" name="preferenceScore" value="0.5" />

          {/* Error Banner */}
          {errors && (
            <div className="bg-[#ffdad6] text-[#93000a] rounded-lg px-4 py-3 text-sm font-medium">
              Please fix the errors above and try again.
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 mt-12 border-t border-slate-200 dark:border-slate-800">
            <Link href="/vendors" className="px-8 py-3 bg-[#e6e8ea] text-[#191c1e] font-semibold rounded-lg hover:bg-[#e0e3e5] transition-colors active:scale-95">
              Cancel
            </Link>
            <button disabled={isPending} className="px-10 py-3 bg-gradient-to-br from-[#006872] to-[#00838f] text-white font-bold rounded-lg shadow-xl shadow-cyan-900/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none" type="submit">
              {isPending ? "Saving..." : "Save Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
