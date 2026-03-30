"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in sidebar */}
          <div className="fixed inset-y-0 left-0 w-60 bg-[#FFFFFF] border-r border-[rgba(0,0,0,0.06)] z-50">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                autoFocus
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarNav />
          </div>
        </div>
      )}
    </>
  );
}
