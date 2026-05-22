import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { StatsCounter } from "@/components/study/stats-counter";
import { ButtonLink } from "@/components/ui/button";
import { concepts } from "@/data/concepts";
import { projects } from "@/data/projects";
import { formatCategory, unique } from "@/lib/utils";

const techCount = unique(
  projects.flatMap((project) => project.techStack.map((tech) => tech.name)),
).length;

const domains = Array.from(
  projects.reduce((counts, project) => {
    counts.set(project.domain, (counts.get(project.domain) ?? 0) + 1);
    return counts;
  }, new Map<string, number>()),
).slice(0, 8);

const technologies = Array.from(
  projects
    .flatMap((project) => project.techStack.map((tech) => tech.name))
    .reduce((counts, tech) => {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
      return counts;
    }, new Map<string, number>()),
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8);

const ledgerColumns = [
  {
    title: "By project",
    items: projects.map((project) => [project.name, project.concepts.length] as const),
  },
  {
    title: "By domain",
    items: domains,
  },
  {
    title: "By technology",
    items: technologies,
  },
] as const;

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[100dvh] px-4 pt-16 md:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="arcana-watermark font-editorial absolute left-1/2 top-20 -translate-x-1/2 text-[31rem] font-semibold leading-none tracking-tighter">
            A
          </div>
          <div className="absolute left-1/2 top-44 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-[rgba(247,240,228,0.055)]" />
          <div className="absolute left-[7vw] top-[42vh] h-64 w-64 rotate-45 border border-[rgba(196,107,40,0.12)]" />
          <div className="absolute right-[8vw] top-[30vh] h-80 w-80 rotate-12 border border-[rgba(247,240,228,0.055)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[1280px] flex-col items-center justify-center py-24 text-center">
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--text-muted)]">
            The interview project catalog · Vol. 01
          </div>
          <h1 className="font-editorial mt-7 max-w-5xl text-[3.5rem] font-medium leading-[0.88] tracking-[-0.055em] text-[var(--text-primary)] md:text-[6.8rem] lg:text-[8.4rem]">
            Every major
            <span className="block">
              project <span className="italic text-[var(--accent)]">decoded.</span>
            </span>
            Interview-ready.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Arcana turns six software projects into a browsable study archive
            with architecture diagrams, concept explainers, code highlights,
            interview Q&A, flashcards, notes, and progress tracking.
          </p>
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-[var(--border-card)] bg-[rgba(21,19,15,0.72)] px-5 py-2 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span>{projects.length} projects</span>
            <span className="text-[var(--text-muted)]">·</span>
            <span>{concepts.length} concepts</span>
            <span className="text-[var(--text-muted)]">·</span>
            <span>{techCount} technologies</span>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink
              href="#project-ledger"
              icon={<Layers aria-hidden="true" size={17} />}
            >
              Browse ledger
            </ButtonLink>
            <ButtonLink
              href="/study"
              variant="secondary"
              icon={<BookOpen aria-hidden="true" size={17} />}
            >
              Start studying
            </ButtonLink>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1280px] px-4 py-24 md:px-6 md:py-32"
        id="project-ledger"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
              § I - The Ledger
            </p>
            <h2 className="font-editorial mt-3 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
              Browse the study catalog
            </h2>
          </div>
          <ButtonLink href="/projects" variant="ghost" icon={<ArrowRight aria-hidden="true" size={15} />}>
            View all
          </ButtonLink>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {ledgerColumns.map((column) => (
            <div
              className="arcana-paper-panel overflow-hidden rounded-[2rem]"
              key={column.title}
            >
              <div className="flex items-center justify-between border-b border-[var(--border-card)] px-5 py-4 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                <span>{column.title}</span>
                <span className="text-[var(--accent)]">All</span>
              </div>
              <div className="divide-y divide-[var(--border-card)]">
                {column.items.map(([label, count]) => (
                  <div
                    className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition hover:bg-[rgba(247,240,228,0.035)]"
                    key={label}
                  >
                    <span>{formatCategory(label)}</span>
                    <span className="text-[var(--text-muted)]">[{count}]</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-[1280px] px-4 py-24 md:px-6 md:py-32"
        id="project-grid"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
              § II - Project dossiers
            </p>
            <h2 className="font-editorial mt-3 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
              Most useful systems to explain
            </h2>
          </div>
          <ButtonLink href="/study" variant="ghost" icon={<ArrowRight aria-hidden="true" size={15} />}>
            Study
          </ButtonLink>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              featured={project.slug === "sentinel"}
              key={project.slug}
              project={project}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <StatsCounter label="Projects" value={projects.length} />
          <StatsCounter label="Technologies" value={techCount} />
        </div>
      </section>
    </div>
  );
}
