"use client";

import { StickyNote } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";

type NotesStore = Record<string, string>;

export function SectionNotes({
  sectionId,
  title,
}: {
  sectionId: string;
  title: string;
}) {
  const pathname = usePathname();
  const [notes, setNotes] = useState<NotesStore>({});
  const projectSlug = pathname.split("/")[2] ?? "";
  const noteKey = useMemo(
    () => `${projectSlug}:${sectionId}`,
    [projectSlug, sectionId],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setNotes(readJson<NotesStore>(STORAGE_KEYS.NOTES, {}));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!projectSlug) {
    return null;
  }

  const value = notes[noteKey] ?? "";

  return (
    <div className="no-print mt-8 rounded-[1.75rem] border border-dashed border-zinc-300/80 bg-zinc-50/70 p-4 dark:border-zinc-700 dark:bg-zinc-950/70">
      <label
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"
        htmlFor={`notes-${sectionId}`}
      >
        <StickyNote aria-hidden="true" size={15} />
        Notes
      </label>
      <textarea
        className="mt-3 min-h-24 w-full resize-y rounded-[1.25rem] border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        id={`notes-${sectionId}`}
        placeholder={`Add ${title.toLowerCase()} notes here`}
        value={value}
        onChange={(event) => {
          const next = { ...notes, [noteKey]: event.target.value };
          setNotes(next);
          writeJson(STORAGE_KEYS.NOTES, next);
        }}
      />
    </div>
  );
}
