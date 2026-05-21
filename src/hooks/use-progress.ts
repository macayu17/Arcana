"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getProgressForProject,
  readJson,
  STORAGE_KEYS,
  upsertProgress,
  writeJson,
} from "@/lib/storage";
import { gradeFlashcardReview } from "@/lib/spaced-repetition";
import type {
  FlashcardReviewRecord,
  FlashcardStatus,
  StudyProgress,
} from "@/lib/types";

export function useStudyProgress(projectSlug?: string) {
  const [progress, setProgress] = useState<StudyProgress[]>([]);
  const [flashcardSchedule, setFlashcardSchedule] = useState<
    Record<string, FlashcardReviewRecord>
  >({});

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(readJson<StudyProgress[]>(STORAGE_KEYS.STUDY_PROGRESS, []));
      setFlashcardSchedule(
        readJson<Record<string, FlashcardReviewRecord>>(
          STORAGE_KEYS.FLASHCARD_PROGRESS,
          {},
        ),
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const save = useCallback((next: StudyProgress[]) => {
    setProgress(next);
    writeJson(STORAGE_KEYS.STUDY_PROGRESS, next);
  }, []);

  const projectProgress = useMemo(() => {
    if (!projectSlug) {
      return undefined;
    }

    return getProgressForProject(progress, projectSlug);
  }, [progress, projectSlug]);

  const toggleSection = useCallback(
    (sectionId: string) => {
      if (!projectSlug) {
        return;
      }

      const current = getProgressForProject(progress, projectSlug);
      const alreadyReviewed = current.sectionsReviewed.includes(sectionId);
      const sectionsReviewed = alreadyReviewed
        ? current.sectionsReviewed.filter((section) => section !== sectionId)
        : [...current.sectionsReviewed, sectionId];

      save(
        upsertProgress(progress, {
          ...current,
          sectionsReviewed,
          lastStudied: new Date().toISOString(),
        }),
      );
    },
    [progress, projectSlug, save],
  );

  const setConfidence = useCallback(
    (conceptName: string, confidence: "low" | "medium" | "high") => {
      if (!projectSlug) {
        return;
      }

      const current = getProgressForProject(progress, projectSlug);
      save(
        upsertProgress(progress, {
          ...current,
          confidence: {
            ...current.confidence,
            [conceptName]: confidence,
          },
          lastStudied: new Date().toISOString(),
        }),
      );
    },
    [progress, projectSlug, save],
  );

  const setFlashcardStatus = useCallback(
    (cardId: string, status: FlashcardStatus) => {
      if (!projectSlug) {
        return;
      }

      const current = getProgressForProject(progress, projectSlug);
      const nextSchedule = {
        ...flashcardSchedule,
        [cardId]: gradeFlashcardReview({
          previous: flashcardSchedule[cardId],
          cardId,
          projectSlug,
          status,
        }),
      };

      setFlashcardSchedule(nextSchedule);
      writeJson(STORAGE_KEYS.FLASHCARD_PROGRESS, nextSchedule);

      save(
        upsertProgress(progress, {
          ...current,
          flashcardProgress: {
            ...current.flashcardProgress,
            [cardId]: status,
          },
          lastStudied: new Date().toISOString(),
        }),
      );
    },
    [flashcardSchedule, progress, projectSlug, save],
  );

  return {
    progress,
    flashcardSchedule,
    projectProgress,
    toggleSection,
    setConfidence,
    setFlashcardStatus,
  };
}
