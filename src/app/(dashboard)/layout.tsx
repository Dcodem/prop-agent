import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";
import { getCurrentUser, getOrgId } from "@/lib/db/queries/helpers";
import { listTenants } from "@/lib/db/queries/tenants";
import { listProperties } from "@/lib/db/queries/properties";
import { listCases } from "@/lib/db/queries/cases";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [user, orgId] = await Promise.all([getCurrentUser(), getOrgId()]);
  const [tenantsList, propertiesList, casesList] = await Promise.all([
    listTenants(orgId),
    listProperties(orgId),
    listCases(orgId),
  ]);

  const searchEntities = {
    tenants: tenantsList.map((t) => ({ id: t.id, name: t.name, unitNumber: t.unitNumber })),
    properties: propertiesList.map((p) => ({ id: p.id, address: p.address, type: p.type })),
    cases: casesList.slice(0, 50).map((c) => ({ id: c.id, rawMessage: c.rawMessage, category: c.category, status: c.status })),
  };

  const userInfo = { name: user.name, email: user.email, role: user.role };

  return (
    <DashboardShell searchEntities={searchEntities} userInfo={userInfo}>
      {children}
    </DashboardShell>
  );
}
