import type { FlashcardReviewRecord, FlashcardStatus } from "@/lib/types";

const QUALITY_BY_STATUS: Record<FlashcardStatus, number> = {
  know: 5,
  kinda: 3,
  dont_know: 1,
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function gradeFlashcardReview({
  previous,
  cardId,
  projectSlug,
  status,
  now = new Date(),
}: {
  previous?: FlashcardReviewRecord;
  cardId: string;
  projectSlug: string;
  status: FlashcardStatus;
  now?: Date;
}): FlashcardReviewRecord {
  const quality = QUALITY_BY_STATUS[status];
  const previousEase = previous?.easeFactor ?? 2.5;
  const previousRepetitions = previous?.repetitions ?? 0;
  const previousInterval = previous?.intervalDays ?? 0;

  if (quality < 3) {
    return {
      cardId,
      projectSlug,
      status,
      repetitions: 0,
      intervalDays: 1,
      easeFactor: Math.max(1.3, previousEase - 0.2),
      lastReviewed: now.toISOString(),
      dueAt: addDays(now, 1).toISOString(),
    };
  }

  const repetitions = previousRepetitions + 1;
  const easeFactor = Math.max(
    1.3,
    previousEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  const intervalDays =
    repetitions === 1
      ? 1
      : repetitions === 2
        ? 3
        : Math.max(4, Math.round(previousInterval * easeFactor));

  return {
    cardId,
    projectSlug,
    status,
    repetitions,
    intervalDays,
    easeFactor,
    lastReviewed: now.toISOString(),
    dueAt: addDays(now, intervalDays).toISOString(),
  };
}

export function formatReviewDueDate(dueAt?: string) {
  if (!dueAt) {
    return "Not scheduled";
  }

  const dueTime = new Date(dueAt).getTime();
  if (Number.isNaN(dueTime)) {
    return "Not scheduled";
  }

  const diff = dueTime - Date.now();
  if (diff <= 0) {
    return "Due now";
  }

  const days = Math.ceil(diff / 86400000);
  return `Due in ${days} day${days === 1 ? "" : "s"}`;
}
