"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const topNavItems = [
  { href: "/cases", label: "Cases" },
  { href: "/properties", label: "Properties" },
  { href: "/vendors", label: "Vendors" },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl flex justify-between items-center px-8 h-16 antialiased tracking-tight ml-64" style={{ width: "calc(100% - 16rem)" }}>
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold tracking-tighter text-cyan-900">PropAgent</span>
        <div className="hidden md:flex gap-6 ml-10">
          {topNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "text-cyan-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 transition-colors px-3 py-1 rounded-md"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined text-slate-500 p-2 rounded-full hover:bg-slate-50 cursor-pointer">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#006872] rounded-full"></span>
        </div>
        <Link href="/settings">
          <span className="material-symbols-outlined text-slate-500 p-2 rounded-full hover:bg-slate-50 cursor-pointer">settings</span>
        </Link>
        <Link href="/profile" className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ml-2 flex items-center justify-center text-slate-600 font-bold text-xs">
          PM
        </Link>
      </div>
    </header>
  );
}
