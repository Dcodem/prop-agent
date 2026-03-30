"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createTenantAction, updateTenantAction } from "@/app/(dashboard)/tenants/actions";

interface TenantFormProps {
  tenant?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    propertyId: string;
    unitNumber: string | null;
    leaseStart: Date | null;
    leaseEnd: Date | null;
  };
  properties: { id: string; address: string }[];
  onClose: () => void;
}

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function TenantForm({ tenant, properties, onClose }: TenantFormProps) {
  const isEdit = !!tenant;

  async function handleSubmit(
    _prev: { error?: Record<string, string[]>; success?: boolean } | null,
    formData: FormData,
  ): Promise<{ error?: Record<string, string[]>; success?: boolean }> {
    if (isEdit) {
      return await updateTenantAction(tenant.id, formData);
    }
    return await createTenantAction(formData);
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (state && state.success) {
      onClose();
    }
  }, [state, onClose]);

  const propertyOptions = properties.map((p) => ({
    value: p.id,
    label: p.address,
  }));

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? "Edit Tenant" : "Add Tenant"}
    >
      <form action={formAction} className="space-y-4">
        <Input
          label="Name"
          name="name"
          required
          defaultValue={tenant?.name ?? ""}
          error={state?.error?.name?.[0]}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={tenant?.email ?? ""}
          error={state?.error?.email?.[0]}
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={tenant?.phone ?? ""}
          error={state?.error?.phone?.[0]}
        />

        <Select
          label="Property"
          name="propertyId"
          options={propertyOptions}
          placeholder="Select a property"
          defaultValue={tenant?.propertyId ?? ""}
          error={state?.error?.propertyId?.[0]}
        />

        <Input
          label="Unit Number"
          name="unitNumber"
          defaultValue={tenant?.unitNumber ?? ""}
          error={state?.error?.unitNumber?.[0]}
        />

        <Input
          label="Lease Start"
          name="leaseStart"
          type="date"
          defaultValue={formatDateForInput(tenant?.leaseStart ?? null)}
          error={state?.error?.leaseStart?.[0]}
        />

        <Input
          label="Lease End"
          name="leaseEnd"
          type="date"
          defaultValue={formatDateForInput(tenant?.leaseEnd ?? null)}
          error={state?.error?.leaseEnd?.[0]}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {isEdit ? "Save Changes" : "Add Tenant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
