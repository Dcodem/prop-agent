import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getTenant } from "@/lib/db/queries/tenants";
import { getProperty } from "@/lib/db/queries/properties";
import { listCasesByTenant } from "@/lib/db/queries/cases";
import { getMessagesByCase } from "@/lib/db/queries/messages";
import type { MessageLog } from "@/lib/db/schema";
import { TenantDetailClient } from "./page-client";

interface TenantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TenantDetailPage({ params }: TenantDetailPageProps) {
  const { id } = await params;
  const orgId = await getOrgId();
  const tenant = await getTenant(id, orgId);

  if (!tenant) notFound();

  const [property, cases] = await Promise.all([
    getProperty(tenant.propertyId, orgId),
    listCasesByTenant(id, orgId),
  ]);

  // Fetch messages across all cases for this tenant
  const messagePromises = cases.map((c) => getMessagesByCase(c.id, orgId));
  const messageArrays = await Promise.all(messagePromises);
  const allMessages: MessageLog[] = messageArrays
    .flat()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <TenantDetailClient
      tenant={{
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        propertyId: tenant.propertyId,
        unitNumber: tenant.unitNumber,
        leaseStart: tenant.leaseStart,
        leaseEnd: tenant.leaseEnd,
      }}
      property={property ? { id: property.id, address: property.address } : null}
      cases={cases.map((c) => ({
        id: c.id,
        status: c.status,
        urgency: c.urgency,
        category: c.category,
        rawMessage: c.rawMessage,
        createdAt: c.createdAt.toISOString(),
      }))}
      messages={allMessages.map((m) => ({
        id: m.id,
        direction: m.direction,
        channel: m.channel,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
