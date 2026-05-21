import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-3xl place-items-center px-4 py-24 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
          Not found
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50">
          This Arcana page does not exist.
        </h1>
        <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-zinc-300">
          Return to the project atlas or use search to jump to a concept,
          question, flashcard, or architecture section.
        </p>
        <div className="mt-8">
          <ButtonLink href="/projects">Browse projects</ButtonLink>
        </div>
      </div>
    </div>
  );
}
