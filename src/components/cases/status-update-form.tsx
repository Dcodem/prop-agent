"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { CASE_STATUSES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";
import { updateCaseStatusAction } from "@/app/(dashboard)/cases/actions";

interface StatusUpdateFormProps {
  caseId: string;
  currentStatus: string;
}

export function StatusUpdateForm({
  caseId,
  currentStatus,
}: StatusUpdateFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus && newStatus !== currentStatus) {
      startTransition(() => {
        updateCaseStatusAction(caseId, newStatus);
      });
    }
  }

  return (
    <Select
      label="Update Status"
      options={CASE_STATUSES.map((s) => ({ value: s, label: formatEnum(s) }))}
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
    />
  );
}
