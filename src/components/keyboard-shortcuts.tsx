"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/*  Shortcut definitions                                              */
/* ------------------------------------------------------------------ */

interface ShortcutGroup {
  heading: string;
  items: { keys: string[]; label: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    heading: "Navigation",
    items: [
      { keys: ["G", "D"], label: "Go to Dashboard" },
      { keys: ["G", "C"], label: "Go to Cases" },
      { keys: ["G", "P"], label: "Go to Properties" },
      { keys: ["G", "T"], label: "Go to Tenants" },
      { keys: ["G", "V"], label: "Go to Vendors" },
      { keys: ["G", "S"], label: "Go to Settings" },
    ],
  },
  {
    heading: "Actions",
    items: [
      { keys: ["C"], label: "New Case" },
    ],
  },
  {
    heading: "General",
    items: [
      { keys: ["\u2318", "K"], label: "Search" },
      { keys: ["?"], label: "Keyboard shortcuts" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  "Go to" mapping (second key after G)                              */
/* ------------------------------------------------------------------ */

const GO_TO_MAP: Record<string, string> = {
  d: "/overview",
  c: "/cases",
  p: "/properties",
  t: "/tenants",
  v: "/vendors",
  s: "/settings",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function isEditableTarget(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  // Also skip when inside a cmdk dialog (command palette)
  if (el.closest("[cmdk-input]")) return true;
  return false;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function KeyboardShortcuts() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);

  // Track whether G was pressed recently (two-key sequence)
  const gPressedRef = useRef(false);
  const gTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearGTimer = useCallback(() => {
    gPressedRef.current = false;
    if (gTimerRef.current) {
      clearTimeout(gTimerRef.current);
      gTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Never intercept when a modifier key is held (except Shift for ?)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Never intercept in editable elements
      if (isEditableTarget(e)) return;

      // Don't fire while the help dialog is open (let it handle Escape etc.)
      // But allow ? to close it
      if (helpOpen && e.key !== "?") return;

      const key = e.key.toLowerCase();

      /* ---- Two-key: second key after G ---- */
      if (gPressedRef.current) {
        clearGTimer();
        const dest = GO_TO_MAP[key];
        if (dest) {
          e.preventDefault();
          router.push(dest);
        }
        return;
      }

      /* ---- First key: G (start sequence) ---- */
      if (key === "g") {
        gPressedRef.current = true;
        gTimerRef.current = setTimeout(() => {
          gPressedRef.current = false;
        }, 1000);
        return;
      }

      /* ---- Single-key shortcuts ---- */
      if (key === "c") {
        e.preventDefault();
        router.push("/cases/new");
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((prev) => !prev);
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearGTimer();
    };
  }, [router, helpOpen, clearGTimer]);

  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent className="bg-surface-container-lowest rounded-2xl border-outline-variant max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-on-surface text-lg font-bold flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-xl text-accent">keyboard</span>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-on-surface-variant text-sm">
            Navigate quickly without touching your mouse.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                {group.heading}
              </h3>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{item.label}</span>
                    <span className="flex items-center gap-1">
                      {item.keys.map((k, i) => (
                        <span key={i}>
                          {i > 0 && (
                            <span className="text-on-surface-variant text-xs mx-0.5">then</span>
                          )}
                          <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-md border border-outline-variant shadow-sm">
                            {k}
                          </kbd>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
