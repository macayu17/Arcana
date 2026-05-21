"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useStudyProgress } from "@/hooks/use-progress";
import { formatReviewDueDate } from "@/lib/spaced-repetition";
import type { FlashcardStatus, Project } from "@/lib/types";
import { slugify } from "@/lib/utils";

function rotateDeck<T>(items: T[]) {
  if (items.length < 2) {
    return items;
  }

  return [...items.slice(1), items[0]];
}

export function FlashcardDeck({ project }: { project: Project }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [deck, setDeck] = useState(project.flashcards);
  const { flashcardSchedule, projectProgress, setFlashcardStatus } =
    useStudyProgress(project.slug);

  const card = deck[index];
  const cardId = card ? `${project.slug}-${slugify(card.front)}` : "";
  const currentReview = cardId ? flashcardSchedule[cardId] : undefined;
  const answered = Object.keys(projectProgress?.flashcardProgress ?? {}).length;
  const complete = index >= deck.length;

  const results = useMemo(() => {
    const values = Object.values(projectProgress?.flashcardProgress ?? {});
    return {
      know: values.filter((value) => value === "know").length,
      kinda: values.filter((value) => value === "kinda").length,
      dontKnow: values.filter((value) => value === "dont_know").length,
    };
  }, [projectProgress?.flashcardProgress]);

  function next() {
    setRevealed(false);
    setIndex((current) => Math.min(current + 1, deck.length));
  }

  function previous() {
    setRevealed(false);
    setIndex((current) => Math.max(current - 1, 0));
  }

  function grade(status: FlashcardStatus) {
    setFlashcardStatus(cardId, status);
    next();
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setRevealed(false);
        setIndex((current) => Math.min(current + 1, deck.length));
      }

      if (event.key === "ArrowLeft") {
        setRevealed(false);
        setIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setRevealed((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deck.length]);

  if (complete) {
    return (
      <div className="mx-auto grid min-h-[70dvh] max-w-3xl place-items-center px-4 py-24">
        <div className="w-full rounded-[2.5rem] border border-zinc-200 bg-white p-8 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Deck complete
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50">
            {project.name} review summary
          </h1>
          <div className="mt-8 grid grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl bg-emerald-500/10 p-4">
              <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
                {results.know}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Know
              </p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-4">
              <p className="text-2xl font-semibold text-amber-700 dark:text-amber-300">
                {results.kinda}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Kinda
              </p>
            </div>
            <div className="rounded-2xl bg-rose-500/10 p-4">
              <p className="text-2xl font-semibold text-rose-700 dark:text-rose-300">
                {results.dontKnow}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Review
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              icon={<RotateCcw aria-hidden="true" size={16} />}
              onClick={() => {
                setIndex(0);
                setRevealed(false);
              }}
            >
              Restart deck
            </Button>
            <ButtonLink href={`/projects/${project.slug}`} variant="secondary">
              Back to project
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-24">
      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Flashcards
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-6xl">
            {project.name}
          </h1>
        </div>
        <Button
          type="button"
          variant="secondary"
          icon={<Shuffle aria-hidden="true" size={16} />}
          onClick={() => {
            setDeck((current) => rotateDeck(current));
            setIndex(0);
            setRevealed(false);
          }}
        >
          Shuffle
        </Button>
      </div>

      <div className="mb-8 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-amber-500 transition-all"
          style={{ width: `${(answered / deck.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.button
          className="grid min-h-[28rem] w-full place-items-center rounded-[2.5rem] border border-zinc-200 bg-white p-8 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] outline-none transition hover:border-amber-500/30 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900"
          key={`${index}-${revealed}`}
          type="button"
          initial={{ rotateY: revealed ? -90 : 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: revealed ? 90 : -90, opacity: 0 }}
          onClick={() => setRevealed((current) => !current)}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Card {index + 1} of {deck.length}
            </p>
            <p className="mt-8 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
              {revealed ? card.back : card.front}
            </p>
            <p className="mt-8 text-sm font-semibold text-zinc-400">
              Click to {revealed ? "hide answer" : "reveal answer"}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              {formatReviewDueDate(currentReview?.dueAt)}
            </p>
          </div>
        </motion.button>
      </AnimatePresence>

      <div className="mt-8 grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
        <Button
          type="button"
          variant="secondary"
          icon={<ArrowLeft aria-hidden="true" size={16} />}
          onClick={previous}
          disabled={index === 0}
        >
          Previous
        </Button>
        {revealed ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              type="button"
              variant="quiet"
              icon={<Check aria-hidden="true" size={16} />}
              onClick={() => grade("know")}
            >
              Know
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => grade("kinda")}
            >
              Kinda
            </Button>
            <Button
              type="button"
              variant="quiet"
              icon={<X aria-hidden="true" size={16} />}
              onClick={() => grade("dont_know")}
            >
              Review
            </Button>
          </div>
        ) : (
          <Button
            className="justify-self-center"
            type="button"
            onClick={() => setRevealed(true)}
          >
            Reveal answer
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          icon={<ArrowRight aria-hidden="true" size={16} />}
          onClick={next}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
