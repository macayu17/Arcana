import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "arcana-paper-panel p-5 text-[var(--text-primary)]",
        className,
      )}
      {...props}
    />
  );
  },
);
