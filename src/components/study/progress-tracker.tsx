"use client";

import Link from "next/link";
import { projects } from "@/data/projects";
import { useStudyProgress } from "@/hooks/use-progress";
import { PROJECT_SECTION_IDS } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

export function ProgressTracker() {
  const { progress } = useStudyProgress();
  const sectionCount = PROJECT_SECTION_IDS.length;
  const totalReviewed = progress.reduce(
    (sum, item) => sum + item.sectionsReviewed.length,
    0,
  );
  const totalSections = projects.length * sectionCount;
  const overall = Math.round((totalReviewed / totalSections) * 100);

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Overall progress
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50">
              {overall}%
            </p>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {totalReviewed} of {totalSections} sections reviewed
          </p>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {projects.map((project) => {
          const item = progress.find((entry) => entry.projectSlug === project.slug);
          const reviewed = item?.sectionsReviewed.length ?? 0;
          const percent = Math.round((reviewed / sectionCount) * 100);
          const radius = 34;
          const circumference = 2 * Math.PI * radius;

          return (
            <Link
              className="grid gap-5 rounded-[2rem] border border-zinc-200/80 bg-white p-5 transition hover:border-amber-500/30 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-[auto_1fr_auto] md:items-center"
              href={`/projects/${project.slug}`}
              key={project.slug}
            >
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  className="stroke-zinc-100 dark:stroke-zinc-800"
                  cx="40"
                  cy="40"
                  fill="none"
                  r={radius}
                  strokeWidth="8"
                />
                <circle
                  className="stroke-amber-500"
                  cx="40"
                  cy="40"
                  fill="none"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (percent / 100) * circumference}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div>
                <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {project.name}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Last studied: {relativeTime(item?.lastStudied)}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-2xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
                  {percent}%
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {reviewed}/{sectionCount}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
