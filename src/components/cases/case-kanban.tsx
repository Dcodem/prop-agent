"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { formatEnum, timeAgo } from "@/lib/utils";
import type { Case, Property, Tenant } from "@/lib/db/schema";

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-error",
  high: "bg-error",
  medium: "bg-on-surface-variant",
  low: "bg-outline",
};

const URGENCY_BORDER: Record<string, string> = {
  critical: "border-error",
  high: "border-error",
  medium: "border-on-surface-variant",
  low: "border-outline",
};

const CATEGORIES = ["emergency", "plumbing", "electrical", "hvac", "general", "structural"];

function statusToColumn(status: string): string {
  switch (status) {
    case "open": return "new";
    case "waiting_on_vendor":
    case "in_progress": return status;
    case "waiting_on_tenant": return "in_progress";
    case "resolved":
    case "closed": return "resolved";
    default: return "new";
  }
}

const COLUMNS = [
  { key: "new", label: "New Cases", dot: "bg-on-surface" },
  { key: "waiting_on_vendor", label: "Vendor Dispatched", dot: "bg-on-surface-variant" },
  { key: "in_progress", label: "In Progress", dot: "bg-accent" },
  { key: "resolved", label: "Resolved", dot: "bg-outline" },
] as const;

interface CaseKanbanProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

export function CaseKanban({ cases, properties, tenants }: CaseKanbanProps) {
  const propertyMap = new Map(properties.map((p) => [p.id, p]));
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));

  const [columnOverrides, setColumnOverrides] = useState<Record<string, string>>({});
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, string>>({});
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState<string | null>(null);
  const draggedCaseId = useRef<string | null>(null);

  const columns: Record<string, Case[]> = { new: [], waiting_on_vendor: [], in_progress: [], resolved: [] };
  for (const c of cases) {
    const col = columnOverrides[c.id] ?? statusToColumn(c.status);
    columns[col]?.push(c);
  }

  function handleDragStart(caseId: string) {
    draggedCaseId.current = caseId;
    setDraggingId(caseId);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverCol(null);
  }

  function handleDragOver(e: React.DragEvent, colKey: string) {
    e.preventDefault();
    if (dragOverCol !== colKey) setDragOverCol(colKey);
  }

  function handleDragLeave(e: React.DragEvent, colKey: string) {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      if (dragOverCol === colKey) setDragOverCol(null);
    }
  }

  function handleDrop(colKey: string) {
    if (draggedCaseId.current) {
      setColumnOverrides((prev) => ({ ...prev, [draggedCaseId.current!]: colKey }));
    }
    draggedCaseId.current = null;
    setDraggingId(null);
    setDragOverCol(null);
  }

  function handleCategoryChange(caseId: string, category: string) {
    setCategoryOverrides((prev) => ({ ...prev, [caseId]: category }));
    setOpenCategoryDropdown(null);
  }

  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {COLUMNS.map((col) => {
          const colCases = columns[col.key] ?? [];
          const isResolved = col.key === "resolved";
          const isDragOver = dragOverCol === col.key;

          return (
            <motion.div
              key={col.key}
              layout
              className={`flex flex-col gap-4 min-h-[200px] rounded-xl p-3 transition-colors duration-200 ${
                isDragOver
                  ? "bg-accent/[0.06] ring-2 ring-accent/30 ring-offset-2 ring-offset-surface-container-lowest"
                  : "bg-transparent"
              }`}
              onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, col.key)}
              onDragLeave={(e) => handleDragLeave(e as unknown as React.DragEvent, col.key)}
              onDrop={() => handleDrop(col.key)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                  <h3 className="font-bold text-sm tracking-tight text-on-surface-variant uppercase">{col.label}</h3>
                </div>
                <motion.span
                  key={colCases.length}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-xs font-bold text-outline bg-surface-container-low px-2 py-0.5 rounded-full"
                >
                  {colCases.length}
                </motion.span>
              </div>

              {/* Drop placeholder at top when dragging over */}
              <AnimatePresence>
                {isDragOver && draggingId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 48 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="rounded-xl border-2 border-dashed border-accent/40 bg-accent/[0.04] flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-accent/60">Drop here</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cards */}
              <AnimatePresence mode="popLayout">
                {colCases.map((c) => {
                  const property = c.propertyId ? propertyMap.get(c.propertyId) : null;
                  const tenant = c.tenantId ? tenantMap.get(c.tenantId) : null;
                  const displayCategory = categoryOverrides[c.id] ?? c.category ?? "general";
                  const isDragging = draggingId === c.id;

                  return (
                    <motion.div
                      key={c.id}
                      layout
                      layoutId={c.id}
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{
                        opacity: isDragging ? 0.4 : 1,
                        scale: isDragging ? 0.95 : 1,
                        y: 0,
                        rotate: isDragging ? 1.5 : 0,
                      }}
                      exit={{ opacity: 0, scale: 0.9, y: -12 }}
                      transition={{
                        layout: { type: "spring", stiffness: 350, damping: 30 },
                        opacity: { duration: 0.15 },
                        scale: { duration: 0.15 },
                      }}
                      draggable
                      onDragStart={() => handleDragStart(c.id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab active:cursor-grabbing ${isDragging ? "z-50 relative" : ""}`}
                    >
                      <Link href={`/cases/${c.id}`} className="block" draggable={false}>
                        <div
                          className={`bg-surface-container-lowest p-5 rounded-xl border-l-[3px] ${
                            isResolved
                              ? "border-outline-variant opacity-70"
                              : URGENCY_BORDER[c.urgency ?? "low"]
                          } flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md ${
                            isDragging ? "shadow-xl" : ""
                          }`}
                        >
                          {/* Top row */}
                          <div className="flex justify-between items-start">
                            {isResolved ? (
                              <>
                                <div className={`w-3 h-3 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`}></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              </>
                            ) : (
                              <>
                                <div className={`w-3 h-3 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`} title={`${formatEnum(c.urgency ?? "low")} Priority`}></div>
                                {c.confidenceScore != null && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    (c.urgency === "critical" || c.urgency === "high")
                                      ? "bg-error/10 text-error"
                                      : "bg-surface-container-low text-on-surface-variant"
                                  }`}>
                                    {Math.round(c.confidenceScore * 100)}% Confidence
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {/* Category badge */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenCategoryDropdown(openCategoryDropdown === c.id ? null : c.id);
                              }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent-container text-accent uppercase tracking-wider hover:bg-accent/10 transition-colors"
                            >
                              {formatEnum(displayCategory)}
                            </button>
                            <AnimatePresence>
                              {openCategoryDropdown === c.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  transition={{ duration: 0.12, ease: "easeOut" }}
                                  className="absolute left-0 top-full mt-1 z-30 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 py-1 min-w-[140px]"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                >
                                  {CATEGORIES.map((cat) => (
                                    <button
                                      key={cat}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCategoryChange(c.id, cat);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-primary-fixed transition-colors capitalize ${
                                        displayCategory === cat ? "text-accent font-bold" : "text-on-surface"
                                      }`}
                                    >
                                      {formatEnum(cat)}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Title & location */}
                          <div>
                            <h4 className="font-bold text-on-surface leading-snug mb-1 line-clamp-2">{c.rawMessage}</h4>
                            <p className="text-xs text-on-surface-variant font-medium">
                              {tenant?.unitNumber ? `Unit ${tenant.unitNumber}` : ""}
                              {tenant?.unitNumber && property ? " \u2022 " : ""}
                              {property?.address ?? ""}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                            {tenant ? (
                              <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant border-2 border-white">
                                {tenant.name.charAt(0).toUpperCase()}
                              </div>
                            ) : (
                              <div></div>
                            )}
                            <span className="text-[10px] text-outline font-medium italic">
                              {isResolved && c.resolvedAt
                                ? `Closed ${timeAgo(c.resolvedAt)}`
                                : timeAgo(c.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {colCases.length === 0 && !isDragOver && (
                <div className="bg-surface-container-lowest/50 p-5 rounded-xl border border-dashed border-outline-variant/20 text-center">
                  <p className="text-xs text-outline">No cases in this stage</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
