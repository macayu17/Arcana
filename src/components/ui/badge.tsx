import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
        "border-zinc-200/80 bg-white/80 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}
