import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[2.5rem] border border-slate-200/60 bg-white p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
        "dark:border-zinc-700/50 dark:bg-zinc-900 dark:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)]",
        className,
      )}
      {...props}
    />
  );
  },
);
