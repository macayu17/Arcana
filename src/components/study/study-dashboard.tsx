"use client";

import Link from "next/link";
import { concepts } from "@/data/concepts";
import { projects } from "@/data/projects";
import { ProgressTracker } from "@/components/study/progress-tracker";
import { Badge } from "@/components/ui/badge";
import { useStudyProgress } from "@/hooks/use-progress";
import { cn, formatCategory } from "@/lib/utils";

export function StudyDashboard() {
  const { progress } = useStudyProgress();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
            Study dashboard
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-7xl">
            Track what is ready for interviews.
          </h1>
        </div>
        <p className="max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
          Progress is stored locally in this browser. Review sections from each
          project page, grade flashcards, then return here to see the coverage map.
        </p>
      </div>

      <div className="mt-12">
        <ProgressTracker />
      </div>

      <section className="mt-16 rounded-[2.5rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Confidence heat map
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50">
              Concepts by recall confidence
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-500">
            <span className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-700 dark:text-rose-300">
              Low
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-700 dark:text-amber-300">
              Medium
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
              High
            </span>
          </div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr]">
          {concepts.map((concept) => {
            const projectSlug = concept.usedInProjects[0];
            const projectProgress = progress.find(
              (item) => item.projectSlug === projectSlug,
            );
            const confidence = projectProgress?.confidence[concept.name];

            return (
              <Link
                className={cn(
                  "rounded-2xl border p-4 transition active:scale-[0.99]",
                  confidence === "high" &&
                    "border-emerald-500/30 bg-emerald-500/10",
                  confidence === "medium" &&
                    "border-amber-500/30 bg-amber-500/10",
                  confidence === "low" && "border-rose-500/30 bg-rose-500/10",
                  !confidence &&
                    "border-zinc-200 bg-zinc-50 hover:border-amber-500/30 dark:border-zinc-800 dark:bg-zinc-950",
                )}
                href={`/projects/${projectSlug}#concepts`}
                key={concept.name}
              >
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {concept.name}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="normal-case tracking-normal">
                    {formatCategory(concept.category)}
                  </Badge>
                  <Badge className="normal-case tracking-normal">
                    {confidence ?? "Unrated"}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        {projects.map((project) => (
          <Link
            className="rounded-[2rem] border border-zinc-200 bg-white p-6 transition hover:border-amber-500/30 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-950"
            href={`/projects/${project.slug}/flashcards`}
            key={project.slug}
          >
            <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {project.name} flashcards
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {project.flashcards.length} cards covering architecture, concepts,
              and trade-offs.
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
