"use client";

import { cn } from "@/lib/utils";

const options = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export function ConfidenceRating({
  value,
  onChange,
}: {
  value?: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
}) {
  return (
    <div className="inline-grid grid-cols-3 rounded-full border border-[var(--border-card)] bg-[rgba(14,13,10,0.55)] p-1">
      {options.map((option) => (
        <button
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold text-[var(--text-muted)] transition active:scale-[0.98]",
            value === option.value &&
              "bg-[var(--accent)] text-[#130f0a] shadow-[0_8px_20px_-12px_rgba(196,107,40,0.9)]",
          )}
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
