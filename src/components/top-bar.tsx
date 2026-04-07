"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TopBarProps {
  onMenuToggle?: () => void;
}

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: "warning", iconBg: "bg-error-container", iconColor: "text-on-error-container", title: "Critical case opened", desc: "Emergency plumbing issue reported at 45 Oak St, Unit 3B", time: "12m ago", unread: true, href: "/cases", group: "today" as const },
  { id: 2, icon: "assignment", iconBg: "bg-info-container", iconColor: "text-info", title: "3 cases awaiting review", desc: "New maintenance requests need triage and vendor assignment", time: "2h ago", unread: true, href: "/cases", group: "today" as const },
  { id: 3, icon: "smart_toy", iconBg: "bg-accent/10", iconColor: "text-accent", title: "AI resolved 2 cases", desc: "Routine maintenance requests auto-resolved with high confidence", time: "4h ago", unread: true, href: "/cases", group: "today" as const },
  { id: 4, icon: "event", iconBg: "bg-caution-container", iconColor: "text-on-caution-container", title: "Lease expiring soon", desc: "2 tenant leases expire within the next 30 days", time: "5h ago", unread: false, href: "/tenants", group: "today" as const },
  { id: 5, icon: "engineering", iconBg: "bg-warning-container", iconColor: "text-warning-dim", title: "Vendor confirmed", desc: "Quick Fix Plumbing confirmed appointment for tomorrow 9AM", time: "1d ago", unread: false, href: "/vendors", group: "earlier" as const },
  { id: 6, icon: "check_circle", iconBg: "bg-success/10", iconColor: "text-success", title: "Inspection complete", desc: "Annual fire safety inspection passed for 120 Main St", time: "2d ago", unread: false, href: "/properties", group: "earlier" as const },
];

export function TopBar({ onMenuToggle }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const todayNotifs = notifications.filter((n) => n.group === "today");
  const earlierNotifs = notifications.filter((n) => n.group === "earlier");

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-220px)] h-16 z-30 bg-surface-container-lowest/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant"
            aria-label="Open navigation"
          >
            <span aria-hidden="true" className="material-symbols-outlined">menu</span>
          </button>
        )}
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="flex items-center gap-2 bg-surface-container-high rounded-lg pl-3 pr-2 py-1.5 text-sm w-48 sm:w-64 hover:bg-surface-container-high/80 transition-colors group"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-lg text-on-surface-variant">search</span>
          <span className="text-on-surface-variant text-sm flex-1 text-left">Search...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-surface-container-lowest rounded text-[11px] font-bold text-on-surface-variant border border-outline-variant/20">
            &#8984;K
          </kbd>
        </button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2 text-on-surface-variant">
          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-surface-container-low rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <span aria-hidden="true" className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <motion.span
                  key={unreadCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-[400px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-variant overflow-hidden z-50"
                >
                  <div className="px-5 py-4 border-b border-surface-variant flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-on-surface">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] font-bold text-accent hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[420px] overflow-y-auto">
                    {/* Today */}
                    {todayNotifs.length > 0 && (
                      <>
                        <div className="px-5 py-2 bg-surface-container-low/50">
                          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Today</span>
                        </div>
                        {todayNotifs.map((n, i) => (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                          >
                            <Link
                              href={n.href}
                              onClick={() => {
                                setNotifications((prev) => prev.map((p) => p.id === n.id ? { ...p, unread: false } : p));
                                setShowNotifications(false);
                              }}
                              className={`flex items-start gap-3 px-5 py-3.5 hover:bg-surface-container-low transition-colors border-b border-surface-variant/50 ${n.unread ? "bg-accent/[0.03]" : ""}`}
                            >
                              <div className={`w-9 h-9 rounded-lg ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                <span aria-hidden="true" className={`material-symbols-outlined text-[18px] ${n.iconColor}`}>{n.icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm truncate ${n.unread ? "font-bold text-on-surface" : "font-medium text-on-surface-variant"}`}>{n.title}</p>
                                  {n.unread && <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 animate-pulse" />}
                                </div>
                                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{n.desc}</p>
                                <p className="text-[11px] text-outline mt-1">{n.time}</p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </>
                    )}
                    {/* Earlier */}
                    {earlierNotifs.length > 0 && (
                      <>
                        <div className="px-5 py-2 bg-surface-container-low/50">
                          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Earlier</span>
                        </div>
                        {earlierNotifs.map((n, i) => (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (todayNotifs.length + i) * 0.04, duration: 0.2 }}
                          >
                            <Link
                              href={n.href}
                              onClick={() => {
                                setNotifications((prev) => prev.map((p) => p.id === n.id ? { ...p, unread: false } : p));
                                setShowNotifications(false);
                              }}
                              className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface-container-low transition-colors border-b border-surface-variant/50"
                            >
                              <div className={`w-9 h-9 rounded-lg ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                <span aria-hidden="true" className={`material-symbols-outlined text-[18px] ${n.iconColor}`}>{n.icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-on-surface-variant truncate">{n.title}</p>
                                <p className="text-xs text-on-surface-variant/70 mt-0.5 line-clamp-1">{n.desc}</p>
                                <p className="text-[11px] text-outline mt-1">{n.time}</p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="px-5 py-3 border-t border-surface-variant flex items-center justify-between">
                    <Link
                      href="/settings"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      Notification Settings
                    </Link>
                    <Link
                      href="/cases"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-on-surface-variant hover:text-on-surface"
                    >
                      View All
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }))}
            aria-label="Keyboard shortcuts"
            className="p-2 hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined">help_outline</span>
          </button>
          <Link href="/settings" aria-label="Settings" className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <span aria-hidden="true" className="material-symbols-outlined">settings</span>
          </Link>
          <Link href="/profile" aria-label="Profile" className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <span aria-hidden="true" className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
