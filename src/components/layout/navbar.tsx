"use client";

import { Command, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Browse" },
  { href: "/concepts", label: "Concepts" },
  { href: "/compare", label: "Matrix" },
  { href: "/study", label: "Study" },
];

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-30 px-3 pt-3 md:px-4 md:pt-4">
      <nav className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-3 rounded-full border border-[var(--border-card)] bg-[rgba(21,19,15,0.78)] px-4 py-2 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.95)] backdrop-blur-xl md:grid-cols-[auto_minmax(16rem,36rem)_auto] md:px-5">
        <Link
          className="group inline-grid shrink-0 grid-cols-[2.25rem_auto] items-center gap-3"
          href="/"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(196,107,40,0.42)] bg-[rgba(196,107,40,0.15)] font-mono text-[0.72rem] font-semibold text-[#e7a56d] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            AR
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:block">
            Arca<span className="font-editorial italic text-[var(--accent)]">na</span>
          </span>
        </Link>

        <Button
          className="!hidden min-h-10 w-full grid-cols-[auto_1fr_auto] gap-3 border-[var(--border-card)] bg-[rgba(14,13,10,0.54)] px-4 text-[var(--text-muted)] hover:border-[rgba(196,107,40,0.38)] md:!inline-grid"
          type="button"
          variant="secondary"
          onClick={onSearch}
        >
          <Search aria-hidden="true" size={16} strokeWidth={1.8} />
          <span className="truncate text-left text-sm font-medium">
            Search projects, concepts, questions...
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-card)] px-2 py-1 font-mono text-[0.62rem] text-[var(--text-muted)]">
            <Command aria-hidden="true" size={11} /> K
          </span>
        </Button>

        <div className="hidden items-center justify-end gap-1 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                className={cn(
                  "rounded-lg px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:text-[var(--text-primary)] active:scale-[0.98]",
                  active &&
                    "bg-[rgba(196,107,40,0.12)] text-[#e7a56d]",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            aria-label="Search"
            className="!inline-flex h-10 min-h-10 w-10 px-0 md:!hidden"
            type="button"
            variant="secondary"
            onClick={onSearch}
          >
            <Search aria-hidden="true" size={17} />
          </Button>
        </div>
      </nav>
    </header>
  );
}
