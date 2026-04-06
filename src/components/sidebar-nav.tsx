"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SignOutButton } from "@/components/sign-out-button";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  iconColor?: string;
  badge?: number;
  badgeColor?: string;
  exact?: boolean;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", href: "/overview", icon: "dashboard", iconColor: "text-accent", exact: true },
      { label: "Cases", href: "/cases", icon: "assignment", iconColor: "text-caution" },
      { label: "Properties", href: "/properties", icon: "domain", iconColor: "text-info" },
      { label: "Tenants", href: "/tenants", icon: "groups", iconColor: "text-purple" },
      { label: "Vendors", href: "/vendors", icon: "engineering", iconColor: "text-warning-dim" },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Settings", href: "/settings", icon: "settings", iconColor: "text-on-surface-variant" },
    ],
  },
];

function isActiveRoute(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface SidebarNavProps {
  open?: boolean;
  onClose?: () => void;
  userInfo?: { name: string; email: string; role: string };
}

export function SidebarNav({ open = false, onClose, userInfo }: SidebarNavProps) {
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open || !onClose) return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;

    triggerRef.current = document.activeElement;
    const aside = asideRef.current;
    if (!aside) return;

    const sel = 'a[href], button, [tabindex]:not([tabindex="-1"])';
    const first = aside.querySelector<HTMLElement>(sel);
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const all = aside.querySelectorAll<HTMLElement>(sel);
      if (!all.length) return;
      if (e.shiftKey && document.activeElement === all[0]) {
        e.preventDefault();
        all[all.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === all[all.length - 1]) {
        e.preventDefault();
        all[0].focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [open, onClose]);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside
        ref={asideRef}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? "Navigation menu" : undefined}
        className={`w-[220px] h-screen fixed left-0 top-0 overflow-y-auto bg-surface-container-low flex flex-col py-8 px-4 z-50 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant"
            aria-label="Close sidebar"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-xl">close</span>
          </button>
        )}

        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold tracking-tight text-on-surface">PropAgent</h1>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">Property Management</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navSections.map((section) => (
            <div key={section.heading}>
              <div className="pt-4 pb-2 px-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                {section.heading}
              </div>
              {section.items.map((item) => {
                const active = isActiveRoute(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                      active
                        ? "text-accent font-bold border-r-2 border-accent hover:bg-accent-container/50"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined text-[20px] ${item.iconColor ?? ""}`}
                      style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge != null && item.badge > 0 && (
                      <span className={`min-w-[20px] h-5 flex items-center justify-center ${item.badgeColor || "bg-primary"} text-white text-[11px] font-bold rounded-full px-1.5`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <Link
          href="/profile"
          onClick={onClose}
          className="mt-auto flex items-center gap-3 px-2 pt-6 border-t border-outline-variant hover:bg-surface-container-high/50 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
            {userInfo ? getInitials(userInfo.name) : "PM"}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold truncate">{userInfo?.name ?? "Property Manager"}</p>
            <p className="text-[11px] text-on-surface-variant truncate capitalize">{userInfo?.role ?? "owner"}</p>
          </div>
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
        </Link>

        {/* Quick Actions */}
        <div className="mt-3 space-y-1">
          <Link
            href="/support"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-sm font-medium">Support</span>
          </Link>
          <SignOutButton className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors w-full">
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
