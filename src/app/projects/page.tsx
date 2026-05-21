import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects",
  description: "All Arcana project deep dives for interview preparation.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
            Projects
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-7xl">
            Interview-ready project library.
          </h1>
        </div>
        <p className="max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
          Browse the six systems Arcana tracks: financial simulation, AI memory,
          healthcare ML, event booking, paper trading, and F1 telemetry analytics.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        {projects.map((project, index) => (
          <ProjectCard
            featured={index === 0}
            key={project.slug}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}
