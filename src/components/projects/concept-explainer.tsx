"use client";

import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ConfidenceRating } from "@/components/study/confidence-rating";
import { useStudyProgress } from "@/hooks/use-progress";
import type { Project } from "@/lib/types";
import { formatCategory } from "@/lib/utils";

export function ConceptExplainer({ project }: { project: Project }) {
  const { projectProgress, setConfidence } = useStudyProgress(project.slug);

  return (
    <div className="grid gap-3">
      {project.concepts.map((concept, index) => (
        <Accordion
          defaultOpen={index === 0}
          key={concept.name}
          meta={concept.definition}
          title={
            <span className="flex flex-wrap items-center gap-3">
              {concept.name}
              <Badge className="py-0.5 normal-case tracking-normal">
                {formatCategory(concept.category)}
              </Badge>
            </span>
          }
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-4">
              <p>{concept.explanation}</p>
              <p>
                <span className="font-semibold text-[var(--text-primary)]">
                  In {project.name}:
                </span>{" "}
                {concept.relevance}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-card)] bg-[rgba(13,12,10,0.45)] p-4">
              <p className="mb-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Confidence
              </p>
              <ConfidenceRating
                value={projectProgress?.confidence[concept.name]}
                onChange={(value) => setConfidence(concept.name, value)}
              />
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  );
}
