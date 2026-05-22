"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs<T extends string>({
  value,
  onChange,
  items,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  items: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-grid grid-flow-col gap-1 rounded-full border border-[var(--border-card)] bg-[rgba(14,13,10,0.54)] p-1",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          className={cn(
            "relative rounded-full px-4 py-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)] transition active:scale-[0.98]",
            value === item.value && "text-[var(--text-primary)]",
          )}
          type="button"
          onClick={() => onChange(item.value)}
        >
          {value === item.value ? (
            <motion.span
              className="absolute inset-0 rounded-full bg-[rgba(196,107,40,0.16)]"
              layoutId="tab-active"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          ) : null}
          <span className="relative">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
