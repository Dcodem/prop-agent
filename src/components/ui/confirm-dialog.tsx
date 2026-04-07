"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Modal } from "./modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "destructive";
  loading?: boolean;
  className?: string;
  /** When set, user must type this phrase to enable the confirm button */
  typeToConfirm?: string;
  icon?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  confirmVariant = "destructive",
  loading = false,
  className,
  typeToConfirm,
  icon,
}: ConfirmDialogProps) {
  const [typedValue, setTypedValue] = useState("");

  useEffect(() => {
    if (!open) setTypedValue("");
  }, [open]);

  const confirmed = !typeToConfirm || typedValue === typeToConfirm;

  return (
    <Modal open={open} onClose={onClose} title={title} className={className}>
      <div className="space-y-4">
        {icon && (
          <div className="flex justify-center">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              confirmVariant === "destructive" ? "bg-error/10" : "bg-accent/10"
            )}>
              <span className={cn(
                "material-symbols-outlined text-2xl",
                confirmVariant === "destructive" ? "text-error" : "text-accent"
              )}>{icon}</span>
            </div>
          </div>
        )}
        <p className="text-sm text-on-surface-variant">{description}</p>
        {typeToConfirm && (
          <div className="space-y-2">
            <p className="text-xs text-on-surface-variant">
              Type <strong className="text-on-surface font-mono bg-surface-container-high px-1.5 py-0.5 rounded">{typeToConfirm}</strong> to confirm
            </p>
            <input
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={typeToConfirm}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-lg bg-surface-container-lowest focus:outline-none focus:ring-2 transition-all",
                confirmed
                  ? "border-success/40 focus:ring-success/30"
                  : "border-outline-variant/30 focus:ring-accent/30"
              )}
              autoFocus
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
          disabled={!confirmed}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
