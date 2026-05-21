"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  title,
  meta,
  children,
  defaultOpen = false,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <button
        className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 text-left active:scale-[0.99]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          <span className="block text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {title}
          </span>
          {meta ? (
            <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
              {meta}
            </span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "text-zinc-400 transition-transform",
            open && "rotate-180",
          )}
          size={18}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="border-t border-zinc-200/70 px-5 py-5 text-sm leading-7 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
