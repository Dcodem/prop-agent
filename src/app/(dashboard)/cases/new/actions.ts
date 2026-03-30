"use server";

import { revalidatePath } from "next/cache";
import { getOrgId } from "@/lib/db/queries/helpers";
import { db } from "@/lib/db";
import { cases, tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createCaseAction(
  _prevState: unknown,
  formData: FormData
) {
  const orgId = await getOrgId();

  const rawMessage = formData.get("rawMessage") as string;
  if (!rawMessage || rawMessage.trim().length === 0) {
    return { error: "Description is required." };
  }

  const category = (formData.get("category") as string) || null;
  const urgency = (formData.get("urgency") as string) || null;
  const propertyId = (formData.get("propertyId") as string) || null;
  const vendorId = (formData.get("vendorId") as string) || null;
  const title = (formData.get("title") as string) || null;

  // Look up first tenant at the selected property
  let tenantId: string | null = null;
  if (propertyId) {
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.propertyId, propertyId))
      .limit(1);
    if (tenant) {
      tenantId = tenant.id;
    }
  }

  const message = title ? `${title}\n\n${rawMessage}` : rawMessage;

  const [newCase] = await db
    .insert(cases)
    .values({
      orgId,
      tenantId,
      propertyId,
      source: "email",
      rawMessage: message,
      category: category as any,
      urgency: urgency as any,
      status: "open",
      vendorId,
    })
    .returning({ id: cases.id });

  revalidatePath("/cases");
  return { success: true, caseId: newCase.id };
}
