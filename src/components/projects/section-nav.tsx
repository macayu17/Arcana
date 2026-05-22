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
    let frameId: number | null = null;

    const updateActiveSection = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        const readingLine = 168;
        let nextActive = sections[0]?.id ?? "";

        for (const section of sections) {
          const element = document.getElementById(section.id);

          if (!element) {
            continue;
          }

          if (element.getBoundingClientRect().top <= readingLine) {
            nextActive = section.id;
          } else {
            break;
          }
        }

        setActive(nextActive);
        frameId = null;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  const reviewed = projectProgress?.sectionsReviewed ?? [];
  const progress =
    sections.length > 0 ? Math.round((reviewed.length / sections.length) * 100) : 0;
  const activeLabel =
    sections.find((section) => section.id === active)?.label ?? sections[0]?.label;

  return (
    <aside className="no-print fixed left-[max(1rem,calc((100vw-1280px)/2+1.5rem))] top-[5rem] z-20 hidden max-h-[calc(100dvh-5.25rem)] w-52 self-start overflow-hidden border-y border-[rgba(229,226,225,0.12)] bg-[rgba(13,12,10,0.58)] p-2 backdrop-blur-xl lg:block">
      <div className="border-b border-[rgba(229,226,225,0.1)] px-2.5 pb-3 pt-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Project map
        </p>
        <p className="mt-2 truncate text-sm font-semibold tracking-tight text-[var(--text-primary)]">
          {activeLabel}
        </p>
        <div className="mt-3 h-px overflow-hidden bg-[rgba(229,226,225,0.12)]">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {progress}% reviewed
        </p>
      </div>
      <div className="grid max-h-[calc(100dvh-12rem)] gap-0.5 overflow-y-auto py-2 pr-1">
        {sections.map((section) => {
          const checked = reviewed.includes(section.id);
          const isActive = active === section.id;

          return (
            <div
              className={cn(
                "group relative grid grid-cols-[auto_1fr] items-center gap-2 px-2 py-1 transition",
                isActive &&
                  "bg-[rgba(217,119,6,0.08)] text-[var(--text-primary)]",
              )}
              key={section.id}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1/2 h-6 w-px -translate-y-1/2 rounded-full bg-transparent transition",
                  isActive && "bg-[var(--accent)]",
                )}
              />
              <button
                aria-label={`Mark ${section.label} reviewed`}
                aria-pressed={checked}
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-sm border text-[0.65rem] transition active:scale-[0.9]",
                  checked
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[#130f0a]"
                    : "border-[var(--border-card)] text-transparent",
                )}
                type="button"
                onClick={() => toggleSection(section.id)}
              >
                <Check aria-hidden="true" size={10} strokeWidth={2.2} />
              </button>
              <a
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "truncate px-2 py-1.5 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-primary)]",
                  isActive && "text-[var(--text-primary)]",
                )}
                href={`#${section.id}`}
                onClick={() => setActive(section.id)}
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
