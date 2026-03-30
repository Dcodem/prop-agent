"use client";

import { useActionState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addTenantToPropertyAction } from "@/app/(dashboard)/properties/actions";

interface AddTenantFormProps {
  propertyId: string;
  onClose: () => void;
}

export function AddTenantForm({ propertyId, onClose }: AddTenantFormProps) {
  async function handleSubmit(
    _prevState: { success: boolean; error?: string } | null,
    formData: FormData
  ) {
    const result = await addTenantToPropertyAction(formData);

    if (result.success) {
      onClose();
      return null;
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <Modal open onClose={onClose} title="Add Tenant">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="propertyId" value={propertyId} />

        <Input label="Name" name="name" required />
        <Input label="Email" name="email" type="email" />
        <Input label="Phone" name="phone" type="tel" />
        <Input label="Unit Number" name="unitNumber" />
        <Input label="Lease Start" name="leaseStart" type="date" />
        <Input label="Lease End" name="leaseEnd" type="date" />

        {state?.error && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Add Tenant
          </Button>
        </div>
      </form>
    </Modal>
  );
}
