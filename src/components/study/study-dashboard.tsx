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
    <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            § V - Study dashboard
          </p>
          <h1 className="font-editorial mt-4 text-5xl font-medium leading-[0.96] tracking-tight text-[var(--text-primary)] md:text-7xl">
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

      <section className="arcana-paper-panel mt-16 rounded-[2rem] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Confidence heat map
            </p>
            <h2 className="font-editorial mt-3 text-4xl font-medium tracking-tight text-[var(--text-primary)]">
              Concepts by recall confidence
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-rose-300">
              Low
            </span>
            <span className="rounded-full border border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] px-3 py-1 text-[#e7a56d]">
              Medium
            </span>
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-300">
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
                    "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)]",
                  confidence === "low" && "border-rose-500/30 bg-rose-500/10",
                  !confidence &&
                    "border-[var(--border-card)] bg-[rgba(14,13,10,0.42)] hover:border-[rgba(196,107,40,0.45)]",
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

      <section className="mt-16 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        {projects.map((project) => (
          <Link
            className="arcana-paper-panel rounded-[2rem] p-6 transition hover:border-[rgba(196,107,40,0.45)] active:scale-[0.99]"
            href={`/projects/${project.slug}/flashcards`}
            key={project.slug}
          >
            <p className="font-editorial text-2xl font-medium tracking-tight text-[var(--text-primary)]">
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
