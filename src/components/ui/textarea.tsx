"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, rows = 3, className, id, ...rest }, ref) => {
    const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-ink mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "w-full px-3 py-2 rounded-lg border border-edge bg-canvas text-sm text-ink transition-colors duration-200 focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/20",
            error && "border-danger focus:ring-danger/20",
            className,
          )}
          {...rest}
        />
        {error && <p className="text-danger text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
