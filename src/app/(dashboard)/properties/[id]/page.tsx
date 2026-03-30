import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getProperty } from "@/lib/db/queries/properties";
import { listTenantsByProperty } from "@/lib/db/queries/tenants";
import { listCases } from "@/lib/db/queries/cases";
import { PropertyDetailClient } from "@/components/properties/property-detail-client";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const orgId = await getOrgId();

  const [property, tenants, allCases] = await Promise.all([
    getProperty(id, orgId),
    listTenantsByProperty(id, orgId),
    listCases(orgId, { propertyId: id }),
  ]);

  if (!property) {
    notFound();
  }

  const activeCases = allCases.filter(
    (c) => c.status !== "resolved" && c.status !== "closed"
  );

  return (
    <PropertyDetailClient
      property={property}
      tenants={tenants}
      activeCases={activeCases}
      allCases={allCases}
    />
  );
}
