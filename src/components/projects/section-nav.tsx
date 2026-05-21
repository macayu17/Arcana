"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useStudyProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export function SectionNav({
  projectSlug,
  sections,
}: {
  projectSlug: string;
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const { projectProgress, toggleSection } = useStudyProgress(projectSlug);

  useEffect(() => {
    const observers = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -62% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    observers.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  const reviewed = projectProgress?.sectionsReviewed ?? [];
  const progress =
    sections.length > 0 ? Math.round((reviewed.length / sections.length) * 100) : 0;

  return (
    <aside className="no-print sticky top-24 hidden self-start rounded-[2rem] border border-zinc-200/80 bg-white/75 p-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/75 xl:block">
      <div className="px-3 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Study map
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {progress}% reviewed
        </p>
      </div>
      <div className="grid gap-1">
        {sections.map((section) => {
          const checked = reviewed.includes(section.id);

          return (
            <div
              className={cn(
                "grid grid-cols-[auto_1fr] items-center gap-2 rounded-2xl px-2 py-1.5",
                active === section.id &&
                  "bg-amber-500/12 text-zinc-950 dark:text-zinc-50",
              )}
              key={section.id}
            >
              <button
                aria-label={`Mark ${section.label} reviewed`}
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-md border text-[0.65rem] transition active:scale-[0.9]",
                  checked
                    ? "border-amber-500 bg-amber-500 text-zinc-950"
                    : "border-zinc-300 text-transparent dark:border-zinc-700",
                )}
                type="button"
                onClick={() => toggleSection(section.id)}
              >
                <Check aria-hidden="true" size={12} strokeWidth={2.2} />
              </button>
              <a
                className="truncate rounded-xl px-2 py-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                href={`#${section.id}`}
              >
                {section.label}
              </a>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
