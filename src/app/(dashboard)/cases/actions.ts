"use server";

import { getOrgId, getCurrentUser } from "@/lib/db/queries/helpers";
import { updateCase, addTimelineEntry } from "@/lib/db/queries/cases";
import { revalidatePath } from "next/cache";
import type { Case } from "@/lib/db/schema";

export async function updateCaseStatusAction(caseId: string, status: Case["status"]) {
  const orgId = await getOrgId();
  await updateCase(caseId, orgId, { status });
  await addTimelineEntry(caseId, {
    type: "status_change",
    details: `Status changed to ${status.replace(/_/g, " ")}`,
  });
  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/cases");
}

export async function assignVendorAction(caseId: string, vendorId: string) {
  const orgId = await getOrgId();
  await updateCase(caseId, orgId, {
    vendorId,
    status: "waiting_on_vendor",
  });
  await addTimelineEntry(caseId, {
    type: "vendor_assigned",
    details: "Vendor assigned",
    metadata: { vendorId },
  });
  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/cases");
}

export async function addNoteAction(caseId: string, note: string) {
  const user = await getCurrentUser();
  await addTimelineEntry(caseId, {
    type: "note",
    details: note,
    metadata: { author: user.name },
  });
  revalidatePath(`/cases/${caseId}`);
}
