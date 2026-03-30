import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getVendor } from "@/lib/db/queries/vendors";
import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { formatEnum } from "@/lib/utils";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const orgId = await getOrgId();
  const { id } = await params;

  const vendor = await getVendor(id, orgId);
  if (!vendor) notFound();

  const vendorCases = await db
    .select()
    .from(cases)
    .where(and(eq(cases.vendorId, id), eq(cases.orgId, orgId)));

  const activeCases = vendorCases.filter(
    (c) => c.status !== "resolved" && c.status !== "closed"
  );
  const completedCases = vendorCases.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  );

  const initials = vendor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const partnerYear = vendor.createdAt.getFullYear();

  const partnerScore =
    vendor.preferenceScore !== null
      ? (vendor.preferenceScore * 10).toFixed(1)
      : "5.0";

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen">
      {/* Header Section: Profile & Actions */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#e6e8ea] ring-4 ring-white shadow-xl flex items-center justify-center text-white font-extrabold text-4xl bg-gradient-to-br from-[#006872] to-[#00838f]">
              {initials}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#00838f] text-white p-1 rounded-full border-2 border-white">
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1
                className="text-4xl font-extrabold tracking-tighter text-[#191c1e]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {vendor.name}
              </h1>
              <span className="bg-[#dde3eb] text-[#5f656c] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Verified
              </span>
            </div>
            <p className="text-lg text-[#3e494a] font-medium">
              {formatEnum(vendor.trade)}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#6e797b]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>{" "}
                Local Service Area
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  calendar_today
                </span>{" "}
                Partner since {partnerYear}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-[#e6e8ea] text-[#191c1e] font-semibold text-sm rounded transition-colors hover:bg-[#e0e3e5] flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">mail</span>
            Message
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-br from-[#006872] to-[#00838f] text-white font-semibold text-sm rounded shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
        </div>
      </header>

      {/* Bento Grid Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border-l-4 border-[#006872] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#3e494a] uppercase tracking-widest">
            Avg Response
          </span>
          <div className="mt-4">
            <span
              className="text-4xl font-extrabold text-[#006872] tracking-tighter"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              42m
            </span>
            <div className="text-xs text-[#3e494a] mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-green-600">
                trending_down
              </span>{" "}
              12% faster than last month
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#3e494a] uppercase tracking-widest">
            Jobs Completed
          </span>
          <div className="mt-4">
            <span
              className="text-4xl font-extrabold text-[#191c1e] tracking-tighter"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {completedCases.length}
            </span>
            <div className="text-xs text-[#3e494a] mt-1">
              Across {vendorCases.length} properties
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#3e494a] uppercase tracking-widest">
            Compliance
          </span>
          <div className="mt-4">
            <span
              className="text-4xl font-extrabold text-[#191c1e] tracking-tighter"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              100%
            </span>
            <div className="text-xs text-green-600 font-semibold uppercase tracking-tighter mt-1">
              Fully Insured
            </div>
          </div>
        </div>
        <div className="bg-[#00838f] p-6 rounded-xl shadow-lg flex flex-col justify-between text-white">
          <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
            Partner Score
          </span>
          <div className="mt-4">
            <span
              className="text-4xl font-extrabold tracking-tighter"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {partnerScore}
            </span>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Active & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Assignments */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#eceef0]">
              <h2
                className="text-xl font-bold text-[#191c1e] tracking-tight"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Active Assignments
              </h2>
            </div>
            <div className="divide-y divide-[#eceef0]">
              {activeCases.length === 0 ? (
                <div className="px-8 py-6">
                  <p className="text-sm text-[#3e494a] font-medium">
                    No active assignments.
                  </p>
                </div>
              ) : (
                activeCases.map((c) => (
                  <div
                    key={c.id}
                    className="px-8 py-6 hover:bg-[#f2f4f6] transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#006872] uppercase tracking-wider mb-1">
                          {formatEnum(c.status)}
                        </span>
                        <h4 className="text-base font-bold text-[#191c1e]">
                          {c.rawMessage.length > 60
                            ? c.rawMessage.slice(0, 60) + "..."
                            : c.rawMessage}
                        </h4>
                      </div>
                      {c.urgency && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            c.urgency === "critical" || c.urgency === "high"
                              ? "bg-[#ffdad6] text-[#93000a]"
                              : c.urgency === "medium"
                              ? "bg-[#ffdcc5] text-[#703801]"
                              : "bg-[#c5e9ee] text-[#2a4c50]"
                          }`}
                        >
                          {formatEnum(c.urgency)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#3e494a] mb-4">
                      {c.category ? formatEnum(c.category) : "General"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {initials.charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +1
                        </div>
                      </div>
                      <Link
                        href={`/cases/${c.id}`}
                        className="text-[#006872] font-bold text-sm flex items-center gap-1 group-hover:underline"
                      >
                        View Details{" "}
                        <span className="material-symbols-outlined text-base">
                          chevron_right
                        </span>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Work History: Asymmetric Layout */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2
                className="text-xl font-bold text-[#191c1e] tracking-tight"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Recent History
              </h2>
              <button className="text-sm font-bold text-[#006872] hover:opacity-80">
                Export Logs
              </button>
            </div>
            {completedCases.length === 0 ? (
              <p className="text-sm text-[#3e494a] font-medium">
                No completed cases yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedCases.slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    href={`/cases/${c.id}`}
                    className="bg-[#f2f4f6] p-6 rounded-xl hover:bg-white hover:shadow-md transition-all border-l-2 border-transparent hover:border-[#006872] group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-[#006872] group-hover:bg-[#00838f] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">
                          {c.category === "maintenance"
                            ? "build"
                            : c.category === "emergency"
                            ? "warning"
                            : c.category === "payment"
                            ? "payments"
                            : "assignment"}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#3e494a] uppercase">
                          {c.resolvedAt
                            ? c.resolvedAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Completed"}
                        </div>
                        <div className="text-sm font-bold text-[#191c1e]">
                          {c.rawMessage.length > 40
                            ? c.rawMessage.slice(0, 40) + "..."
                            : c.rawMessage}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#3e494a] mb-4">
                      {c.category ? formatEnum(c.category) : "General"}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-[#191c1e]">--</span>
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        Closed
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <button className="w-full mt-6 py-3 border border-[#bdc9ca] text-[#3e494a] text-sm font-bold rounded-lg hover:bg-[#f2f4f6] transition-colors">
              Load More History
            </button>
          </div>
        </div>

        {/* Right Column: Contact & Map Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-32 bg-gradient-to-br from-slate-300 to-slate-200 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow-lg text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#006872]">
                  location_on
                </span>
                Headquarters
              </div>
            </div>
            <div className="p-6 space-y-4">
              {vendor.phone && (
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#3e494a]">
                    phone
                  </span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#3e494a]">
                      Phone
                    </div>
                    <div className="text-sm font-medium text-[#191c1e]">
                      {vendor.phone}
                    </div>
                  </div>
                </div>
              )}
              {vendor.email ? (
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#3e494a]">
                    language
                  </span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#3e494a]">
                      Website
                    </div>
                    <div className="text-sm font-medium text-[#006872]">
                      {vendor.email}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
