import { projects } from "@/data/projects";

export const flashcards = projects.flatMap((project) =>
  project.flashcards.map((flashcard, index) => ({
    id: `${project.slug}-f-${index + 1}`,
    projectSlug: project.slug,
    projectName: project.name,
    ...flashcard,
  })),
);
