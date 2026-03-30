"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const errorId = error ? `${generatedId}-error` : undefined;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "w-full px-3 py-2 min-h-[44px] rounded-lg border border-edge bg-canvas text-sm text-ink transition-colors duration-200 focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/20",
            error && "border-danger focus:ring-danger/20",
            className,
          )}
          {...rest}
        />
        {error && <p id={errorId} role="alert" className="text-danger text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
