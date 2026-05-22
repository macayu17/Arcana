"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  BrainCircuit,
  Command,
  GitBranch,
  Layers,
  Menu,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Browse", icon: Layers },
  { href: "/concepts", label: "Concepts", icon: BrainCircuit },
  { href: "/compare", label: "Matrix", icon: GitBranch },
  { href: "/study", label: "Study", icon: BookOpen },
] satisfies {
  href: string;
  label: string;
  icon: LucideIcon;
}[];

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[rgba(229,226,225,0.08)] bg-[rgba(13,12,10,0.78)] px-4 py-3 backdrop-blur-2xl">
      <nav className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-3 md:grid-cols-[auto_minmax(20rem,38rem)_auto] md:gap-6">
        <Link
          className="group grid h-11 shrink-0 grid-cols-[2.25rem_auto] items-center gap-2.5 transition active:scale-[0.98]"
          href="/"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-sm border border-[rgba(217,119,6,0.42)] bg-[rgba(217,119,6,0.11)] text-[0.76rem] font-semibold tracking-tight text-[#f0b46d] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition group-hover:bg-[rgba(217,119,6,0.16)]">
            AR
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-[1rem] font-semibold tracking-tight text-[var(--text-primary)]">
              Arcana
            </span>
            <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              interview archive
            </span>
          </span>
        </Link>

        <button
          className="group relative hidden h-11 min-w-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-y border-[rgba(229,226,225,0.12)] bg-[linear-gradient(90deg,transparent,rgba(235,231,223,0.035)_12%,rgba(235,231,223,0.035)_88%,transparent)] px-3 text-left transition hover:border-[rgba(217,119,6,0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(217,119,6,0.55)] active:scale-[0.99] md:grid"
          type="button"
          onClick={onSearch}
        >
          <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-[rgba(217,119,6,0.45)]" />
          <span className="grid h-7 w-7 place-items-center text-[var(--text-muted)] transition group-hover:text-[#f0b46d]">
            <Search aria-hidden="true" size={17} strokeWidth={1.7} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.95rem] font-medium text-[var(--text-secondary)]">
              Search projects, concepts, questions
            </span>
            <span className="mt-0.5 block truncate text-[0.64rem] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              press command for the full study index
            </span>
          </span>
          <span className="inline-flex items-center gap-1 border border-[rgba(229,226,225,0.13)] bg-[rgba(13,12,10,0.52)] px-2 py-1 text-[0.62rem] uppercase tracking-[0.06em] text-[var(--text-muted)] transition group-hover:border-[rgba(217,119,6,0.34)] group-hover:text-[#f0b46d]">
            <Command aria-hidden="true" size={11} strokeWidth={2} /> K
          </span>
        </button>

        <div className="hidden items-center justify-end md:flex">
          <div className="relative flex items-center gap-1">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative isolate flex h-10 items-center gap-1.5 px-3 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] transition hover:text-[var(--text-primary)] active:scale-[0.98]",
                    active && "text-[#f0b46d]",
                  )}
                  href={link.href}
                  key={link.href}
                >
                  {active ? (
                    <motion.span
                      className="absolute inset-x-2 bottom-0 -z-10 h-px bg-[var(--accent)] shadow-[0_0_18px_rgba(217,119,6,0.55)]"
                      layoutId="arcana-nav-active-line"
                    />
                  ) : null}
                  <Icon aria-hidden="true" size={15} strokeWidth={1.7} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            aria-label="Search"
            className="grid h-10 w-10 place-items-center border border-[rgba(229,226,225,0.12)] bg-[rgba(13,12,10,0.42)] text-[var(--text-secondary)] transition hover:border-[rgba(217,119,6,0.36)] hover:text-[#f0b46d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(217,119,6,0.55)] active:scale-[0.98] md:hidden"
            type="button"
            onClick={onSearch}
          >
            <Search aria-hidden="true" size={17} strokeWidth={1.8} />
          </button>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid h-10 w-10 place-items-center border border-[rgba(229,226,225,0.12)] bg-[rgba(13,12,10,0.42)] text-[var(--text-secondary)] transition hover:border-[rgba(217,119,6,0.36)] hover:text-[#f0b46d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(217,119,6,0.55)] active:scale-[0.98] md:hidden"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X aria-hidden="true" size={17} />
            ) : (
              <Menu aria-hidden="true" size={17} />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="mx-auto mt-3 grid max-w-[1280px] gap-1 border-y border-[rgba(229,226,225,0.12)] bg-[rgba(13,12,10,0.88)] py-2 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] transition hover:text-[var(--text-primary)]",
                    active && "border-l border-[var(--accent)] pl-3 text-[#f0b46d]",
                  )}
                  href={link.href}
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon aria-hidden="true" size={15} strokeWidth={1.7} />
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
