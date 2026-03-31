"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTenantAction, updateTenantAction } from "@/app/(dashboard)/tenants/actions";

type Property = {
  id: string;
  address: string;
};

type Tenant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  propertyId: string;
  unitNumber: string | null;
  leaseStart: Date | null;
  leaseEnd: Date | null;
};

type FormState = { success: boolean } | { error: Record<string, string[]> | string } | null;

function formatDateForInput(date: Date | null) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

async function handleCreate(_prev: FormState, formData: FormData): Promise<FormState> {
  return createTenantAction(formData) as Promise<FormState>;
}

async function handleUpdate(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = formData.get("id") as string;
  formData.delete("id");
  return updateTenantAction(id, formData) as Promise<FormState>;
}

export function TenantForm({
  properties,
  tenant,
  onClose,
}: {
  properties: Property[];
  tenant?: Tenant | null;
  onClose: () => void;
}) {
  const isEditing = !!tenant;
  const [state, formAction, isPending] = useActionState(
    isEditing ? handleUpdate : handleCreate,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "success" in state && state.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-cyan-900 tracking-tight">
            {isEditing ? "Edit Tenant" : "Add Tenant"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-4">
          {isEditing && <input type="hidden" name="id" value={tenant.id} />}

          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Name *
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={tenant?.name ?? ""}
              className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-[#00838F]/20 focus:border-[#00838F] transition-all placeholder:text-slate-400"
              placeholder="Full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={tenant?.email ?? ""}
              className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-[#00838F]/20 focus:border-[#00838F] transition-all placeholder:text-slate-400"
              placeholder="email@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={tenant?.phone ?? ""}
              className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-[#00838F]/20 focus:border-[#00838F] transition-all placeholder:text-slate-400"
              placeholder="555-0123"
            />
          </div>

          {/* Property */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Property *
            </label>
            <select
              name="propertyId"
              required
              defaultValue={tenant?.propertyId ?? ""}
              className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-[#00838F]/20 focus:border-[#00838F] transition-all"
            >
              <option value="">Select property...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.address}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Number */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Unit Number
            </label>
            <input
              name="unitNumber"
              type="text"
              defaultValue={tenant?.unitNumber ?? ""}
              className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-[#00838F]/20 focus:border-[#00838F] transition-all placeholder:text-slate-400"
              placeholder="e.g. 12B"
            />
          </div>

          {/* Lease Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Lease Start
              </label>
              <input
                name="leaseStart"
                type="date"
                defaultValue={formatDateForInput(tenant?.leaseStart ?? null)}
                className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-[#00838F]/20 focus:border-[#00838F] transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Lease End
              </label>
              <input
                name="leaseEnd"
                type="date"
                defaultValue={formatDateForInput(tenant?.leaseEnd ?? null)}
                className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-[#00838F]/20 focus:border-[#00838F] transition-all"
              />
            </div>
          </div>

          {/* Error display */}
          {state && "error" in state && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {typeof state.error === "string"
                ? state.error
                : "Please fix the errors above."}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#00838F] hover:bg-[#006d78] text-white font-bold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                "Saving..."
              ) : isEditing ? (
                "Update Tenant"
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    person_add
                  </span>
                  Add Tenant
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
