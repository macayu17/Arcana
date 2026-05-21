"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { groupedSearchResults } from "@/lib/search";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";
import type { SearchItem } from "@/lib/types";
import { cn, formatCategory } from "@/lib/utils";

const groupLabels: Record<SearchItem["type"], string> = {
  project: "Projects",
  concept: "Concepts",
  question: "Questions",
  flashcard: "Flashcards",
};

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => {
        setHistory(readJson<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []));
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [open]);

  const groups = useMemo(() => groupedSearchResults(query), [query]);
  const flatResults = useMemo(
    () =>
      (["project", "concept", "question", "flashcard"] as const).flatMap(
        (group) => groups[group],
      ),
    [groups],
  );

  function navigateTo(item: SearchItem) {
    const trimmed = query.trim();
    if (trimmed) {
      const nextHistory = [trimmed, ...history.filter((entry) => entry !== trimmed)].slice(
        0,
        6,
      );
      writeJson(STORAGE_KEYS.SEARCH_HISTORY, nextHistory);
      setHistory(nextHistory);
    }

    router.push(item.slug);
    onClose();
    setQuery("");
  }

  return (
    <Modal className="p-0" open={open} onClose={onClose}>
      <div className="border-b border-zinc-200/80 px-5 pb-4 dark:border-zinc-800">
        <label className="grid grid-cols-[auto_1fr] items-center gap-3">
          <Search aria-hidden="true" className="text-zinc-400" size={20} />
          <input
            autoFocus
            className="h-12 bg-transparent text-base font-medium text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
            placeholder="Search projects, concepts, questions"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) =>
                  Math.min(index + 1, Math.max(flatResults.length - 1, 0)),
                );
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              }

              if (event.key === "Enter" && flatResults[activeIndex]) {
                event.preventDefault();
                navigateTo(flatResults[activeIndex]);
              }

              if (event.key === "Escape") {
                onClose();
              }
            }}
          />
        </label>
      </div>

      <div className="max-h-[58dvh] overflow-y-auto px-3 py-4">
        {!query.trim() ? (
          <div className="space-y-4 px-2 pb-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Try terms like vector embeddings, order book, payment webhook, or replay.
            </p>
            {history.length ? (
              <div className="flex flex-wrap gap-2">
                {history.map((entry) => (
                  <button
                    key={entry}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-amber-500/40 hover:text-zinc-950 active:scale-[0.98] dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
                    type="button"
                    onClick={() => setQuery(entry)}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <AnimatePresence initial={false}>
          {query.trim() && !flatResults.length ? (
            <motion.div
              className="px-3 py-12 text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                No result found
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Search project names, concepts, architecture terms, or Q&A text.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {(["project", "concept", "question", "flashcard"] as const).map(
          (group) =>
            groups[group].length ? (
              <div className="mb-5" key={group}>
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {groupLabels[group]}
                </p>
                <div className="space-y-1">
                  {groups[group].map((item) => {
                    const absoluteIndex = flatResults.findIndex(
                      (result) =>
                        result.type === item.type &&
                        result.slug === item.slug &&
                        result.title === item.title,
                    );

                    return (
                      <button
                        key={`${item.type}-${item.slug}-${item.title}`}
                        className={cn(
                          "grid w-full grid-cols-[1fr_auto] items-center gap-4 rounded-2xl px-3 py-3 text-left transition active:scale-[0.99]",
                          absoluteIndex === activeIndex
                            ? "bg-amber-500/12"
                            : "hover:bg-zinc-950/5 dark:hover:bg-white/5",
                        )}
                        type="button"
                        onClick={() => navigateTo(item)}
                      >
                        <span>
                          <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                            {item.title}
                          </span>
                          <span className="mt-1 line-clamp-1 block text-xs text-zinc-500 dark:text-zinc-400">
                            {item.content}
                          </span>
                          <span className="mt-2 flex flex-wrap gap-2">
                            {item.project ? (
                              <Badge className="py-0.5 normal-case tracking-normal">
                                {item.project}
                              </Badge>
                            ) : null}
                            {item.category ? (
                              <Badge className="py-0.5 normal-case tracking-normal">
                                {formatCategory(item.category)}
                              </Badge>
                            ) : null}
                          </span>
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="text-zinc-400"
                          size={16}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null,
        )}
      </div>
    </Modal>
  );
}
