"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/cases", label: "Cases", icon: "assignment" },
  { href: "/properties", label: "Properties", icon: "domain" },
  { href: "/tenants", label: "Tenants", icon: "groups" },
  { href: "/vendors", label: "Vendors", icon: "engineering" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col fixed left-0 top-0 h-full py-6 h-screen w-64 bg-slate-50 border-r-0 text-sm font-medium z-30">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00838f] rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <div>
            <div className="font-extrabold text-cyan-900 leading-tight">PropAgent</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Property Management</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return isActive ? (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 text-cyan-900 border-l-4 border-cyan-600 bg-white pl-4 py-3 ml-2 rounded-l-lg cursor-pointer"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all pl-6 py-3 cursor-pointer"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 mt-auto space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all py-3 cursor-pointer"
        >
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </Link>
        <a
          href="mailto:support@propagent.com"
          className="flex items-center gap-3 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all py-3 cursor-pointer"
        >
          <span className="material-symbols-outlined">help</span>
          <span>Support</span>
        </a>
        <SignOutButton className="flex items-center gap-3 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all py-3 cursor-pointer w-full">
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </SignOutButton>
      </div>
    </aside>
  );
}
