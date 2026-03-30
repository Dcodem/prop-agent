"use client";

import { useActionState, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updatePropertyAction } from "@/app/(dashboard)/properties/actions";
import type { Property } from "@/lib/db/schema";

interface AccessInfoFormProps {
  property: Property;
}

export function AccessInfoForm({ property }: AccessInfoFormProps) {
  const [saved, setSaved] = useState(false);

  async function handleSubmit(
    _prevState: { success: boolean; error?: string } | null,
    formData: FormData
  ) {
    // Carry forward existing fields so they are not cleared
    formData.set("address", property.address);
    formData.set("unitCount", String(property.unitCount ?? 1));
    formData.set("type", property.type);
    if (property.notes) formData.set("notes", property.notes);

    const result = await updatePropertyAction(property.id, formData);

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      <Textarea
        label="Access Instructions"
        name="accessInstructions"
        defaultValue={property.accessInstructions ?? ""}
        rows={3}
      />
      <Textarea
        label="Parking Instructions"
        name="parkingInstructions"
        defaultValue={property.parkingInstructions ?? ""}
        rows={3}
      />
      <Textarea
        label="Unit Access Notes"
        name="unitAccessNotes"
        defaultValue={property.unitAccessNotes ?? ""}
        rows={3}
      />
      <Textarea
        label="Special Instructions"
        name="specialInstructions"
        defaultValue={property.specialInstructions ?? ""}
        rows={3}
      />

      {state && !state.success && state.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}

      {saved && (
        <p className="text-green-600 text-sm">Access info saved successfully.</p>
      )}

      <Button type="submit" loading={isPending}>
        Save Access Info
      </Button>
    </form>
  );
}
