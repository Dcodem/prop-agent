"use client";

import Link from "next/link";

export function TopBar() {
  return (
    <header className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl flex justify-between items-center px-8 h-16 antialiased tracking-tight">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold tracking-tighter text-cyan-900" style={{ fontFamily: "'Manrope', sans-serif" }}>PropAgent</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined text-slate-500 p-2 rounded-full hover:bg-slate-50 cursor-pointer">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#006872] rounded-full"></span>
        </div>
        <Link href="/settings">
          <span className="material-symbols-outlined text-slate-500 p-2 rounded-full hover:bg-slate-50 cursor-pointer">settings</span>
        </Link>
        <Link href="/profile" className="w-8 h-8 rounded-full bg-[#00838f] flex items-center justify-center text-white text-xs font-bold ml-2">
          AR
        </Link>
      </div>
    </header>
  );
}
