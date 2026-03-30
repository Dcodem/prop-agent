"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { VENDOR_TRADES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";
import { createVendorAction, updateVendorAction } from "@/app/(dashboard)/vendors/actions";

interface VendorFormProps {
  vendor?: {
    id: string;
    name: string;
    trade: string;
    email: string | null;
    phone: string | null;
    rateNotes: string | null;
    availabilityNotes: string | null;
    preferenceScore: number | null;
  };
  onClose: () => void;
}

export function VendorForm({ vendor, onClose }: VendorFormProps) {
  const isEdit = !!vendor;

  async function handleSubmit(
    _prev: { error?: Record<string, string[]>; success?: boolean } | null,
    formData: FormData,
  ): Promise<{ error?: Record<string, string[]>; success?: boolean }> {
    if (isEdit) {
      return await updateVendorAction(vendor.id, formData);
    }
    return await createVendorAction(formData);
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (state && state.success) {
      onClose();
    }
  }, [state, onClose]);

  const tradeOptions = VENDOR_TRADES.map((t) => ({
    value: t,
    label: formatEnum(t),
  }));

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? "Edit Vendor" : "Add Vendor"}
    >
      <form action={formAction} className="space-y-4">
        <Input
          label="Name"
          name="name"
          required
          defaultValue={vendor?.name ?? ""}
          error={state?.error?.name?.[0]}
        />

        <Select
          label="Trade"
          name="trade"
          options={tradeOptions}
          placeholder="Select a trade"
          defaultValue={vendor?.trade ?? ""}
          error={state?.error?.trade?.[0]}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={vendor?.email ?? ""}
          error={state?.error?.email?.[0]}
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={vendor?.phone ?? ""}
          error={state?.error?.phone?.[0]}
        />

        <Textarea
          label="Rate Notes"
          name="rateNotes"
          defaultValue={vendor?.rateNotes ?? ""}
          error={state?.error?.rateNotes?.[0]}
        />

        <Textarea
          label="Availability Notes"
          name="availabilityNotes"
          defaultValue={vendor?.availabilityNotes ?? ""}
          error={state?.error?.availabilityNotes?.[0]}
        />

        <Input
          label="Preference Score"
          name="preferenceScore"
          type="number"
          step="0.1"
          min="0"
          max="1"
          defaultValue={vendor?.preferenceScore?.toString() ?? "0.5"}
          error={state?.error?.preferenceScore?.[0]}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {isEdit ? "Save Changes" : "Add Vendor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
