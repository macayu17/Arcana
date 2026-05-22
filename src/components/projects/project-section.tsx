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
      className={cn("scroll-mt-24 border-t border-[var(--border-card)] py-12", className)}
      id={id}
    >
      <div className="mb-6">
        <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
          {title}
        </h2>
      </div>
      {children}
      <SectionNotes sectionId={id} title={title} />
    </section>
  );
}
