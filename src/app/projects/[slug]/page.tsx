import type { Metadata } from "next";
import { ArrowUpRight, Database, GitBranch, Server, Terminal } from "lucide-react";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { CodeHighlight } from "@/components/projects/code-highlight";
import { ConceptExplainer } from "@/components/projects/concept-explainer";
import { ProjectActions } from "@/components/projects/project-actions";
import { ProjectSection } from "@/components/projects/project-section";
import { SectionNav } from "@/components/projects/section-nav";
import { TechStackBadge } from "@/components/projects/tech-stack-badge";
import { QuizQuestion } from "@/components/study/quiz-question";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";
import { PROJECT_SECTION_IDS } from "@/lib/types";

const sectionLabels = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "how-it-works", label: "How It Works" },
  { id: "concepts", label: "Concepts" },
  { id: "code-highlights", label: "Code" },
  { id: "api-design", label: "API" },
  { id: "database-design", label: "Database" },
  { id: "tradeoffs", label: "Trade-offs" },
  { id: "challenges", label: "Challenges" },
  { id: "requirements", label: "Requirements" },
  { id: "interview-qa", label: "Q&A" },
];

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
      title: "Project not found",
    };
  }

  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: `${project.name} | Arcana`,
      description: project.tagline,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const sections = sectionLabels.filter((section) =>
    PROJECT_SECTION_IDS.includes(section.id as (typeof PROJECT_SECTION_IDS)[number]),
  );

  return (
    <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 md:px-6 xl:grid-cols-[17rem_1fr]">
      <SectionNav projectSlug={project.slug} sections={sections} />

      <article>
        <header className="rounded-[2.5rem] border border-zinc-200/80 bg-white p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-900 md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={project.domainColor}>{project.domain}</Badge>
            <Badge>{project.status}</Badge>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-7xl">
                {project.name}
              </h1>
              <p className="mt-5 max-w-[72ch] text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {project.tagline}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ProjectActions />
              <ButtonLink
                className="no-print"
                href={project.repo}
                variant="secondary"
                icon={<ArrowUpRight aria-hidden="true" size={16} />}
              >
                Repository
              </ButtonLink>
              <ButtonLink
                className="no-print"
                href={`/projects/${project.slug}/flashcards`}
                icon={<GitBranch aria-hidden="true" size={16} />}
              >
                Start flashcards
              </ButtonLink>
            </div>
          </div>
        </header>

        <ProjectSection eyebrow="What it solves" id="overview" title="Overview">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <p className="max-w-[76ch] text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {project.description}
            </p>
            <Card className="grid gap-4 rounded-[2rem]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Target audience
              </p>
              <div className="flex flex-wrap gap-2">
                {project.targetAudience.map((audience) => (
                  <Badge className="normal-case tracking-normal" key={audience}>
                    {audience}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="System design" id="architecture" title="Architecture">
          <div className="grid gap-6">
            <p className="max-w-[76ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
              {project.architecture.overview}
            </p>
            <ArchitectureDiagram chart={project.architecture.diagram} title="Architecture diagram" />
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              {project.architecture.layers.map((layer) => (
                <Card className="rounded-[2rem]" key={layer.name}>
                  <p className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                    {layer.name}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {layer.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {layer.technologies.map((technology) => (
                      <Badge className="normal-case tracking-normal" key={technology}>
                        {technology}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="Implementation surface" id="tech-stack" title="Tech stack">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            {project.techStack.map((tech) => (
              <Card className="rounded-[2rem]" key={`${tech.category}-${tech.name}`}>
                <TechStackBadge category={tech.category} name={tech.name} />
                <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {tech.role}
                </p>
              </Card>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="Operational flow" id="how-it-works" title="How it works">
          <div className="grid gap-8">
            <p className="max-w-[76ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
              {project.howItWorks.summary}
            </p>
            <div className="grid gap-4">
              {project.howItWorks.steps.map((step) => (
                <div
                  className="grid gap-5 rounded-[2rem] border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-[4rem_1fr]"
                  key={step.step}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-sm font-bold tabular-nums text-zinc-950">
                    {step.step}
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                      {step.description}
                    </p>
                    {step.details ? (
                      <p className="mt-3 border-l border-amber-500/50 pl-4 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                        {step.details}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            {project.howItWorks.sequenceDiagram ? (
              <ArchitectureDiagram
                chart={project.howItWorks.sequenceDiagram}
                title="Sequence diagram"
              />
            ) : null}
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="Concept depth" id="concepts" title="Key concepts">
          <ConceptExplainer project={project} />
        </ProjectSection>

        <ProjectSection eyebrow="Implementation evidence" id="code-highlights" title="Code highlights">
          <div className="grid gap-6">
            {project.codeHighlights.map((snippet) => (
              <CodeHighlight
                annotations={snippet.annotations}
                code={snippet.code}
                description={snippet.description}
                key={snippet.title}
                language={snippet.language}
                title={snippet.title}
              />
            ))}
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="Contracts" id="api-design" title="API design">
          {project.apiDesign ? (
            <div className="grid gap-4">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Base URL: <span className="font-mono">{project.apiDesign.baseUrl}</span>
              </p>
              {project.apiDesign.endpoints.map((endpoint) => (
                <Card className="rounded-[2rem]" key={`${endpoint.method}-${endpoint.path}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                      {endpoint.method}
                    </Badge>
                    <code className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {endpoint.description}
                  </p>
                  <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr]">
                    {endpoint.requestBody ? (
                      <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs text-zinc-100">
                        {endpoint.requestBody}
                      </pre>
                    ) : null}
                    {endpoint.responseBody ? (
                      <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs text-zinc-100">
                        {endpoint.responseBody}
                      </pre>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>No external API surface documented for this project.</Card>
          )}
        </ProjectSection>

        <ProjectSection eyebrow="State model" id="database-design" title="Database design">
          {project.databaseDesign ? (
            <div className="grid gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="normal-case tracking-normal">
                  <Database aria-hidden="true" className="mr-2" size={14} />
                  {project.databaseDesign.type}
                </Badge>
              </div>
              {project.databaseDesign.diagram ? (
                <ArchitectureDiagram
                  chart={project.databaseDesign.diagram}
                  title="Data relationship diagram"
                />
              ) : null}
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                {project.databaseDesign.tables.map((table) => (
                  <Card className="rounded-[2rem]" key={table.name}>
                    <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                      {table.name}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                      {table.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {table.fields.map((field) => (
                        <Badge className="font-mono normal-case tracking-normal" key={field}>
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>Database design is not applicable to this project.</Card>
          )}
        </ProjectSection>

        <ProjectSection eyebrow="Architecture decisions" id="tradeoffs" title="Trade-offs">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            {project.tradeoffs.map((tradeoff) => (
              <Card className="rounded-[2rem]" key={tradeoff.decision}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {tradeoff.decision}
                </p>
                <p className="mt-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {tradeoff.chose} over {tradeoff.over}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {tradeoff.reasoning}
                </p>
              </Card>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="Lessons learned" id="challenges" title="Challenges and solutions">
          <div className="grid gap-4">
            {project.challenges.map((challenge) => (
              <Card
                className="grid gap-5 rounded-[2rem] lg:grid-cols-[0.95fr_1.05fr]"
                key={challenge.problem}
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Problem
                  </p>
                  <p className="mt-3 text-base font-semibold leading-7 text-zinc-950 dark:text-zinc-50">
                    {challenge.problem}
                  </p>
                </div>
                <div className="space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  <p>
                    <span className="font-semibold text-zinc-950 dark:text-zinc-50">
                      Solution:
                    </span>{" "}
                    {challenge.solution}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-950 dark:text-zinc-50">
                      Lesson:
                    </span>{" "}
                    {challenge.lesson}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="Runbook" id="requirements" title="Requirements and future work">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="rounded-[2rem]">
              <div className="mb-5 flex items-center gap-3">
                <Terminal aria-hidden="true" className="text-amber-500" size={18} />
                <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Requirements
                </p>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {project.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </Card>
            <Card className="rounded-[2rem]">
              <div className="mb-5 flex items-center gap-3">
                <Server aria-hidden="true" className="text-amber-500" size={18} />
                <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Future improvements
                </p>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {project.futureImprovements.map((improvement) => (
                  <li key={improvement}>{improvement}</li>
                ))}
              </ul>
            </Card>
          </div>
        </ProjectSection>

        <ProjectSection eyebrow="Active recall" id="interview-qa" title="Interview Q&A">
          <div className="grid gap-4">
            {project.interviewQuestions.map((question) => (
              <QuizQuestion
                answer={question.answer}
                category={question.category}
                difficulty={question.difficulty}
                key={question.question}
                question={question.question}
              />
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink className="no-print" href={`/projects/${project.slug}/flashcards`}>
              Continue with flashcards
            </ButtonLink>
          </div>
        </ProjectSection>
      </article>
    </div>
  );
}
