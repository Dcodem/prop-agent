"use client";

import { useState } from "react";

import { PropertyForm } from "@/components/properties/property-form";
import { Plus } from "lucide-react";

export function AddPropertyButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#00838f] text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#00838f]/20 hover:scale-[1.02] active:scale-95 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Property</span>
      </button>
      {open && <PropertyForm onClose={() => setOpen(false)} />}
    </>
  );
}
