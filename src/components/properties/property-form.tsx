"use client";

import { useActionState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createPropertyAction,
  updatePropertyAction,
} from "@/app/(dashboard)/properties/actions";
import type { Property } from "@/lib/db/schema";

interface PropertyFormProps {
  property?: Property;
  onClose: () => void;
}

const typeOptions = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
];

export function PropertyForm({ property, onClose }: PropertyFormProps) {
  const isEdit = !!property;

  async function handleSubmit(
    _prevState: { success: boolean; error?: string } | null,
    formData: FormData
  ) {
    const result = isEdit
      ? await updatePropertyAction(property!.id, formData)
      : await createPropertyAction(formData);

    if (result.success) {
      onClose();
      return null;
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? "Edit Property" : "Add Property"}
    >
      <form action={formAction} className="space-y-4">
        <Input
          label="Address"
          name="address"
          required
          defaultValue={property?.address ?? ""}
        />
        <Input
          label="Unit Count"
          name="unitCount"
          type="number"
          min={1}
          defaultValue={property?.unitCount ?? 1}
        />
        <Select
          label="Type"
          name="type"
          options={typeOptions}
          defaultValue={property?.type ?? "residential"}
        />
        <Textarea
          label="Notes"
          name="notes"
          defaultValue={property?.notes ?? ""}
        />

        {state?.error && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {isEdit ? "Save Changes" : "Add Property"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
