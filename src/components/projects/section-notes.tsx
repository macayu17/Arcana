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
    <div className="no-print mt-8 rounded-[1.75rem] border border-dashed border-[rgba(222,204,171,0.24)] bg-[rgba(14,13,10,0.54)] p-4">
      <label
        className="flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]"
        htmlFor={`notes-${sectionId}`}
      >
        <StickyNote aria-hidden="true" size={15} />
        Notes
      </label>
      <textarea
        className="mt-3 min-h-24 w-full resize-y rounded-[1.25rem] border border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(196,107,40,0.6)] focus:ring-4 focus:ring-[rgba(196,107,40,0.12)]"
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
