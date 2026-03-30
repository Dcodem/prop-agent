import { getOrgId } from "@/lib/db/queries/helpers";
import { listProperties } from "@/lib/db/queries/properties";
import { listVendors } from "@/lib/db/queries/vendors";
import { CaseCreateForm } from "@/components/cases/case-create-form";

export default async function NewCasePage() {
  const orgId = await getOrgId();

  const [properties, vendors] = await Promise.all([
    listProperties(orgId),
    listVendors(orgId),
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <CaseCreateForm
        properties={properties.map((p) => ({ id: p.id, address: p.address }))}
        vendors={vendors.map((v) => ({ id: v.id, name: v.name, trade: v.trade }))}
      />
    </div>
  );
}
