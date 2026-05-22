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
      <section className="relative px-4 pt-10 md:px-6">
        <div className="relative mx-auto grid min-h-[58dvh] max-w-[1280px] items-center py-10 md:py-12">
          <div className="max-w-3xl">
            <div className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
              The interview project catalog · Vol. 01
            </div>
            <h1 className="font-hero mt-5 max-w-3xl text-4xl font-medium leading-[0.98] tracking-[-0.035em] text-[var(--text-primary)] md:text-5xl lg:text-6xl">
              Every major
              <span className="block">
                project <span className="italic text-[var(--accent)]">decoded.</span>
              </span>
              Interview-ready.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              Arcana turns six software projects into a browsable study archive
              with architecture diagrams, concept explainers, code highlights,
              interview Q&A, flashcards, notes, and progress tracking.
            </p>
            <div className="mt-6 inline-grid grid-cols-1 divide-y divide-[rgba(229,226,225,0.12)] border-y border-[rgba(229,226,225,0.14)] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--text-secondary)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <span className="px-4 py-2">
                {projects.length} projects
              </span>
              <span className="px-4 py-2">
                {concepts.length} concepts
              </span>
              <span className="px-4 py-2">
                {techCount} technologies
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="#project-ledger"
                icon={<Layers aria-hidden="true" size={16} />}
              >
                Browse ledger
              </ButtonLink>
              <ButtonLink
                href="/study"
                variant="secondary"
                icon={<BookOpen aria-hidden="true" size={16} />}
              >
                Start studying
              </ButtonLink>
            </div>
          </div>
          <div className="mt-10 grid max-w-3xl divide-y divide-[rgba(229,226,225,0.1)] border-y border-[rgba(229,226,225,0.12)] md:grid-cols-3 md:divide-x md:divide-y-0">
            <span className="px-4 py-3 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Fast recall
            </span>
            <span className="px-4 py-3 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Architecture first
            </span>
            <span className="px-4 py-3 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Interview Q&A
            </span>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-20"
        id="project-ledger"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
              The ledger
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
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
              className="arcana-paper-panel overflow-hidden rounded-xl"
              key={column.title}
            >
              <div className="flex items-center justify-between border-b border-[var(--border-card)] px-5 py-4 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                <span>{column.title}</span>
                <span className="text-[var(--accent)]">All</span>
              </div>
              <div className="divide-y divide-[var(--border-card)]">
                {column.items.map(([label, count]) => (
                  <div
                    className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition hover:bg-[rgba(235,231,223,0.035)]"
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
        className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-20"
        id="project-grid"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Project dossiers
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
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
