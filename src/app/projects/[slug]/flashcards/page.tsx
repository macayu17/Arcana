import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlashcardDeck } from "@/components/study/flashcard-deck";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Flashcards",
    };
  }

  return {
    title: `${project.name} Flashcards`,
    description: `Practice ${project.name} architecture, concepts, and trade-offs.`,
  };
}

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <FlashcardDeck project={project} />;
}
