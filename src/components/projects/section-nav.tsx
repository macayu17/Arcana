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
    <aside className="no-print arcana-paper-panel sticky top-28 hidden self-start rounded-[2rem] p-3 backdrop-blur-xl xl:block">
      <div className="px-3 py-3">
        <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
          Study map
        </p>
        <div className="mt-3 h-px overflow-hidden rounded-full bg-[var(--border-card)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
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
                  "bg-[rgba(196,107,40,0.12)] text-[var(--text-primary)]",
              )}
              key={section.id}
            >
              <button
                aria-label={`Mark ${section.label} reviewed`}
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-md border text-[0.65rem] transition active:scale-[0.9]",
                  checked
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[#130f0a]"
                    : "border-[var(--border-card)] text-transparent",
                )}
                type="button"
                onClick={() => toggleSection(section.id)}
              >
                <Check aria-hidden="true" size={12} strokeWidth={2.2} />
              </button>
              <a
                className="truncate rounded-xl px-2 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
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
