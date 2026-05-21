"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-max max-w-56 -translate-x-1/2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 opacity-0 shadow-[0_14px_30px_-18px_rgba(24,24,27,0.55)] transition group-hover:opacity-100 group-focus-within:opacity-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        {label}
      </span>
    </span>
  );
}
