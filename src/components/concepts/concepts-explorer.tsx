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
    <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Concept glossary
          </p>
          <h1 className="font-editorial mt-3 text-4xl font-semibold leading-[1] tracking-tight text-[var(--text-primary)] md:text-5xl">
            Technical recall, cross-linked.
          </h1>
        </div>
        <p className="max-w-[68ch] text-base leading-8 text-[var(--text-secondary)]">
          Every concept is derived from the six project records and links back to
          the projects where it matters. Use it to rehearse definitions, relevance,
          and likely follow-up questions.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <input
          className="h-10 rounded-lg border border-[var(--border-card)] bg-[rgba(13,12,10,0.54)] px-3 text-sm font-medium text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(217,119,6,0.5)]"
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
                  <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Used in
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {concept.usedInProjects.map((projectSlug) => (
                      <Link
                        className="rounded-md border border-[var(--border-card)] px-2 py-1 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[rgba(217,119,6,0.4)] hover:text-[var(--text-primary)]"
                        href={`/projects/${projectSlug}#concepts`}
                        key={projectSlug}
                      >
                        {projectNames.get(projectSlug)}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
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
