"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateVendorAction } from "@/app/(dashboard)/vendors/actions";
import { VENDOR_TRADES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";

interface Vendor {
  id: string;
  name: string;
  trade: string;
  email: string | null;
  phone: string | null;
  rateNotes: string | null;
  availabilityNotes: string | null;
  preferenceScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorEditFormProps {
  vendor: Vendor;
}

export function VendorEditForm({ vendor }: VendorEditFormProps) {
  const router = useRouter();

  async function handleSubmit(
    _prev: { error?: Record<string, string[]>; success?: boolean } | null,
    formData: FormData,
  ): Promise<{ error?: Record<string, string[]>; success?: boolean }> {
    return await updateVendorAction(vendor.id, formData);
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (state && state.success) {
      router.push(`/vendors/${vendor.id}`);
    }
  }, [state, router, vendor.id]);

  return (
    <div className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Editorial Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="uppercase tracking-[0.2em] text-[#3e494a] font-bold text-[10px] mb-2 block">Vendor Management / Edit Profile</span>
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{vendor.name}</h1>
        </div>
        <div className="flex gap-4">
          <Link href={`/vendors/${vendor.id}`} className="px-6 py-3 bg-[#e6e8ea] text-[#191c1e] font-bold text-sm rounded-lg hover:bg-[#e0e3e5] transition-colors">Cancel</Link>
          <button type="submit" form="edit-vendor-form" disabled={isPending} className="px-8 py-3 bg-gradient-to-br from-[#006872] to-[#00838f] text-white font-bold text-sm rounded-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50">
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Form Canvas */}
        <div className="col-span-8 space-y-12">
          <form id="edit-vendor-form" action={formAction} className="space-y-12">
            {/* Section: General Information */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>General Information</h2>
                <div className="h-[1px] flex-1 bg-[#e6e8ea]"></div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {/* Company Name */}
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e494a]">Company Name</label>
                  <div className="bg-[#f2f4f6] p-0.5 transition-all focus-within:bg-[#e0e3e5] focus-within:border-l-2 focus-within:border-[#006872]">
                    <input name="name" className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="text" defaultValue={vendor.name} required />
                  </div>
                  {state?.error?.name && <p className="text-xs text-red-600">{state.error.name[0]}</p>}
                </div>

                {/* Trade Sector */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e494a]">Trade Sector</label>
                  <div className="bg-[#f2f4f6] p-0.5 transition-all focus-within:bg-[#e0e3e5] focus-within:border-l-2 focus-within:border-[#006872]">
                    <select name="trade" className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium appearance-none" defaultValue={vendor.trade}>
                      {VENDOR_TRADES.map((t) => (
                        <option key={t} value={t}>{formatEnum(t)}</option>
                      ))}
                    </select>
                  </div>
                  {state?.error?.trade && <p className="text-xs text-red-600">{state.error.trade[0]}</p>}
                </div>

                {/* Tax ID / EIN (display-only, no name attr) */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e494a]">Tax ID / EIN</label>
                  <div className="bg-[#f2f4f6] p-0.5 transition-all focus-within:bg-[#e0e3e5] focus-within:border-l-2 focus-within:border-[#006872]">
                    <input className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="text" placeholder="XX-XXX4492" />
                  </div>
                </div>

                {/* Website (display-only, no name attr) */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e494a]">Website</label>
                  <div className="bg-[#f2f4f6] p-0.5 transition-all focus-within:bg-[#e0e3e5] focus-within:border-l-2 focus-within:border-[#006872]">
                    <input className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium text-[#006872]" type="url" placeholder="https://example.com" />
                  </div>
                </div>

                {/* Business Phone (col-span-2, display-only) */}
                <div className="col-span-2 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e494a]">Business Phone</label>
                  <div className="bg-[#f2f4f6] p-0.5 transition-all focus-within:bg-[#e0e3e5] focus-within:border-l-2 focus-within:border-[#006872]">
                    <input className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="tel" defaultValue={vendor.phone ?? ""} />
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Contact Details */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contact Details</h2>
                <div className="h-[1px] flex-1 bg-[#e6e8ea]"></div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* Primary Contact Name (display-only) */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e494a]">Primary Contact Name</label>
                  <div className="bg-[#f2f4f6] p-0.5 transition-all focus-within:bg-[#e0e3e5] focus-within:border-l-2 focus-within:border-[#006872]">
                    <input className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="text" placeholder="Contact name" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e494a]">Email Address</label>
                  <div className="bg-[#f2f4f6] p-0.5 transition-all focus-within:bg-[#e0e3e5] focus-within:border-l-2 focus-within:border-[#006872]">
                    <input name="email" className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="email" defaultValue={vendor.email ?? ""} />
                  </div>
                  {state?.error?.email && <p className="text-xs text-red-600">{state.error.email[0]}</p>}
                </div>
              </div>
            </section>

            {/* Section: Service Area */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Service Area</h2>
                <div className="h-[1px] flex-1 bg-[#e6e8ea]"></div>
              </div>
              <div className="bg-[#f2f4f6] p-6 rounded-lg space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 bg-[#dde3eb] text-[#5f656c] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight">
                    Chicago, IL
                    <button type="button" className="material-symbols-outlined text-sm hover:text-[#ba1a1a] transition-colors">close</button>
                  </span>
                  <span className="inline-flex items-center gap-2 bg-[#dde3eb] text-[#5f656c] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight">
                    North Suburbs
                    <button type="button" className="material-symbols-outlined text-sm hover:text-[#ba1a1a] transition-colors">close</button>
                  </span>
                  <span className="inline-flex items-center gap-2 bg-[#dde3eb] text-[#5f656c] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight">
                    Evanston
                    <button type="button" className="material-symbols-outlined text-sm hover:text-[#ba1a1a] transition-colors">close</button>
                  </span>
                  <button type="button" className="inline-flex items-center gap-1 border border-dashed border-[#bdc9ca] text-[#3e494a] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#e6e8ea] transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span> Add Region
                  </button>
                </div>
                {/* Map placeholder */}
                <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-300 to-slate-200">
                  <div className="absolute inset-0 bg-[#006872]/10 mix-blend-multiply"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-12 w-12 bg-[#006872]/20 rounded-full animate-pulse flex items-center justify-center">
                      <div className="h-4 w-4 bg-[#006872] rounded-full ring-4 ring-white"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Service Hub
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* Sidebar Info Rails */}
        <div className="col-span-4 space-y-8">
          {/* Compliance Card */}
          <div className="bg-white p-8 border border-[#bdc9ca]/10 shadow-sm">
            <h3 className="font-bold text-lg mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Compliance &amp; Insurance</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#3e494a] uppercase tracking-widest">General Liability</p>
                  <p className="text-sm font-medium">Expires: Oct 2024</p>
                </div>
                <span className="bg-[#006872]/10 text-[#006872] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#3e494a] uppercase tracking-widest">Workers Comp</p>
                  <p className="text-sm font-medium">Expires: Dec 2024</p>
                </div>
                <span className="bg-[#006872]/10 text-[#006872] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#3e494a] uppercase tracking-widest">Trade License</p>
                  <p className="text-sm font-medium text-[#ba1a1a] font-bold">Expires: In 3 Days</p>
                </div>
                <span className="bg-[#ba1a1a]/10 text-[#ba1a1a] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">Urgent</span>
              </div>
            </div>
            <button type="button" className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-[#e6e8ea] text-[#191c1e] font-bold text-xs uppercase tracking-widest rounded hover:bg-[#e0e3e5] transition-colors">
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Update Certificates
            </button>
          </div>

          {/* Modification History */}
          <div className="px-2">
            <h3 className="font-bold text-sm uppercase tracking-[0.15em] mb-6 text-[#3e494a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Modification History</h3>
            <div className="relative space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e6e8ea]">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-[#006872] border-4 border-[#f7f9fb]"></div>
                <p className="text-xs font-bold">Profile Details Updated</p>
                <p className="text-[10px] text-[#3e494a]">By Admin (Sarah K.) &bull; 2h ago</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-[#e6e8ea] border-4 border-[#f7f9fb]"></div>
                <p className="text-xs font-medium text-[#3e494a]">Insurance Certificate Renewed</p>
                <p className="text-[10px] text-[#3e494a]">System Automated &bull; May 12, 2024</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-[#e6e8ea] border-4 border-[#f7f9fb]"></div>
                <p className="text-xs font-medium text-[#3e494a]">Bank Account Changed</p>
                <p className="text-[10px] text-[#3e494a]">By Jonathan Miller &bull; Apr 28, 2024</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#f2f4f6] p-6 rounded-lg border-l-4 border-[#006872]">
            <p className="text-xs italic text-[#3e494a] mb-4">&ldquo;High-priority vendor for North Suburbs expansion project.&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-[#006872] flex items-center justify-center text-white text-xs font-bold">DC</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight">Assigned Manager</p>
                <p className="text-xs font-medium">David Chen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
