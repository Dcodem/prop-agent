"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchItem {
  label: string;
  href: string;
  icon: string;
  section: string;
}

const searchItems: SearchItem[] = [
  { label: "Dashboard", href: "/overview", icon: "dashboard", section: "Pages" },
  { label: "Cases", href: "/cases", icon: "assignment", section: "Pages" },
  { label: "Properties", href: "/properties", icon: "domain", section: "Pages" },
  { label: "Tenants", href: "/tenants", icon: "groups", section: "Pages" },
  { label: "Vendors", href: "/vendors", icon: "engineering", section: "Pages" },
  { label: "Settings", href: "/settings", icon: "settings", section: "Pages" },
  { label: "Profile", href: "/profile", icon: "person", section: "Pages" },
  { label: "Support", href: "/support", icon: "help", section: "Pages" },
  { label: "New Case", href: "/cases/new", icon: "add_circle", section: "Actions" },
];

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query
    ? searchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  const sections = Array.from(new Set(filtered.map((i) => i.section)));

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      handleClose();
      router.push(href);
    },
    [handleClose, router]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) {
          setQuery("");
          setSelectedIndex(0);
        }
      }
      if (e.key === "Escape" && open) {
        handleClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].href);
    }
  };

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-lg mx-4 bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/20">
              <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search cases, properties, tenants..."
                className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-surface-container-high rounded text-[11px] font-bold text-on-surface-variant">
                ESC
              </kbd>
            </div>
            <div className="max-h-[320px] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-3xl mb-2">search_off</span>
                  <p className="text-sm text-on-surface-variant">No results for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                sections.map((section) => (
                  <div key={section}>
                    <div className="px-5 py-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {section}
                    </div>
                    {filtered
                      .filter((item) => item.section === section)
                      .map((item) => {
                        flatIndex++;
                        const idx = flatIndex;
                        return (
                          <button
                            key={item.href}
                            onClick={() => handleSelect(item.href)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                              selectedIndex === idx
                                ? "bg-primary/5 text-primary"
                                : "text-on-surface hover:bg-surface-container-low"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`material-symbols-outlined text-[18px] ${
                                selectedIndex === idx ? "text-primary" : "text-on-surface-variant"
                              }`}
                            >
                              {item.icon}
                            </span>
                            <span className="text-sm font-medium">{item.label}</span>
                            {selectedIndex === idx && (
                              <span aria-hidden="true" className="material-symbols-outlined text-[14px] ml-auto text-on-surface-variant">
                                subdirectory_arrow_left
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                ))
              )}
            </div>
            <div className="px-5 py-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-surface-container-high rounded font-bold">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-surface-container-high rounded font-bold">↵</kbd>
                  open
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-surface-container-high rounded font-bold">esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
