"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, size = 48, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-forest" : "bg-cream border-hairline",
          className
        )}
        style={{ width: size, height: size / 2 }}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-cream shadow-md transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
          style={{
            width: size / 2 - 2,
            height: size / 2 - 2,
            transform: checked ? `translateX(${size / 2}px)` : "translateX(0)",
          }}
        />
      </button>
    );
  }
);

Toggle.displayName = "Toggle";