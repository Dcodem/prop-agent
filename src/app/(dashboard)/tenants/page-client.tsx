"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { TenantForm } from "@/components/tenants/tenant-form";

interface TenantsPageClientProps {
  properties: { id: string; address: string }[];
  children: ReactNode;
}

export function TenantsPageClient({ properties, children }: TenantsPageClientProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex justify-between items-end">
        {children}
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2.5 px-6 rounded flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          + Add Tenant
        </button>
      </div>
      {showForm && (
        <TenantForm
          properties={properties}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
