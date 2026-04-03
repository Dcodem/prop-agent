"use client";

import { useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { CommandSearch } from "@/components/command-search";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(true)} />
      <CommandSearch />
      <main className="lg:ml-[220px] pt-16 min-h-screen px-6 lg:px-10 py-8">
        {children}
      </main>
    </>
  );
}
