import type { ReactNode } from "react";
import { SectionNotes } from "@/components/projects/section-notes";
import { cn } from "@/lib/utils";

export function ProjectSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("scroll-mt-28 border-t border-zinc-200/70 py-16 dark:border-zinc-800", className)}
      id={id}
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-5xl">
          {title}
        </h2>
      </div>
      {children}
      <SectionNotes sectionId={id} title={title} />
    </section>
  );
}
