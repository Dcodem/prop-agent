"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/cases", label: "Cases", icon: "assignment" },
  { href: "/properties", label: "Properties", icon: "domain" },
  { href: "/tenants", label: "Tenants", icon: "groups" },
  { href: "/vendors", label: "Vendors", icon: "engineering" },
  { href: "/settings", label: "Settings", icon: "settings" },
  { href: "/profile", label: "Profile", icon: "person" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <div className="px-6 mb-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00838f] rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <div>
            <div className="font-extrabold text-cyan-900 leading-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>PropAgent</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Management Portal</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "flex items-center gap-3 text-cyan-900 border-l-4 border-cyan-600 bg-white pl-4 py-3 ml-2 rounded-l-lg cursor-pointer"
                  : "flex items-center gap-3 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all pl-6 py-3 cursor-pointer"
              }
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 mt-auto space-y-1">
        <a className="flex items-center gap-3 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all py-3 cursor-pointer" href="#">
          <span className="material-symbols-outlined">help</span>
          <span>Support</span>
        </a>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all py-3 cursor-pointer w-full text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}
