"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "propagent-welcome-dismissed";

interface QuickAction {
  icon: string;
  label: string;
  description: string;
  href: string;
  done: boolean;
}

export function WelcomeBanner({
  hasProperties,
  hasCases,
  hasVendors,
}: {
  hasProperties: boolean;
  hasCases: boolean;
  hasVendors: boolean;
}) {
  const [dismissed, setDismissed] = useState(true); // default hidden to prevent flash

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (dismissed) return null;

  const actions: QuickAction[] = [
    {
      icon: "domain",
      label: "Add your first property",
      description: "Start by adding a building to your portfolio",
      href: "/properties/new",
      done: hasProperties,
    },
    {
      icon: "assignment",
      label: "Log a maintenance case",
      description: "Record a tenant request or issue",
      href: "/cases/new",
      done: hasCases,
    },
    {
      icon: "engineering",
      label: "Add a vendor",
      description: "Onboard a contractor for dispatch",
      href: "/vendors/new",
      done: hasVendors,
    },
  ];

  const completedCount = actions.filter((a) => a.done).length;
  const allDone = completedCount === actions.length;

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden card-shadow animate-fade-in-up">
      <div className="px-8 py-6 flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              waving_hand
            </span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">
              Welcome to PropAgent
            </h2>
            <p className="text-sm text-on-surface-variant mt-1 max-w-lg">
              Get started in under 5 minutes. Complete these steps to set up your portfolio and let the AI assistant take over the heavy lifting.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss welcome banner"
          className="text-on-surface-variant hover:text-on-surface p-1 transition-colors shrink-0"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-8 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / actions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-on-surface-variant tabular-nums">
            {completedCount}/{actions.length}
          </span>
        </div>
      </div>

      {/* Quick-start actions */}
      <div className="px-8 pb-6 pt-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${
                action.done
                  ? "bg-success-container/30 border-success-border/30"
                  : "bg-surface-container-low border-transparent hover:border-accent/20 hover:bg-accent/[0.03]"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  action.done ? "bg-success/10" : "bg-surface-container-high group-hover:bg-accent/10"
                } transition-colors`}
              >
                <span
                  className={`material-symbols-outlined text-lg ${
                    action.done ? "text-success" : "text-on-surface-variant group-hover:text-accent"
                  } transition-colors`}
                  style={action.done ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {action.done ? "check_circle" : action.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p
                  className={`text-sm font-bold ${
                    action.done ? "text-on-surface-variant line-through" : "text-on-surface"
                  }`}
                >
                  {action.label}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {action.done ? "Complete" : action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All done state */}
      {allDone && (
        <div className="px-8 pb-6 pt-1">
          <div className="bg-success-container/30 border border-success-border/30 rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-success" style={{ fontVariationSettings: "'FILL' 1" }}>
                celebration
              </span>
              <p className="text-sm font-bold text-on-surface">
                You&apos;re all set! PropAgent is monitoring your portfolio.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-sm font-bold text-accent hover:underline underline-offset-4"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <div className="px-8 pb-5 flex items-center gap-2 text-on-surface-variant">
        <span className="text-xs">Tip: Press</span>
        <kbd className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 bg-surface-container-high text-on-surface text-[10px] font-semibold rounded border border-outline-variant shadow-sm">
          ?
        </kbd>
        <span className="text-xs">for keyboard shortcuts, or</span>
        <kbd className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 bg-surface-container-high text-on-surface text-[10px] font-semibold rounded border border-outline-variant shadow-sm">
          &#8984;K
        </kbd>
        <span className="text-xs">to search anything.</span>
      </div>
    </section>
  );
}
