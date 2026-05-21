"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { concepts, conceptCategories } from "@/data/concepts";
import { projects } from "@/data/projects";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { formatCategory, slugify } from "@/lib/utils";

const projectNames = new Map(projects.map((project) => [project.slug, project.name]));

export function ConceptsExplorer() {
  const [category, setCategory] = useState<(typeof conceptCategories)[number]>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return concepts.filter((concept) => {
      const categoryMatch = category === "all" || concept.category === category;
      const textMatch =
        !normalized ||
        [concept.name, concept.definition, concept.explanation]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return categoryMatch && textMatch;
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
            Concept glossary
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-7xl">
            Technical recall, cross-linked.
          </h1>
        </div>
        <p className="max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
          Every concept is derived from the six project records and links back to
          the projects where it matters. Use it to rehearse definitions, relevance,
          and likely follow-up questions.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <input
          className="h-14 rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-950 outline-none transition focus:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="Filter by concept, definition, or explanation"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Tabs
          className="max-w-full overflow-x-auto"
          items={conceptCategories.map((item) => ({
            value: item,
            label: formatCategory(item),
          }))}
          value={category}
          onChange={setCategory}
        />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr]">
        {filtered.map((concept, index) => (
          <div id={slugify(concept.name)} key={concept.name}>
            <Accordion
              defaultOpen={index < 2}
              meta={concept.definition}
              title={
                <span className="flex flex-wrap items-center gap-3">
                  {concept.name}
                  <Badge className="normal-case tracking-normal">
                    {formatCategory(concept.category)}
                  </Badge>
                </span>
              }
            >
              <div className="space-y-5">
                <p>{concept.explanation}</p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Used in
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {concept.usedInProjects.map((projectSlug) => (
                      <Link
                        className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-amber-500/40 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
                        href={`/projects/${projectSlug}#concepts`}
                        key={projectSlug}
                      >
                        {projectNames.get(projectSlug)}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Related concepts
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {concept.relatedConcepts.map((related) => (
                      <Badge className="normal-case tracking-normal" key={related}>
                        {related}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
