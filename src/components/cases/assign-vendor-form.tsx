"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { formatEnum } from "@/lib/utils";
import { assignVendorAction } from "@/app/(dashboard)/cases/actions";

interface AssignVendorFormProps {
  caseId: string;
  vendors: { id: string; name: string; trade: string }[];
  currentVendorId?: string | null;
}

export function AssignVendorForm({
  caseId,
  vendors,
  currentVendorId,
}: AssignVendorFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const vendorId = e.target.value;
    if (vendorId && vendorId !== currentVendorId) {
      startTransition(() => {
        assignVendorAction(caseId, vendorId);
      });
    }
  }

  const options = [
    { value: "", label: "Select a vendor..." },
    ...vendors.map((v) => ({
      value: v.id,
      label: `${v.name} (${formatEnum(v.trade)})`,
    })),
  ];

  return (
    <Select
      label="Assign Vendor"
      options={options}
      value={currentVendorId ?? ""}
      onChange={handleChange}
      disabled={isPending}
    />
  );
}
