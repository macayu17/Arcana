"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 grid place-items-start bg-[#080704]/75 px-4 py-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className={cn(
              "arcana-paper-panel mx-auto w-full max-w-3xl rounded-[2rem] p-3",
              className,
            )}
            initial={{ y: -18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -12, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <Button
                aria-label="Close modal"
                className="h-9 min-h-9 w-9 px-0"
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                <X aria-hidden="true" size={16} />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
