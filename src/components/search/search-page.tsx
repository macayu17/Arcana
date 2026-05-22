"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { groupedSearchResults } from "@/lib/search";
import { formatCategory } from "@/lib/utils";

const labels = {
  project: "Projects",
  concept: "Concepts",
  question: "Questions",
  flashcard: "Flashcards",
} as const;

export function SearchPage() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const groups = useMemo(() => groupedSearchResults(query), [query]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-24">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
        Search
      </p>
      <h1 className="font-editorial mt-4 text-5xl font-medium tracking-tight text-[var(--text-primary)] md:text-7xl">
        Find any project detail.
      </h1>
      <input
        className="mt-10 h-14 w-full rounded-full border border-[var(--border-card)] bg-[rgba(14,13,10,0.54)] px-5 text-sm font-medium text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(196,107,40,0.55)]"
        placeholder="Search architecture, concepts, Q&A, or flashcards"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="mt-10 grid gap-8">
        {(["project", "concept", "question", "flashcard"] as const).map((group) =>
          groups[group].length ? (
            <section key={group}>
              <p className="mb-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {labels[group]}
              </p>
              <div className="grid gap-3">
                {groups[group].map((item) => (
                  <Link
                    className="arcana-paper-panel rounded-[1.5rem] p-5 transition hover:border-[rgba(196,107,40,0.45)] active:scale-[0.99]"
                    href={item.slug}
                    key={`${item.type}-${item.slug}-${item.title}`}
                  >
                    <p className="font-editorial text-2xl font-medium tracking-tight text-[var(--text-primary)]">
                      {item.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">
                      {item.content}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.project ? (
                        <Badge className="normal-case tracking-normal">
                          {item.project}
                        </Badge>
                      ) : null}
                      {item.category ? (
                        <Badge className="normal-case tracking-normal">
                          {formatCategory(item.category)}
                        </Badge>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null,
        )}
      </div>
    </div>
  );
}
