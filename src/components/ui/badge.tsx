import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.65rem] font-medium uppercase tracking-[0.2em]",
        "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] text-[#e7a56d]",
        className,
      )}
      {...props}
    />
  );
}
