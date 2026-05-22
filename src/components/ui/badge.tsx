import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
        "border-[rgba(217,119,6,0.32)] bg-[rgba(217,119,6,0.075)] text-[#f0b46d]",
        className,
      )}
      {...props}
    />
  );
}
