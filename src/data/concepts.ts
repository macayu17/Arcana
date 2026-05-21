import { projects } from "@/data/projects";
import type { ConceptGlossaryEntry } from "@/lib/types";

const relatedByCategory = new Map<string, string[]>();

for (const project of projects) {
  for (const concept of project.concepts) {
    const current = relatedByCategory.get(concept.category) ?? [];
    relatedByCategory.set(concept.category, [...current, concept.name]);
  }
}

const conceptMap = new Map<string, ConceptGlossaryEntry>();

for (const project of projects) {
  for (const concept of project.concepts) {
    const existing = conceptMap.get(concept.name);
    if (existing) {
      existing.usedInProjects.push(project.slug);
      continue;
    }

    const relatedConcepts = (relatedByCategory.get(concept.category) ?? [])
      .filter((name) => name !== concept.name)
      .slice(0, 5);

    conceptMap.set(concept.name, {
      name: concept.name,
      category: concept.category,
      definition: concept.definition,
      explanation: concept.explanation,
      usedInProjects: [project.slug],
      relatedConcepts,
    });
  }
}

export const concepts = Array.from(conceptMap.values()).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const conceptCategories = [
  "all",
  "ml",
  "finance",
  "web",
  "systems",
  "data",
  "devops",
  "healthcare",
] as const;
