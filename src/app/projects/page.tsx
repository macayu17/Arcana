import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects",
  description: "All Arcana project deep dives for interview preparation.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            § II - Project dossiers
          </p>
          <h1 className="font-editorial mt-4 text-5xl font-medium leading-[0.96] tracking-tight text-[var(--text-primary)] md:text-7xl">
            Interview-ready project library.
          </h1>
        </div>
        <p className="max-w-[68ch] text-base leading-8 text-[var(--text-secondary)]">
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
