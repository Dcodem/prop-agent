"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { VendorForm } from "@/components/vendors/vendor-form";

interface VendorsPageClientProps {
  vendors: {
    id: string;
    name: string;
    trade: string;
    email: string | null;
    phone: string | null;
    rateNotes: string | null;
    availabilityNotes: string | null;
    preferenceScore: number | null;
  }[];
  children: ReactNode;
}

export function VendorsPageClient({ children }: VendorsPageClientProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex justify-between items-end">
        {children}
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#00838f] text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#00838f]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>
      {showForm && (
        <VendorForm onClose={() => setShowForm(false)} />
      )}
    </>
  );
}
