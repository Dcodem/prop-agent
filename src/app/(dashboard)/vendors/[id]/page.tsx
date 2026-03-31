import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getVendor } from "@/lib/db/queries/vendors";
import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { formatEnum, timeAgo } from "@/lib/utils";
import Link from "next/link";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();

  const vendor = await getVendor(id, orgId);
  if (!vendor) notFound();

  const vendorCases = await db
    .select()
    .from(cases)
    .where(and(eq(cases.vendorId, id), eq(cases.orgId, orgId)));

  const activeCases = vendorCases.filter(
    (c) => c.status === "open" || c.status === "in_progress" || c.status === "waiting_on_vendor" || c.status === "waiting_on_tenant"
  );
  const closedCases = vendorCases.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  );

  const initials = vendor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const partnerSince = new Date(vendor.createdAt).getFullYear();
  const score = vendor.preferenceScore ?? 0.5;
  const scoreDisplay = (score * 10).toFixed(1);

  return (
    <main className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section: Profile & Actions */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#e6e8ea] ring-4 ring-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-extrabold text-[#006872]">{initials}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#00838f] text-white p-1 rounded-full border-2 border-white">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tighter text-[#191c1e]">{vendor.name}</h1>
                <span className="bg-[#dde3eb] text-[#5f656c] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Verified</span>
              </div>
              <p className="text-lg text-[#3e494a] font-medium">{formatEnum(vendor.trade)} Specialist</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-[#6e797b]">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> Service Area</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> Partner since {partnerSince}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {vendor.email && (
              <a href={`mailto:${vendor.email}`} className="px-6 py-2.5 bg-[#e6e8ea] text-[#191c1e] font-semibold text-sm rounded transition-colors hover:bg-[#d8dadc] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">mail</span>
                Message
              </a>
            )}
            <Link href={`/vendors`} className="px-6 py-2.5 bg-gradient-to-br from-[#006872] to-[#00838f] text-white font-semibold text-sm rounded shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">edit</span>
              Edit Profile
            </Link>
          </div>
        </header>

        {/* Bento Grid Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border-l-4 border-[#006872] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-[#3e494a] uppercase tracking-widest">Avg Response</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-[#006872] tracking-tighter">42m</span>
              <div className="text-xs text-[#3e494a] mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-green-600">trending_down</span>
                12% faster than last month
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-[#3e494a] uppercase tracking-widest">Jobs Completed</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-[#191c1e] tracking-tighter">{closedCases.length.toLocaleString()}</span>
              <div className="text-xs text-[#3e494a] mt-1">Across {new Set(vendorCases.map(c => c.propertyId).filter(Boolean)).size} properties</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-[#3e494a] uppercase tracking-widest">Compliance</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-[#191c1e] tracking-tighter">100%</span>
              <div className="text-xs text-[#3e494a] mt-1 text-green-600 font-semibold uppercase tracking-tighter">Fully Insured</div>
            </div>
          </div>
          <div className="bg-[#00838f] p-6 rounded-xl shadow-lg flex flex-col justify-between text-white">
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Partner Score</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold tracking-tighter">{scoreDisplay}</span>
              <div className="flex gap-0.5 mt-1">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Active & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Jobs Section */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-[#eceef0]">
                <h2 className="text-xl font-bold text-[#191c1e] font-headline tracking-tight">Active Assignments</h2>
              </div>
              <div className="divide-y divide-[#eceef0]">
                {activeCases.length === 0 && (
                  <div className="px-8 py-6 text-sm text-[#3e494a]">No active assignments.</div>
                )}
                {activeCases.map((c) => (
                  <div key={c.id} className="px-8 py-6 hover:bg-[#f2f4f6] transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#006872] uppercase tracking-wider mb-1">{formatEnum(c.status)}</span>
                        <h4 className="text-base font-bold text-[#191c1e]">{c.category ? formatEnum(c.category) : "Case"}: #{c.id.slice(0, 8).toUpperCase()}</h4>
                      </div>
                      <span className="text-sm text-[#3e494a] font-medium">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[#3e494a] mb-4 line-clamp-2">{c.rawMessage}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#006872] to-[#00838f] flex items-center justify-center text-[10px] font-bold text-white">
                          {initials.charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +{Math.max(1, activeCases.length - 1)}
                        </div>
                      </div>
                      <Link href={`/cases/${c.id}`} className="text-[#006872] font-bold text-sm flex items-center gap-1 group-hover:underline">
                        View Details <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work History: Asymmetric Layout */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-[#191c1e] font-headline tracking-tight">Recent History</h2>
                <button className="text-sm font-bold text-[#006872] hover:opacity-80">Export Logs</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {closedCases.length === 0 && (
                  <div className="text-sm text-[#3e494a] col-span-2">No completed jobs yet.</div>
                )}
                {closedCases.slice(0, 4).map((c) => (
                  <div key={c.id} className="bg-[#f2f4f6] p-6 rounded-xl hover:bg-white hover:shadow-md transition-all border-l-2 border-transparent hover:border-[#006872] group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-[#006872] group-hover:bg-[#00838f] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">plumbing</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#3e494a] uppercase">{c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : timeAgo(c.createdAt)}</div>
                        <div className="text-sm font-bold text-[#191c1e]">{c.category ? formatEnum(c.category) : "Case"}</div>
                      </div>
                    </div>
                    <div className="text-xs text-[#3e494a] mb-4">Case #{c.id.slice(0, 8).toUpperCase()}</div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-[#191c1e]">{c.spendingAuthorized ? `$${(c.spendingAuthorized / 100).toFixed(2)}` : "—"}</span>
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Closed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 border border-[#bdc9ca] text-[#3e494a] text-sm font-bold rounded-lg hover:bg-[#f2f4f6] transition-colors">
                Load More History
              </button>
            </div>
          </div>

          {/* Right Column: Contact & Map Info */}
          <div className="space-y-8">
            {/* Contact & Map Info */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-32 bg-slate-200 relative">
                <div className="w-full h-full bg-gradient-to-br from-[#006872]/20 to-[#00838f]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-[#006872]/40">map</span>
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow-lg text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#006872]">location_on</span>
                  Headquarters
                </div>
              </div>
              <div className="p-6 space-y-4">
                {vendor.phone && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#3e494a]">phone</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#3e494a]">Phone</div>
                      <div className="text-sm font-medium text-[#191c1e]">{vendor.phone}</div>
                    </div>
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#3e494a]">mail</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#3e494a]">Email</div>
                      <div className="text-sm font-medium text-[#006872]">{vendor.email}</div>
                    </div>
                  </div>
                )}
                {vendor.rateNotes && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#3e494a]">payments</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#3e494a]">Rate Notes</div>
                      <div className="text-sm font-medium text-[#191c1e]">{vendor.rateNotes}</div>
                    </div>
                  </div>
                )}
                {vendor.availabilityNotes && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#3e494a]">schedule</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#3e494a]">Availability</div>
                      <div className="text-sm font-medium text-[#191c1e]">{vendor.availabilityNotes}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
