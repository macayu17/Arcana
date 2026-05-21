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
        "inline-grid grid-flow-col gap-1 rounded-full border border-zinc-200/80 bg-white/80 p-1 dark:border-zinc-800 dark:bg-zinc-950/80",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 transition active:scale-[0.98] dark:text-zinc-400",
            value === item.value && "text-zinc-950 dark:text-zinc-50",
          )}
          type="button"
          onClick={() => onChange(item.value)}
        >
          {value === item.value ? (
            <motion.span
              className="absolute inset-0 rounded-full bg-amber-500/15"
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
