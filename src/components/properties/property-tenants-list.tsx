import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import type { Tenant } from "@/lib/db/schema";

interface PropertyTenantsListProps {
  tenants: Tenant[];
  propertyId: string;
  onAddTenant?: () => void;
}

export function PropertyTenantsList({
  tenants,
  propertyId,
  onAddTenant,
}: PropertyTenantsListProps) {
  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No tenants yet"
        description="Add a tenant to this property to get started."
      >
        {onAddTenant && (
          <button
            onClick={onAddTenant}
            className="mt-2 text-sm font-semibold text-cta hover:opacity-80 cursor-pointer"
          >
            + Add Tenant
          </button>
        )}
      </EmptyState>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
          <TableHeaderCell>Phone</TableHeaderCell>
          <TableHeaderCell>Unit</TableHeaderCell>
          <TableHeaderCell>Lease End</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>
              <Link
                href={`/tenants/${tenant.id}`}
                className="text-primary hover:underline font-medium"
              >
                {tenant.name}
              </Link>
            </TableCell>
            <TableCell>{tenant.email ?? "-"}</TableCell>
            <TableCell>{tenant.phone ?? "-"}</TableCell>
            <TableCell>{tenant.unitNumber ?? "-"}</TableCell>
            <TableCell>
              {tenant.leaseEnd
                ? new Date(tenant.leaseEnd).toLocaleDateString()
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
