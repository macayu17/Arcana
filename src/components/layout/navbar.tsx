"use client";

import { BookOpen, Command, Layers, Library, PanelTop, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Projects", icon: Layers },
  { href: "/concepts", label: "Concepts", icon: Library },
  { href: "/compare", label: "Compare", icon: PanelTop },
  { href: "/study", label: "Study", icon: BookOpen },
];

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-30 border-b border-zinc-200/60 bg-[var(--bg-primary)]/78 backdrop-blur-xl dark:border-zinc-800/70">
      <nav className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 md:px-6">
        <Link
          className="group inline-grid grid-cols-[2.5rem_auto] items-center gap-3"
          href="/"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/12 text-sm font-bold text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:text-amber-300">
            AR
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:block">
            Arcana
          </span>
        </Link>

        <div className="hidden items-center justify-start gap-1 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-950/5 hover:text-zinc-950 active:scale-[0.98] dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-50",
                  active &&
                    "bg-amber-500/12 text-zinc-950 dark:text-zinc-50",
                )}
                href={link.href}
                key={link.href}
              >
                <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            className="!hidden min-h-11 grid-cols-[auto_1fr_auto] gap-3 px-4 text-zinc-500 sm:!inline-grid"
            type="button"
            variant="secondary"
            onClick={onSearch}
          >
            <Search aria-hidden="true" size={16} />
            <span className="text-sm font-semibold">Search</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-950/5 px-2 py-1 text-[0.65rem] font-bold text-zinc-500 dark:bg-white/10">
              <Command aria-hidden="true" size={11} /> K
            </span>
          </Button>
          <Button
            aria-label="Search"
            className="!inline-flex h-11 min-h-11 w-11 px-0 sm:!hidden"
            type="button"
            variant="secondary"
            onClick={onSearch}
          >
            <Search aria-hidden="true" size={17} />
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
