import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required. Set it in .env.local");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

// ─── Seed Data ──────────────────────────────────────────

const ORG_ID = "00000000-0000-4000-a000-000000000001";
const USER_ID = "00000000-0000-4000-a000-000000000010";

const PROPERTY_IDS = [
  "00000000-0000-4000-a000-000000000101",
  "00000000-0000-4000-a000-000000000102",
  "00000000-0000-4000-a000-000000000103",
];

const TENANT_IDS = [
  "00000000-0000-4000-a000-000000000201",
  "00000000-0000-4000-a000-000000000202",
  "00000000-0000-4000-a000-000000000203",
  "00000000-0000-4000-a000-000000000204",
  "00000000-0000-4000-a000-000000000205",
  "00000000-0000-4000-a000-000000000206",
];

const VENDOR_IDS = [
  "00000000-0000-4000-a000-000000000301",
  "00000000-0000-4000-a000-000000000302",
  "00000000-0000-4000-a000-000000000303",
  "00000000-0000-4000-a000-000000000304",
];

const CASE_IDS = [
  "00000000-0000-4000-a000-000000000401",
  "00000000-0000-4000-a000-000000000402",
  "00000000-0000-4000-a000-000000000403",
  "00000000-0000-4000-a000-000000000404",
];

async function seed() {
  console.log("🌱 Seeding PropAgent database...\n");

  // ─── Clean existing seed data ───────────────────────
  console.log("  Cleaning existing seed data...");
  await db.delete(schema.caseTimeline).execute();
  await db.delete(schema.messageLog).execute();
  await db.delete(schema.processedMessages).execute();
  await db.delete(schema.cases).execute();
  await db.delete(schema.tenants).execute();
  await db.delete(schema.vendors).execute();
  await db.delete(schema.properties).execute();
  await db.delete(schema.users).execute();
  await db.delete(schema.organizations).execute();

  // ─── Organization ───────────────────────────────────
  console.log("  Creating organization...");
  await db.insert(schema.organizations).values({
    id: ORG_ID,
    name: "Sunrise Property Management",
    slug: "sunrise-pm",
    emailAddress: "inbox@sunrise.propagent.dev",
    twilioPhoneNumber: "+15550001234",
    spendingLimit: 50000,
    emergencySpendingLimit: 100000,
    confidenceThresholds: { high: 0.85, medium: 0.5 },
    defaultUrgencyTimers: {
      critical: { vendorResponse: 10, reminder: 15, nextVendor: 20, pmEscalation: 30 },
      high: { vendorResponse: 30, reminder: 60, nextVendor: 120, pmEscalation: 180 },
      medium: { vendorResponse: 1440, reminder: 2160, nextVendor: 2880, pmEscalation: 2880 },
      low: { vendorResponse: 2880, reminder: 4320, nextVendor: 10080, pmEscalation: 10080 },
    },
    onboardingCompleted: true,
  });

  // ─── User ───────────────────────────────────────────
  const userEmail = process.argv[2] || "pm@sunrise-pm.com";
  console.log(`  Creating user (${userEmail})...`);
  await db.insert(schema.users).values({
    id: USER_ID,
    orgId: ORG_ID,
    email: userEmail,
    phone: "+15550009999",
    name: "Alex Rivera",
    role: "owner",
    notificationPreferences: {
      urgentChannel: "sms",
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      quietHoursTimezone: "America/New_York",
    },
  });

  // ─── Properties ─────────────────────────────────────
  console.log("  Creating properties...");
  await db.insert(schema.properties).values([
    {
      id: PROPERTY_IDS[0],
      orgId: ORG_ID,
      address: "142 Oak Street, Austin, TX 78701",
      unitCount: 4,
      type: "residential",
      accessInstructions: "Lockbox code: 4821. Located on front porch.",
      parkingInstructions: "Visitor parking in rear lot, spots 20-24.",
      unitAccessNotes: "Units 1A-1B on ground floor, 2A-2B on second floor.",
      specialInstructions: "Quiet hours enforced 10pm-8am per HOA.",
      notes: "Built in 2018. Last full inspection: Jan 2026.",
    },
    {
      id: PROPERTY_IDS[1],
      orgId: ORG_ID,
      address: "88 Commerce Blvd, Austin, TX 78702",
      unitCount: 1,
      type: "commercial",
      accessInstructions: "Key with front desk. After hours, call building security at 555-0188.",
      parkingInstructions: "Underground garage, any unmarked spot.",
      notes: "Commercial lease. Tenant handles interior maintenance.",
    },
    {
      id: PROPERTY_IDS[2],
      orgId: ORG_ID,
      address: "7 Maple Lane, Austin, TX 78703",
      unitCount: 2,
      type: "residential",
      accessInstructions: "Garage code: 7734. Side door is always unlocked during business hours.",
      parkingInstructions: "Driveway or street parking.",
      unitAccessNotes: "Unit A is downstairs duplex, Unit B is upstairs.",
      notes: "Older property, plumbing can be finicky. Prefer AceFix Plumbing for this address.",
    },
  ]);

  // ─── Tenants ────────────────────────────────────────
  console.log("  Creating tenants...");
  await db.insert(schema.tenants).values([
    {
      id: TENANT_IDS[0],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Jordan Chen",
      email: "jordan.chen@email.com",
      phone: "+15550101001",
      unitNumber: "1A",
      leaseStart: new Date("2025-06-01"),
      leaseEnd: new Date("2026-05-31"),
    },
    {
      id: TENANT_IDS[1],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Samantha Okafor",
      email: "s.okafor@email.com",
      phone: "+15550101002",
      unitNumber: "1B",
      leaseStart: new Date("2025-09-01"),
      leaseEnd: new Date("2026-08-31"),
    },
    {
      id: TENANT_IDS[2],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Marcus Williams",
      email: "m.williams@email.com",
      phone: "+15550101003",
      unitNumber: "2A",
      leaseStart: new Date("2025-03-01"),
      leaseEnd: new Date("2026-02-28"),
    },
    {
      id: TENANT_IDS[3],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Priya Patel",
      email: "priya.p@email.com",
      phone: "+15550101004",
      unitNumber: "2B",
      leaseStart: new Date("2025-07-01"),
      leaseEnd: new Date("2026-06-30"),
    },
    {
      id: TENANT_IDS[4],
      propertyId: PROPERTY_IDS[2],
      orgId: ORG_ID,
      name: "Emily Larsson",
      email: "emily.l@email.com",
      phone: "+15550101005",
      unitNumber: "A",
      leaseStart: new Date("2025-01-15"),
      leaseEnd: new Date("2026-01-14"),
    },
    {
      id: TENANT_IDS[5],
      propertyId: PROPERTY_IDS[2],
      orgId: ORG_ID,
      name: "David Kim",
      email: "d.kim@email.com",
      phone: "+15550101006",
      unitNumber: "B",
      leaseStart: new Date("2025-11-01"),
      leaseEnd: new Date("2026-10-31"),
    },
  ]);

  // ─── Vendors ────────────────────────────────────────
  console.log("  Creating vendors...");
  await db.insert(schema.vendors).values([
    {
      id: VENDOR_IDS[0],
      orgId: ORG_ID,
      name: "AceFix Plumbing",
      trade: "plumber",
      email: "dispatch@acefix.com",
      phone: "+15550201001",
      rateNotes: "$95/hr, $150 emergency call-out fee",
      availabilityNotes: "M-F 7am-6pm, emergency line 24/7",
      preferenceScore: 0.9,
    },
    {
      id: VENDOR_IDS[1],
      orgId: ORG_ID,
      name: "BrightSpark Electric",
      trade: "electrician",
      email: "jobs@brightspark.com",
      phone: "+15550201002",
      rateNotes: "$110/hr, free estimates",
      availabilityNotes: "M-F 8am-5pm, Sat by appointment",
      preferenceScore: 0.85,
    },
    {
      id: VENDOR_IDS[2],
      orgId: ORG_ID,
      name: "CoolBreeze HVAC",
      trade: "hvac",
      email: "service@coolbreeze.com",
      phone: "+15550201003",
      rateNotes: "$125/hr, seasonal maintenance packages available",
      availabilityNotes: "M-Sat 7am-7pm, emergency 24/7 Jun-Sep",
      preferenceScore: 0.75,
    },
    {
      id: VENDOR_IDS[3],
      orgId: ORG_ID,
      name: "HandyPro Services",
      trade: "general",
      email: "book@handypro.com",
      phone: "+15550201004",
      rateNotes: "$75/hr, minimum 2 hours",
      availabilityNotes: "M-F 9am-5pm",
      preferenceScore: 0.7,
    },
  ]);

  // ─── Cases ──────────────────────────────────────────
  console.log("  Creating cases...");
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

  await db.insert(schema.cases).values([
    {
      id: CASE_IDS[0],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[0],
      propertyId: PROPERTY_IDS[0],
      source: "sms",
      rawMessage: "Hey, the kitchen sink is leaking badly. Water is pooling on the floor under the cabinet. Can someone come fix this ASAP?",
      category: "maintenance",
      urgency: "high",
      confidenceScore: 0.92,
      status: "in_progress",
      vendorId: VENDOR_IDS[0],
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(1),
    },
    {
      id: CASE_IDS[1],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[2],
      propertyId: PROPERTY_IDS[0],
      source: "email",
      rawMessage: "There's a burning smell coming from the electrical outlet in the living room. I've unplugged everything but the smell persists. This feels dangerous.",
      category: "emergency",
      urgency: "critical",
      confidenceScore: 0.97,
      status: "waiting_on_vendor",
      vendorId: VENDOR_IDS[1],
      createdAt: hoursAgo(1),
      updatedAt: hoursAgo(0.5),
    },
    {
      id: CASE_IDS[2],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[4],
      propertyId: PROPERTY_IDS[2],
      source: "email",
      rawMessage: "Hi, I wanted to ask about my lease renewal options. My lease ends in January and I'd like to discuss terms for staying another year.",
      category: "lease_question",
      urgency: "low",
      confidenceScore: 0.88,
      status: "waiting_on_tenant",
      createdAt: hoursAgo(48),
      updatedAt: hoursAgo(24),
    },
    {
      id: CASE_IDS[3],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[1],
      propertyId: PROPERTY_IDS[0],
      source: "sms",
      rawMessage: "The people in unit 2A are playing really loud music again. It's past midnight and I can't sleep. This is the third time this month.",
      category: "noise_complaint",
      urgency: "medium",
      confidenceScore: 0.78,
      status: "resolved",
      createdAt: hoursAgo(72),
      updatedAt: hoursAgo(48),
      resolvedAt: hoursAgo(48),
    },
  ]);

  // ─── Timeline Entries ───────────────────────────────
  console.log("  Creating timeline entries...");
  await db.insert(schema.caseTimeline).values([
    // Case 1: Kitchen sink leak (high, in_progress)
    { caseId: CASE_IDS[0], type: "case_created", details: "Case created from inbound SMS", createdAt: hoursAgo(3) },
    { caseId: CASE_IDS[0], type: "classified", details: "AI classified as maintenance/high (confidence: 0.92)", metadata: { category: "maintenance", urgency: "high", confidence: 0.92 }, createdAt: hoursAgo(2.95) },
    { caseId: CASE_IDS[0], type: "replied_to_tenant", details: "Acknowledged issue and informed tenant a plumber is being contacted", createdAt: hoursAgo(2.9) },
    { caseId: CASE_IDS[0], type: "pm_notified", details: "PM notified via SMS about high-urgency maintenance case", createdAt: hoursAgo(2.9) },
    { caseId: CASE_IDS[0], type: "vendor_dispatched", details: "Work order sent to AceFix Plumbing", metadata: { vendorId: VENDOR_IDS[0], vendorName: "AceFix Plumbing" }, createdAt: hoursAgo(2.85) },
    { caseId: CASE_IDS[0], type: "vendor_accepted", details: "AceFix Plumbing accepted. ETA: 2 hours", metadata: { eta: "2 hours" }, createdAt: hoursAgo(2.5) },
    { caseId: CASE_IDS[0], type: "status_change", details: "Status changed to in progress", createdAt: hoursAgo(2.5) },
    { caseId: CASE_IDS[0], type: "replied_to_tenant", details: "Informed tenant: plumber confirmed, arriving in approximately 2 hours", createdAt: hoursAgo(2.45) },

    // Case 2: Electrical emergency (critical, waiting on vendor)
    { caseId: CASE_IDS[1], type: "case_created", details: "Case created from inbound email", createdAt: hoursAgo(1) },
    { caseId: CASE_IDS[1], type: "classified", details: "AI classified as emergency/critical (confidence: 0.97)", metadata: { category: "emergency", urgency: "critical", confidence: 0.97 }, createdAt: hoursAgo(0.98) },
    { caseId: CASE_IDS[1], type: "replied_to_tenant", details: "URGENT: Acknowledged. Do not use the outlet. If you see smoke, evacuate and call 911. An electrician is being dispatched now.", createdAt: hoursAgo(0.97) },
    { caseId: CASE_IDS[1], type: "pm_notified", details: "PM notified via SMS about CRITICAL electrical emergency", createdAt: hoursAgo(0.97) },
    { caseId: CASE_IDS[1], type: "vendor_dispatched", details: "Emergency work order sent to BrightSpark Electric", metadata: { vendorId: VENDOR_IDS[1], vendorName: "BrightSpark Electric" }, createdAt: hoursAgo(0.95) },
    { caseId: CASE_IDS[1], type: "status_change", details: "Status changed to waiting on vendor", createdAt: hoursAgo(0.95) },

    // Case 3: Lease question (low, waiting on tenant)
    { caseId: CASE_IDS[2], type: "case_created", details: "Case created from inbound email", createdAt: hoursAgo(48) },
    { caseId: CASE_IDS[2], type: "classified", details: "AI classified as lease_question/low (confidence: 0.88)", metadata: { category: "lease_question", urgency: "low", confidence: 0.88 }, createdAt: hoursAgo(47.9) },
    { caseId: CASE_IDS[2], type: "replied_to_tenant", details: "Thanked tenant for reaching out. Informed them the PM will follow up with renewal options.", createdAt: hoursAgo(47.8) },
    { caseId: CASE_IDS[2], type: "pm_notified", details: "PM notified via email about lease renewal inquiry", createdAt: hoursAgo(47.8) },
    { caseId: CASE_IDS[2], type: "status_change", details: "Status changed to waiting on tenant", createdAt: hoursAgo(24) },

    // Case 4: Noise complaint (medium, resolved)
    { caseId: CASE_IDS[3], type: "case_created", details: "Case created from inbound SMS", createdAt: hoursAgo(72) },
    { caseId: CASE_IDS[3], type: "classified", details: "AI classified as noise_complaint/medium (confidence: 0.78)", metadata: { category: "noise_complaint", urgency: "medium", confidence: 0.78 }, createdAt: hoursAgo(71.9) },
    { caseId: CASE_IDS[3], type: "replied_to_tenant", details: "Acknowledged complaint. PM has been notified and will address the issue with the other tenant.", createdAt: hoursAgo(71.8) },
    { caseId: CASE_IDS[3], type: "pm_notified", details: "PM notified via SMS about noise complaint — third incident this month", createdAt: hoursAgo(71.8) },
    { caseId: CASE_IDS[3], type: "note", details: "Spoke with tenant in 2A. They apologized and agreed to keep music volume down after 10pm.", createdAt: hoursAgo(60) },
    { caseId: CASE_IDS[3], type: "replied_to_tenant", details: "Issue has been addressed with the neighboring tenant. Please let us know if it happens again.", createdAt: hoursAgo(50) },
    { caseId: CASE_IDS[3], type: "status_change", details: "Status changed to resolved", createdAt: hoursAgo(48) },
  ]);

  console.log("\n✅ Seed complete!\n");
  console.log("  Organization: Sunrise Property Management");
  console.log("  Properties:   3");
  console.log("  Tenants:      6");
  console.log("  Vendors:      4");
  console.log("  Cases:        4 (with 26 timeline entries)");
  console.log(`  User email:   ${userEmail}`);
  console.log(`  User ID:      ${USER_ID}`);
  console.log("");
  console.log("⚠️  IMPORTANT: Create a matching Supabase Auth user:");
  console.log(`  1. Go to your Supabase dashboard → Authentication → Users`);
  console.log(`  2. Click "Add user" → "Create new user"`);
  console.log(`  3. Email: ${userEmail}`);
  console.log(`  4. Password: set a password`);
  console.log(`  5. User UID: ${USER_ID}`);
  console.log(`     (If Supabase auto-generates a different UID, update the`);
  console.log(`      users table: UPDATE users SET id = '<new-uid>' WHERE id = '${USER_ID}')`);
  console.log("");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
