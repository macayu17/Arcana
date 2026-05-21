import type { StudyProgress } from "@/lib/types";

export const STORAGE_KEYS = {
  THEME: "arcana-theme",
  STUDY_PROGRESS: "arcana-study-progress",
  FLASHCARD_PROGRESS: "arcana-flashcard-progress",
  SEARCH_HISTORY: "arcana-search-history",
  NOTES: "arcana-notes",
} as const;

export type ThemeMode = "light" | "dark";

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getProgressForProject(
  allProgress: StudyProgress[],
  projectSlug: string,
): StudyProgress {
  return (
    allProgress.find((progress) => progress.projectSlug === projectSlug) ?? {
      projectSlug,
      sectionsReviewed: [],
      confidence: {},
      lastStudied: "",
      flashcardProgress: {},
    }
  );
}

export function upsertProgress(
  allProgress: StudyProgress[],
  nextProgress: StudyProgress,
) {
  const index = allProgress.findIndex(
    (progress) => progress.projectSlug === nextProgress.projectSlug,
  );

  if (index === -1) {
    return [...allProgress, nextProgress];
  }

  return allProgress.map((progress, currentIndex) =>
    currentIndex === index ? nextProgress : progress,
  );
}
