"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

const TRANSPARENT_IMG = typeof document !== "undefined" ? (() => {
  const img = new Image();
  img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  return img;
})() : null;

interface CaseKanbanProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

export function CaseKanban({ cases, properties, tenants }: CaseKanbanProps) {
  const propertyMap = new Map(properties.map((p) => [p.id, p]));
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));

  const [columnOverrides, setColumnOverrides] = useState<Record<string, string>>({});
  const [columnOrder, setColumnOrder] = useState<Record<string, string[]>>({});
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, string>>({});
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [justDroppedId, setJustDroppedId] = useState<string | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverCardId, setHoverCardId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<"above" | "below">("below");
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState<string | null>(null);
  const draggedCaseId = useRef<string | null>(null);
  const dropTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build columns from cases + overrides
  const columns: Record<string, Case[]> = { new: [], waiting_on_vendor: [], in_progress: [], resolved: [] };
  for (const c of cases) {
    const col = columnOverrides[c.id] ?? statusToColumn(c.status);
    columns[col]?.push(c);
  }

  // Apply custom ordering per column
  for (const colKey of Object.keys(columns)) {
    const order = columnOrder[colKey];
    if (order) {
      const caseMap = new Map(columns[colKey].map((c) => [c.id, c]));
      const ordered: Case[] = [];
      for (const id of order) {
        const c = caseMap.get(id);
        if (c) { ordered.push(c); caseMap.delete(id); }
      }
      for (const c of caseMap.values()) ordered.push(c);
      columns[colKey] = ordered;
    }
  }

  const handleDocDragOver = useCallback((e: DragEvent) => {
    setGhostPos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (draggingId) {
      document.addEventListener("dragover", handleDocDragOver);
      return () => document.removeEventListener("dragover", handleDocDragOver);
    } else {
      setGhostPos(null);
    }
  }, [draggingId, handleDocDragOver]);

  useEffect(() => {
    if (justDroppedId) {
      dropTimeoutRef.current = setTimeout(() => setJustDroppedId(null), 400);
      return () => { if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current); };
    }
  }, [justDroppedId]);

  function handleDragStart(e: React.DragEvent, caseId: string) {
    draggedCaseId.current = caseId;
    setDraggingId(caseId);
    if (TRANSPARENT_IMG) e.dataTransfer.setDragImage(TRANSPARENT_IMG, 0, 0);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverCol(null);
    setHoverCardId(null);
    setGhostPos(null);
  }

  function handleColDragOver(e: React.DragEvent, colKey: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colKey) setDragOverCol(colKey);
  }

  function handleColDragLeave(e: React.DragEvent, colKey: string) {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      if (dragOverCol === colKey) setDragOverCol(null);
      setHoverCardId(null);
    }
  }

  function handleCardDragOver(e: React.DragEvent, cardId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (cardId === draggingId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setHoverCardId(cardId);
    setHoverPosition(e.clientY < midY ? "above" : "below");
  }

  function handleDrop(colKey: string) {
    const droppedId = draggedCaseId.current;
    if (!droppedId) return;

    const sourceCol = columnOverrides[droppedId] ?? statusToColumn(
      cases.find((c) => c.id === droppedId)?.status ?? "open"
    );

    // Update column assignment
    setColumnOverrides((prev) => ({ ...prev, [droppedId]: colKey }));

    // Build new order for target column
    const targetIds = (columns[colKey] ?? []).map((c) => c.id).filter((id) => id !== droppedId);

    if (hoverCardId && hoverCardId !== droppedId) {
      const hoverIdx = targetIds.indexOf(hoverCardId);
      if (hoverIdx !== -1) {
        const insertIdx = hoverPosition === "above" ? hoverIdx : hoverIdx + 1;
        targetIds.splice(insertIdx, 0, droppedId);
      } else {
        targetIds.push(droppedId);
      }
    } else {
      // Dropped on column background — add to top
      targetIds.unshift(droppedId);
    }

    setColumnOrder((prev) => ({ ...prev, [colKey]: targetIds }));

    // Update source column order if cross-column move
    if (sourceCol !== colKey) {
      const sourceIds = (columns[sourceCol] ?? []).map((c) => c.id).filter((id) => id !== droppedId);
      setColumnOrder((prev) => ({ ...prev, [sourceCol]: sourceIds }));
    }

    // Snap animation if something actually moved
    if (sourceCol !== colKey || (hoverCardId && hoverCardId !== droppedId)) {
      setJustDroppedId(droppedId);
    }

    draggedCaseId.current = null;
    setDraggingId(null);
    setDragOverCol(null);
    setHoverCardId(null);
    setGhostPos(null);
  }

  function handleCategoryChange(caseId: string, category: string) {
    setCategoryOverrides((prev) => ({ ...prev, [caseId]: category }));
    setOpenCategoryDropdown(null);
  }

  const draggedCase = draggingId ? cases.find((c) => c.id === draggingId) : null;
  const draggedTenant = draggedCase?.tenantId ? tenantMap.get(draggedCase.tenantId) : null;
  const draggedProperty = draggedCase?.propertyId ? propertyMap.get(draggedCase.propertyId) : null;

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
              onDragOver={(e) => handleColDragOver(e as unknown as React.DragEvent, col.key)}
              onDragLeave={(e) => handleColDragLeave(e as unknown as React.DragEvent, col.key)}
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

              {/* Drop placeholder when column is empty and being dragged over */}
              <AnimatePresence>
                {isDragOver && draggingId && colCases.length === 0 && (
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
                  const isJustDropped = justDroppedId === c.id;
                  const isHoverTarget = hoverCardId === c.id && draggingId !== c.id;

                  return (
                    <motion.div
                      key={c.id}
                      layout
                      layoutId={c.id}
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={
                        isJustDropped
                          ? { opacity: 1, scale: [1, 1.04, 0.98, 1], y: 0, rotate: 0 }
                          : { opacity: isDragging ? 0.3 : 1, scale: isDragging ? 0.96 : 1, y: 0, rotate: isDragging ? 2 : 0 }
                      }
                      exit={{ opacity: 0, scale: 0.9, y: -12 }}
                      transition={
                        isJustDropped
                          ? { layout: { type: "spring", stiffness: 400, damping: 28 }, scale: { duration: 0.35, ease: "easeOut" }, opacity: { duration: 0.1 } }
                          : { layout: { type: "spring", stiffness: 350, damping: 30 }, opacity: { duration: 0.15 }, scale: { duration: 0.15 } }
                      }
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, c.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleCardDragOver(e as unknown as React.DragEvent, c.id)}
                      className={`cursor-grab active:cursor-grabbing ${isDragging ? "z-50 relative" : ""}`}
                    >
                      {/* Insertion indicator — above */}
                      {isHoverTarget && hoverPosition === "above" && (
                        <div className="h-1 bg-accent rounded-full mx-1 mb-2 animate-pulse" />
                      )}

                      <Link href={`/cases/${c.id}`} className="block" draggable={false}>
                        <div
                          className={`bg-surface-container-lowest p-5 rounded-xl border-l-[3px] ${
                            isResolved
                              ? "border-outline-variant opacity-70"
                              : URGENCY_BORDER[c.urgency ?? "low"]
                          } flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md ${
                            isDragging ? "shadow-xl" : ""
                          } ${isJustDropped ? "ring-2 ring-accent/20" : ""}`}
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

                      {/* Insertion indicator — below */}
                      {isHoverTarget && hoverPosition === "below" && (
                        <div className="h-1 bg-accent rounded-full mx-1 mt-2 animate-pulse" />
                      )}
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

      {/* Floating drag ghost */}
      {draggingId && draggedCase && ghostPos && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{ left: ghostPos.x + 12, top: ghostPos.y - 16 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="w-56 bg-surface-container-lowest rounded-lg shadow-2xl border border-accent/20 p-3 rotate-[3deg]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${URGENCY_DOT[draggedCase.urgency ?? "low"]}`} />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                  {formatEnum(categoryOverrides[draggedCase.id] ?? draggedCase.category ?? "general")}
                </span>
              </div>
              <p className="text-xs font-bold text-on-surface line-clamp-2 leading-snug">
                {draggedCase.rawMessage}
              </p>
              <p className="text-[10px] text-on-surface-variant mt-1.5 font-medium">
                {draggedTenant?.unitNumber ? `Unit ${draggedTenant.unitNumber}` : ""}
                {draggedTenant?.unitNumber && draggedProperty ? " \u2022 " : ""}
                {draggedProperty?.address ?? ""}
              </p>
            </motion.div>
          </div>,
          document.body,
        )
      }
    </LayoutGroup>
  );
}
