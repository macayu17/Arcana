import Link from "next/link";
import { projects } from "@/data/projects";
import { concepts } from "@/data/concepts";

export function Footer() {
  return (
    <footer className="no-print border-t border-[var(--border-card)] py-12">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 md:grid-cols-[1fr_auto] md:px-6">
        <div>
          <p className="font-editorial text-2xl font-medium text-[var(--text-primary)]">
            Arca<span className="italic text-[var(--accent)]">na</span>
          </p>
          <p className="mt-2 max-w-[58ch] text-sm leading-6 text-[var(--text-muted)]">
            Ayush&apos;s interview study system for {projects.length} project
            deep dives, {concepts.length} concept explainers, architecture
            notes, Q&A, flashcards, and progress tracking.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-muted)] sm:grid-cols-4">
          <Link className="hover:text-[var(--text-primary)]" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-[var(--text-primary)]" href="/concepts">
            Concepts
          </Link>
          <Link className="hover:text-[var(--text-primary)]" href="/compare">
            Compare
          </Link>
          <Link className="hover:text-[var(--text-primary)]" href="/study">
            Study
          </Link>
        </div>
      </div>
    </footer>
  );
}
