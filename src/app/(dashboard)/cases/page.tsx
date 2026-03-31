import { getOrgId } from "@/lib/db/queries/helpers";
import { listCases } from "@/lib/db/queries/cases";
import { listProperties } from "@/lib/db/queries/properties";
import { listTenants } from "@/lib/db/queries/tenants";
import { CasesPageClient } from "@/components/cases/cases-page-client";

export default async function CasesPage() {
  const orgId = await getOrgId();

  const [cases, properties, tenants] = await Promise.all([
    listCases(orgId),
    listProperties(orgId),
    listTenants(orgId),
  ]);

  return (
    <CasesPageClient
      cases={cases}
      properties={properties}
      tenants={tenants}
    />
  );
}
