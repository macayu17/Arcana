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
      <div className="arcana-paper-panel rounded-xl p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Overall progress
            </p>
            <p className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              {overall}%
            </p>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {totalReviewed} of {totalSections} sections reviewed
          </p>
        </div>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-[var(--border-card)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
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
              className="arcana-paper-panel grid gap-5 rounded-xl p-5 transition hover:border-[rgba(217,119,6,0.4)] active:scale-[0.99] md:grid-cols-[auto_1fr_auto] md:items-center"
              href={`/projects/${project.slug}`}
              key={project.slug}
            >
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  className="stroke-[rgba(235,231,223,0.08)]"
                  cx="40"
                  cy="40"
                  fill="none"
                  r={radius}
                  strokeWidth="8"
                />
                <circle
                  className="stroke-[var(--accent)]"
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
                <p className="font-editorial text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {project.name}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Last studied: {relativeTime(item?.lastStudied)}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
                  {percent}%
                </p>
                <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
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
