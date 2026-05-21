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
    <div className="inline-grid grid-cols-3 rounded-full border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
      {options.map((option) => (
        <button
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold text-zinc-500 transition active:scale-[0.98] dark:text-zinc-400",
            value === option.value &&
              "bg-amber-500 text-zinc-950 shadow-[0_8px_20px_-12px_rgba(245,158,11,0.9)]",
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
