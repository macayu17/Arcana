import Fuse from "fuse.js";
import { concepts } from "@/data/concepts";
import { flashcards } from "@/data/flashcards";
import { projects } from "@/data/projects";
import { questions } from "@/data/questions";
import type { SearchItem } from "@/lib/types";
import { slugify } from "@/lib/utils";

export const searchItems: SearchItem[] = [
  ...projects.map((project) => ({
    type: "project" as const,
    title: project.name,
    content: [
      project.tagline,
      project.description,
      project.domain,
      project.architecture.overview,
      project.techStack.map((tech) => tech.name).join(" "),
    ].join(" "),
    slug: `/projects/${project.slug}`,
    project: project.name,
    category: project.domain,
  })),
  ...concepts.map((concept) => ({
    type: "concept" as const,
    title: concept.name,
    content: `${concept.definition} ${concept.explanation}`,
    slug: `/concepts#${slugify(concept.name)}`,
    project: concept.usedInProjects.join(", "),
    category: concept.category,
  })),
  ...questions.map((question) => ({
    type: "question" as const,
    title: question.question,
    content: question.answer,
    slug: `/projects/${question.projectSlug}#interview-qa`,
    project: question.projectName,
    category: question.category,
  })),
  ...flashcards.map((flashcard) => ({
    type: "flashcard" as const,
    title: flashcard.front,
    content: flashcard.back,
    slug: `/projects/${flashcard.projectSlug}/flashcards`,
    project: flashcard.projectName,
    category: flashcard.difficulty,
  })),
];

const fuse = new Fuse(searchItems, {
  keys: ["title", "content", "project", "category"],
  threshold: 0.32,
  includeMatches: true,
  minMatchCharLength: 2,
});

export function searchArcana(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  return fuse.search(trimmed).slice(0, 12);
}

export function groupedSearchResults(query: string) {
  return searchArcana(query).reduce(
    (groups, result) => {
      groups[result.item.type].push(result.item);
      return groups;
    },
    {
      project: [] as SearchItem[],
      concept: [] as SearchItem[],
      question: [] as SearchItem[],
      flashcard: [] as SearchItem[],
    },
  );
}
