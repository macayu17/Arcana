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
    <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Study dashboard
          </p>
          <h1 className="font-editorial mt-3 text-4xl font-semibold leading-[1] tracking-tight text-[var(--text-primary)] md:text-5xl">
            Track what is ready for interviews.
          </h1>
        </div>
        <p className="max-w-[68ch] text-base leading-8 text-[var(--text-secondary)]">
          Progress is stored locally in this browser. Review sections from each
          project page, grade flashcards, then return here to see the coverage map.
        </p>
      </div>

      <div className="mt-12">
        <ProgressTracker />
      </div>

      <section className="arcana-paper-panel mt-12 rounded-xl p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Confidence heat map
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Concepts by recall confidence
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-1 text-rose-300">
              Low
            </span>
            <span className="rounded-md border border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.1)] px-2 py-1 text-[#e6a15b]">
              Medium
            </span>
            <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-emerald-300">
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
                  "rounded-lg border p-4 transition active:scale-[0.99]",
                  confidence === "high" &&
                    "border-emerald-500/30 bg-emerald-500/10",
                  confidence === "medium" &&
                    "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.1)]",
                  confidence === "low" && "border-rose-500/30 bg-rose-500/10",
                  !confidence &&
                    "border-[var(--border-card)] bg-[rgba(13,12,10,0.42)] hover:border-[rgba(217,119,6,0.4)]",
                )}
                href={`/projects/${projectSlug}#concepts`}
                key={concept.name}
              >
                <p className="text-sm font-semibold text-[var(--text-primary)]">
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

      <section className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        {projects.map((project) => (
          <Link
            className="arcana-paper-panel rounded-xl p-5 transition hover:border-[rgba(217,119,6,0.4)] active:scale-[0.99]"
            href={`/projects/${project.slug}/flashcards`}
            key={project.slug}
          >
            <p className="font-editorial text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              {project.name} flashcards
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {project.flashcards.length} cards covering architecture, concepts,
              and trade-offs.
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
