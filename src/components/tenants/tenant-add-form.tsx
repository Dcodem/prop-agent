"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTenantAction } from "@/app/(dashboard)/tenants/actions";

interface TenantAddFormProps {
  properties: { id: string; address: string }[];
}

export function TenantAddForm({ properties }: TenantAddFormProps) {
  const router = useRouter();

  async function handleSubmit(
    _prev: { error?: Record<string, string[]>; success?: boolean } | null,
    formData: FormData,
  ): Promise<{ error?: Record<string, string[]>; success?: boolean }> {
    return await createTenantAction(formData);
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (state && state.success) {
      router.push("/tenants");
    }
  }, [state, router]);

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-[#006872] font-semibold text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <span>Tenants</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>Registration</span>
        </div>
        <h1 className="text-4xl font-extrabold text-[#191c1e] tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New Tenant</h1>
        <p className="text-[#3e494a] max-w-2xl leading-relaxed">Register a new resident into the PropAgent management system.</p>
      </div>

      <form action={formAction}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tenant Information */}
          <div className="bg-white rounded-2xl border border-[#e6e8ea] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#006872] bg-opacity-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006872] text-xl">person</span>
              </div>
              <h2 className="text-lg font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tenant Information</h2>
            </div>
            <div className="space-y-6">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all"
                  placeholder="Enter tenant's full name"
                />
                {state?.error?.name && (
                  <p className="mt-1 text-xs text-red-600">{state.error.name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all"
                  placeholder="tenant@email.com"
                />
                {state?.error?.email && (
                  <p className="mt-1 text-xs text-red-600">{state.error.email[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all"
                  placeholder="(555) 123-4567"
                />
                {state?.error?.phone && (
                  <p className="mt-1 text-xs text-red-600">{state.error.phone[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Property Assignment */}
          <div className="bg-white rounded-2xl border border-[#e6e8ea] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#006872] bg-opacity-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006872] text-xl">apartment</span>
              </div>
              <h2 className="text-lg font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Property Assignment</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="propertyId" className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">
                  Property <span className="text-red-500">*</span>
                </label>
                <select
                  id="propertyId"
                  name="propertyId"
                  required
                  className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all"
                  defaultValue=""
                >
                  <option value="" disabled>Select a property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.address}
                    </option>
                  ))}
                </select>
                {state?.error?.propertyId && (
                  <p className="mt-1 text-xs text-red-600">{state.error.propertyId[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="unitNumber" className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">
                  Unit Number
                </label>
                <input
                  id="unitNumber"
                  name="unitNumber"
                  type="text"
                  className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all"
                  placeholder="e.g. 4B, Suite 200"
                />
                {state?.error?.unitNumber && (
                  <p className="mt-1 text-xs text-red-600">{state.error.unitNumber[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Lease Details */}
          <div className="bg-white rounded-2xl border border-[#e6e8ea] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#006872] bg-opacity-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006872] text-xl">description</span>
              </div>
              <h2 className="text-lg font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lease Details</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="leaseStart" className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">
                  Lease Start
                </label>
                <input
                  id="leaseStart"
                  name="leaseStart"
                  type="date"
                  className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all"
                />
                {state?.error?.leaseStart && (
                  <p className="mt-1 text-xs text-red-600">{state.error.leaseStart[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="leaseEnd" className="block text-xs font-bold uppercase tracking-wider text-[#3e494a] mb-2">
                  Lease End
                </label>
                <input
                  id="leaseEnd"
                  name="leaseEnd"
                  type="date"
                  className="w-full bg-[#f2f4f6] border-0 border-l-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-lg p-3 text-[#191c1e] transition-all"
                />
                {state?.error?.leaseEnd && (
                  <p className="mt-1 text-xs text-red-600">{state.error.leaseEnd[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 mt-10 pt-8 border-t border-[#e6e8ea]">
          <Link
            href="/tenants"
            className="px-6 py-3 rounded-xl text-[#3e494a] font-semibold hover:bg-[#f2f4f6] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #006872 0%, #00838f 100%)",
            }}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person_add</span>
                Register Tenant
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
