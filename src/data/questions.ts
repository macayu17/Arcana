import { projects } from "@/data/projects";

export const questions = projects.flatMap((project) =>
  project.interviewQuestions.map((question, index) => ({
    id: `${project.slug}-q-${index + 1}`,
    projectSlug: project.slug,
    projectName: project.name,
    ...question,
  })),
);
