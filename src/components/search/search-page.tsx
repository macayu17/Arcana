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
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
        Search
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-7xl">
        Find any project detail.
      </h1>
      <input
        className="mt-10 h-14 w-full rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-950 outline-none transition focus:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        placeholder="Search architecture, concepts, Q&A, or flashcards"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="mt-10 grid gap-8">
        {(["project", "concept", "question", "flashcard"] as const).map((group) =>
          groups[group].length ? (
            <section key={group}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {labels[group]}
              </p>
              <div className="grid gap-3">
                {groups[group].map((item) => (
                  <Link
                    className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 transition hover:border-amber-500/30 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-950"
                    href={item.slug}
                    key={`${item.type}-${item.slug}-${item.title}`}
                  >
                    <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                      {item.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
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
