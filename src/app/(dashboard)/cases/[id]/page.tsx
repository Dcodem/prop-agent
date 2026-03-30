import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getCaseWithTimeline } from "@/lib/db/queries/cases";
import { getTenant } from "@/lib/db/queries/tenants";
import { getVendor, listVendors } from "@/lib/db/queries/vendors";
import { getProperty } from "@/lib/db/queries/properties";
import { getMessagesByCase } from "@/lib/db/queries/messages";
import { timeAgo, formatEnum } from "@/lib/utils";
import { CaseTimeline } from "@/components/cases/case-timeline";
import { CaseMessages } from "@/components/cases/case-messages";
import { AddNoteForm } from "@/components/cases/add-note-form";
import { StatusUpdateForm } from "@/components/cases/status-update-form";
import { AssignVendorForm } from "@/components/cases/assign-vendor-form";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const orgId = await getOrgId();
  const { id } = await params;

  const result = await getCaseWithTimeline(id, orgId);
  if (!result) notFound();

  const caseData = "case" in result ? (result as any).case : result;
  const timeline = "timeline" in result ? (result as any).timeline : (result as any).timeline ?? [];

  const [tenant, vendor, property, messages, allVendors] = await Promise.all([
    caseData.tenantId ? getTenant(caseData.tenantId, orgId) : null,
    caseData.vendorId ? getVendor(caseData.vendorId, orgId) : null,
    caseData.propertyId ? getProperty(caseData.propertyId, orgId) : null,
    getMessagesByCase(id, orgId),
    listVendors(orgId),
  ]);

  const urgencyColors: Record<string, string> = {
    critical: "bg-[#ffdad6] text-[#93000a]",
    high: "bg-[#ffdad6] text-[#93000a]",
    medium: "bg-[#ffdcc5] text-[#703801]",
    low: "bg-[#c5e9ee] text-[#2a4c50]",
  };

  const statusColors: Record<string, string> = {
    open: "bg-[#c5e9ee] text-[#2a4c50]",
    in_progress: "bg-[#c5e9ee] text-[#2a4c50]",
    waiting_on_vendor: "bg-[#ffdcc5] text-[#703801]",
    waiting_on_tenant: "bg-[#ffdcc5] text-[#703801]",
    resolved: "bg-[#c5e9ee] text-[#2a4c50]",
    closed: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-sm text-[#3e494a] mb-4 font-medium uppercase tracking-wider">
          <span className="material-symbols-outlined text-base">home</span>
          <Link href="/cases" className="hover:text-[#006872] cursor-pointer transition-colors">Cases</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-[#006872] font-bold">Case Detail</span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-[#0d1c2e] tracking-tight leading-[1.1]" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {caseData.rawMessage ? (caseData.rawMessage.length > 60 ? caseData.rawMessage.slice(0, 60) + "..." : caseData.rawMessage) : "Case Detail"}
            </h1>
            <p className="text-lg text-[#3e494a] mt-3 font-medium opacity-80">
              {tenant ? `Reported by ${tenant.name}` : "Unknown tenant"}
              {tenant?.unitNumber ? ` • Unit ${tenant.unitNumber}` : ""}
              {` • ${timeAgo(caseData.createdAt)}`}
            </p>
          </div>
          <div className="flex gap-4">
            <span className={`px-6 py-3 rounded-full text-sm font-bold flex items-center gap-3 shadow-sm border border-[#bdc9ca]/10 ${statusColors[caseData.status] ?? "bg-slate-100 text-slate-600"}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#006872] animate-pulse"></span>
              Status: {formatEnum(caseData.status)}
            </span>
            {caseData.urgency && (
              <span className={`px-6 py-3 rounded-full text-sm font-bold shadow-sm ${urgencyColors[caseData.urgency] ?? "bg-slate-100 text-slate-600"}`}>
                Priority: {formatEnum(caseData.urgency)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          {/* Tenant Info Pill */}
          {tenant && (
            <section className="bg-white rounded-full p-6 shadow-sm border border-[#bdc9ca]/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#00838f] flex items-center justify-center text-white font-bold text-xl" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {tenant.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-extrabold text-[#0d1c2e] tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>{tenant.name}</h2>
                  <span className="px-3 py-1 bg-[#006872]/5 text-[#006872] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#006872]/10">Primary Tenant</span>
                </div>
                <div className="flex items-center gap-4 text-[#3e494a] font-medium">
                  {tenant.unitNumber && (
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg text-[#006872]">apartment</span>
                      <span className="text-sm tracking-tight">Unit {tenant.unitNumber}</span>
                    </div>
                  )}
                  {property && (
                    <>
                      <div className="w-1 h-1 bg-[#bdc9ca] rounded-full"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-lg text-[#006872]">location_on</span>
                        <span className="text-sm tracking-tight">{property.address}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {tenant.phone && (
                  <button className="p-3 text-[#006872] hover:bg-[#006872]/5 rounded-full transition-all border border-[#006872]/20">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                )}
                {tenant.email && (
                  <button className="p-3 text-[#006872] hover:bg-[#006872]/5 rounded-full transition-all border border-[#006872]/20">
                    <span className="material-symbols-outlined">mail</span>
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Issue Description */}
          <section className="bg-white rounded-[1rem] p-10 shadow-sm border border-[#bdc9ca]/10">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-14 h-14 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006872] shrink-0">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0d1c2e] mb-3 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>Issue Description</h2>
                <p className="text-lg text-[#3e494a] leading-relaxed">"{caseData.rawMessage}"</p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-[1rem] p-10 shadow-sm border border-[#bdc9ca]/10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>System of Record</h2>
                <p className="text-sm text-[#3e494a] font-medium mt-1">Case interaction timeline</p>
              </div>
              <span className="text-xs font-black text-[#006872] uppercase tracking-widest bg-[#006872]/5 px-4 py-2 rounded-full border border-[#006872]/10">Audit Ready</span>
            </div>
            <CaseTimeline timeline={timeline} />
          </section>

          {/* Communication Log */}
          <section className="bg-[#eff4ff] rounded-[1rem] p-10 shadow-sm border border-[#bdc9ca]/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>Communication Log</h2>
                <p className="text-sm text-[#3e494a] font-medium mt-1">Real-time collaboration with stakeholders</p>
              </div>
            </div>
            <CaseMessages messages={messages} />
            <div className="mt-8">
              <AddNoteForm caseId={id} />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          {/* Case Controls */}
          <div className="bg-white rounded-[1rem] p-10 shadow-sm border border-[#bdc9ca]/10">
            <h3 className="text-xs font-black text-[#3e494a] uppercase tracking-[0.2em] mb-8">Case Controls</h3>
            <div className="space-y-8">
              <StatusUpdateForm caseId={id} currentStatus={caseData.status} />
              <AssignVendorForm
                caseId={id}
                vendors={allVendors.map(v => ({ id: v.id, name: v.name, trade: v.trade }))}
                currentVendorId={caseData.vendorId ?? undefined}
              />
              <button className="w-full py-4 bg-[#c5e9ee] text-[#486a6f] rounded-lg font-black text-sm flex items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined">calendar_today</span>
                Schedule Inspection
              </button>
              <button className="w-full py-4 border-2 border-[#bdc9ca]/20 text-[#0d1c2e] rounded-lg font-black text-sm flex items-center justify-center gap-3 hover:bg-[#f8f9ff] transition-all">
                <span className="material-symbols-outlined">description</span>
                Generate Work Order
              </button>
            </div>
          </div>

          {/* Estimated Costs */}
          <div className="bg-[#eff4ff] rounded-[1rem] p-10 shadow-sm border border-[#bdc9ca]/10">
            <h3 className="text-xs font-black text-[#3e494a] uppercase tracking-[0.2em] mb-6">Estimated Costs</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#3e494a]">Service Call Fee</span>
                <span className="font-bold">$85.00</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#3e494a]">Labor (Est.)</span>
                <span className="font-bold">$120.00</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#3e494a]">Parts (Est.)</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="h-[2px] bg-[#bdc9ca]/20 my-4"></div>
              <div className="flex justify-between items-center text-2xl">
                <span className="font-black text-[#0d1c2e] tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>Total Est.</span>
                <span className="font-black text-[#006872]">$205.00</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white/50 rounded-lg border border-[#006872]/10">
              <p className="text-[10px] text-[#3e494a] font-bold leading-relaxed uppercase tracking-wider">
                Pre-approved budget: <span className="text-[#006872] font-black">$500.00</span>
              </p>
            </div>
          </div>

          {/* Property Info */}
          {property && (
            <div className="bg-white rounded-[1rem] p-10 shadow-sm border border-[#bdc9ca]/10">
              <h3 className="text-xs font-black text-[#3e494a] uppercase tracking-[0.2em] mb-6">Property Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006872]">location_on</span>
                  <span className="text-sm font-medium">{property.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006872]">home_work</span>
                  <span className="text-sm font-medium">{formatEnum(property.type)} • {property.unitCount ?? 1} units</span>
                </div>
                {property.accessInstructions && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#006872]">key</span>
                    <span className="text-sm text-[#3e494a]">{property.accessInstructions}</span>
                  </div>
                )}
                {property.parkingInstructions && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#006872]">local_parking</span>
                    <span className="text-sm text-[#3e494a]">{property.parkingInstructions}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vendor Info */}
          {vendor && (
            <div className="bg-white rounded-[1rem] p-10 shadow-sm border border-[#bdc9ca]/10">
              <h3 className="text-xs font-black text-[#3e494a] uppercase tracking-[0.2em] mb-6">Assigned Contractor</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#006872]/10 text-[#006872] rounded-lg flex items-center justify-center font-black text-lg">
                  {vendor.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="font-black text-[#0d1c2e]">{vendor.name}</p>
                  <p className="text-[10px] text-[#3e494a] font-bold uppercase tracking-wider">{formatEnum(vendor.trade)}</p>
                </div>
              </div>
              <div className="space-y-3">
                {vendor.email && (
                  <div className="flex items-center gap-3 text-sm text-[#3e494a]">
                    <span className="material-symbols-outlined text-lg text-[#6e797b]">mail</span>
                    <span>{vendor.email}</span>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-3 text-sm text-[#3e494a]">
                    <span className="material-symbols-outlined text-lg text-[#6e797b]">call</span>
                    <span>{vendor.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
