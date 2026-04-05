"use client";

import { useState } from "react";
import Link from "next/link";
import type { vendors } from "@/lib/db/schema";
import { VendorTable } from "@/components/vendors/vendor-table";
import { VendorForm } from "@/components/vendors/vendor-form";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";

type Vendor = typeof vendors.$inferSelect;

export function VendorsPageClient({ vendors }: { vendors: Vendor[] }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const complianceRate = vendors.length > 0
    ? ((vendors.filter((v) => (v.preferenceScore ?? 0) >= 0.5).length / vendors.length) * 100).toFixed(1)
    : "0.0";
  const tradeCount = new Set(vendors.map((v) => v.trade)).size;

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface mb-2">
            Vendors
          </h1>
          <p className="text-on-surface-variant max-w-lg leading-relaxed">
            Centralized management for your preferred trade professionals and
            service providers across all property portfolios.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add Vendor
        </button>
      </div>

      {/* Stats — above table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon="engineering" iconBg="bg-info-container" iconColor="text-info" value={vendors.length} label="Total Vendors" />
        <StatCard icon="verified" iconBg="bg-success-container" iconColor="text-on-success-container" value={`${complianceRate}%`} label="Compliance Rate" />
        <StatCard icon="pending_actions" iconBg="bg-purple-container" iconColor="text-purple" value={tradeCount} label="Trade Categories" />
      </div>

      {/* Vendor Table */}
      <VendorTable vendors={vendors} />

      {/* Promotion / Action Section */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 card-shadow border border-outline-variant/10 flex items-center justify-between">
        <div className="max-w-2xl">
          <h3 className="text-on-surface text-xl font-bold mb-2">
            Optimizing your vendor relationships?
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Unlock advanced analytics, automated insurance tracking, and tiered
            performance scoring for your entire network with our Premium Vendor
            Management module.
          </p>
        </div>
        <Link href="/settings" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm shadow-sm hover:bg-primary/90 transition-colors cursor-pointer inline-block shrink-0">
          Configure Settings
        </Link>
      </div>

      {/* Add Vendor Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Vendor"
      >
        <VendorForm onSuccess={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
}
