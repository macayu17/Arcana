import Link from "next/link";
import { projects } from "@/data/projects";
import { concepts } from "@/data/concepts";

export function Footer() {
  return (
    <footer className="no-print border-t border-zinc-200/70 bg-[var(--bg-primary)] py-12 dark:border-zinc-800/70">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 md:grid-cols-[1fr_auto] md:px-6">
        <div>
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Arcana
          </p>
          <p className="mt-2 max-w-[58ch] text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Ayush&apos;s interview study system for {projects.length} project
            deep dives, {concepts.length} concept explainers, architecture
            notes, Q&A, flashcards, and progress tracking.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400 sm:grid-cols-4">
          <Link className="hover:text-zinc-950 dark:hover:text-zinc-50" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-zinc-950 dark:hover:text-zinc-50" href="/concepts">
            Concepts
          </Link>
          <Link className="hover:text-zinc-950 dark:hover:text-zinc-50" href="/compare">
            Compare
          </Link>
          <Link className="hover:text-zinc-950 dark:hover:text-zinc-50" href="/study">
            Study
          </Link>
        </div>
      </div>
    </footer>
  );
}
