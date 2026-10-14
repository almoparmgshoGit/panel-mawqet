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
  ({ checked, onChange, size = 50, disabled, className, ...props }, ref) => {
    const height = size / 2;
    const padding = 3;
    const thumbSize = height - padding * 2;
    const travelDistance = size - thumbSize - padding * 2;

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-forest" : "bg-slate-300 dark:bg-slate-700",
          className
        )}
        style={{
          width: size,
          height: height,
        }}
        {...props}
      >
        <span
          className="absolute rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out"
          style={{
            width: thumbSize,
            height: thumbSize,
            top: padding,
            left: padding,
            transform: checked ? `translateX(${travelDistance}px)` : `translateX(0px)`,
          }}
        />
      </button>
    );
  }
);

Toggle.displayName = "Toggle";
