"use client";

import { useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { CommandSearch } from "@/components/command-search";
import type { SearchEntities } from "@/components/command-search";
import { Toaster } from "@/components/ui/sonner";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { NavigationProgress } from "@/components/navigation-progress";

interface DashboardShellProps {
  children: React.ReactNode;
  searchEntities?: SearchEntities;
  userInfo?: { name: string; email: string; role: string };
}

export function DashboardShell({ children, searchEntities, userInfo }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-lg focus:text-sm focus:font-bold">
        Skip to content
      </a>
      <SidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} userInfo={userInfo} />
      <TopBar onMenuToggle={() => setSidebarOpen(true)} />
      <NavigationProgress />
      <CommandSearch searchEntities={searchEntities} />
      <KeyboardShortcuts />
      <main id="main-content" role="main" aria-label="Dashboard content" className="lg:ml-[220px] pt-16 min-h-screen px-6 lg:px-10 py-8 animate-fade-in-up">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </>
  );
}
