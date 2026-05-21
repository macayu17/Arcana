"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { OfflineRegistration } from "@/components/layout/offline-registration";
import { useKeyboardShortcut } from "@/hooks/use-keyboard";

const SearchModal = dynamic(
  () =>
    import("@/components/layout/search-modal").then((module) => module.SearchModal),
  {
    ssr: false,
  },
);

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const shortcutPredicate = useCallback(
    (event: KeyboardEvent) =>
      (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k",
    [],
  );

  const shortcutHandler = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    setSearchOpen(true);
  }, []);

  useKeyboardShortcut(shortcutPredicate, shortcutHandler);

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 100, damping: 20 }}>
      <Navbar onSearch={() => setSearchOpen(true)} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          className="flex-1"
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {searchOpen ? (
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      ) : null}
      <OfflineRegistration />
    </MotionConfig>
  );
}
