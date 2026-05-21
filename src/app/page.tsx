import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { StatsCounter } from "@/components/study/stats-counter";
import { ButtonLink } from "@/components/ui/button";
import { concepts } from "@/data/concepts";
import { projects } from "@/data/projects";
import { unique } from "@/lib/utils";

const techCount = unique(
  projects.flatMap((project) => project.techStack.map((tech) => tech.name)),
).length;

const bentoAreas: Record<string, string> = {
  sentinel: "lg:[grid-area:sentinel]",
  engram: "lg:[grid-area:engram]",
  parkinsons: "lg:[grid-area:parkinsons]",
  occasio: "lg:[grid-area:occasio]",
  equityflow: "lg:[grid-area:equityflow]",
  gridpulse: "lg:[grid-area:gridpulse]",
};

export default function Home() {
  return (
    <div>
      <section className="relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[8vw] top-28 h-72 w-72 rounded-full border border-amber-500/20" />
          <div className="absolute right-[12vw] top-40 h-96 w-96 rounded-full border border-zinc-300/40 dark:border-zinc-700/50" />
          <div className="absolute bottom-20 left-1/2 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-[1400px] items-center gap-12 px-4 py-20 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
              Ayush interview study system
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-7xl">
              Deep dive into my projects.
            </h1>
            <p className="mt-6 max-w-[65ch] text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Arcana turns six software projects into an interview-ready study
              workspace: architecture diagrams, concept explainers, code
              highlights, Q&A, flashcards, and progress tracking.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink
                href="#project-grid"
                icon={<Layers aria-hidden="true" size={17} />}
              >
                Explore projects
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

          <div className="grid gap-4 rounded-[2.5rem] border border-zinc-200/70 bg-white/70 p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/55">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[2rem] bg-zinc-950 p-6 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300 dark:text-amber-700">
                  Current scope
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tighter">
                  {projects.length} projects, {concepts.length} concepts
                </p>
              </div>
              <ArrowRight aria-hidden="true" className="text-amber-400" size={24} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatsCounter label="Projects" value={projects.length} />
              <StatsCounter label="Technologies" value={techCount} />
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1400px] px-4 py-24 md:px-6 md:py-36"
        id="project-grid"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
              Project atlas
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-6xl">
              Built for fast recall and credible depth.
            </h2>
          </div>
          <p className="max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
            Each card opens a full project study page with architecture,
            workflow, API and data modeling notes, implementation highlights,
            trade-offs, and self-testing material.
          </p>
        </div>

        <div
          className="arcana-bento-grid mt-12 grid auto-rows-[18rem] gap-5 lg:grid-cols-[1.1fr_0.85fr_0.95fr]"
        >
          {projects.map((project) => (
            <ProjectCard
              className={bentoAreas[project.slug]}
              featured={project.slug === "sentinel"}
              key={project.slug}
              project={project}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
