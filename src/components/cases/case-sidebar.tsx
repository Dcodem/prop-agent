import Link from "next/link";
import {
  User,
  Building2,
  Wrench,
  Phone,
  AtSign,
  MapPin,
  Hash,
} from "lucide-react";
import { formatEnum } from "@/lib/utils";
import { StatusUpdateForm } from "@/components/cases/status-update-form";
import { AssignVendorForm } from "@/components/cases/assign-vendor-form";
import type { Case, Tenant, Vendor, Property } from "@/lib/db/schema";

interface CaseSidebarProps {
  caseData: Case;
  tenant: Tenant | null;
  vendor: Vendor | null;
  property: Property | null;
  vendors: Vendor[];
}

function SidebarCard({
  title,
  action,
  actionHref,
  children,
}: {
  title: string;
  action?: string;
  actionHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        {action && actionHref && (
          <Link
            href={actionHref}
            className="text-blue-600 hover:underline text-xs font-semibold"
          >
            {action}
          </Link>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function CaseSidebar({
  caseData,
  tenant,
  vendor,
  property,
  vendors,
}: CaseSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Change Status
            </label>
            <StatusUpdateForm
              caseId={caseData.id}
              currentStatus={caseData.status}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Assign Vendor
            </label>
            <AssignVendorForm
              caseId={caseData.id}
              vendors={vendors.map((v) => ({
                id: v.id,
                name: v.name,
                trade: v.trade,
              }))}
              currentVendorId={caseData.vendorId}
            />
          </div>
        </div>
      </div>

      {/* Tenant */}
      <SidebarCard
        title="Tenant"
        action={tenant ? "View Profile" : undefined}
        actionHref={tenant ? `/tenants/${tenant.id}` : undefined}
      >
        {tenant ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-none">
                  {tenant.name}
                </h4>
                {tenant.unitNumber && (
                  <p className="text-xs text-slate-400 mt-1">
                    Unit {tenant.unitNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {tenant.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <AtSign className="w-4 h-4 text-slate-400" />
                  <span>{tenant.email}</span>
                </div>
              )}
              {tenant.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{tenant.phone}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">No tenant linked</p>
        )}
      </SidebarCard>

      {/* Property */}
      <SidebarCard
        title="Property"
        action={property ? "Map View" : undefined}
        actionHref={property ? `/properties/${property.id}` : undefined}
      >
        {property ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-2.5 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-none">
                  {property.address}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {formatEnum(property.type)}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              {property.address}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-400">No property linked</p>
        )}
      </SidebarCard>

      {/* Vendor */}
      <SidebarCard
        title="Assigned Vendor"
        action={vendor ? "Change" : undefined}
        actionHref={vendor ? `/vendors/${vendor.id}` : undefined}
      >
        {vendor ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-2.5 rounded-lg">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-none">
                  {vendor.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {formatEnum(vendor.trade)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {vendor.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              {vendor.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <AtSign className="w-4 h-4 text-slate-400" />
                  <span>{vendor.email}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">No vendor assigned</p>
        )}
      </SidebarCard>
    </div>
  );
}
