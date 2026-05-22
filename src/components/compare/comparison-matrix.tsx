"use client";

import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SortKey = "name" | "domain" | "status" | "complexity";

function frontend(projectSlug: string) {
  return projects
    .find((project) => project.slug === projectSlug)
    ?.techStack.filter((tech) => tech.category === "frontend")
    .map((tech) => tech.name)
    .join(", ");
}

function backend(projectSlug: string) {
  return projects
    .find((project) => project.slug === projectSlug)
    ?.techStack.filter((tech) => tech.category === "backend")
    .map((tech) => tech.name)
    .join(", ");
}

function database(projectSlug: string) {
  return (
    projects.find((project) => project.slug === projectSlug)?.databaseDesign?.type ??
    "Not applicable"
  );
}

export function ComparisonMatrix() {
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const rows = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (sortKey === "complexity") {
        return b.concepts.length + b.techStack.length - (a.concepts.length + a.techStack.length);
      }

      return String(a[sortKey]).localeCompare(String(b[sortKey]));
    });
  }, [sortKey]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            § IV - Comparison matrix
          </p>
          <h1 className="font-editorial mt-4 text-5xl font-medium leading-[0.96] tracking-tight text-[var(--text-primary)] md:text-7xl">
            Six systems, one scanning surface.
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {(["name", "domain", "status", "complexity"] as const).map((key) => (
            <Button
              key={key}
              type="button"
              variant={sortKey === key ? "primary" : "secondary"}
              icon={<ArrowUpDown aria-hidden="true" size={15} />}
              onClick={() => setSortKey(key)}
            >
              {key === "complexity" ? "Complexity" : key}
            </Button>
          ))}
        </div>
      </div>

      <div className="arcana-paper-panel mt-12 overflow-x-auto rounded-[2rem]">
        <table className="min-w-[1100px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border-card)] font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <th className="sticky left-0 bg-[var(--bg-card)] px-5 py-4">
                Project
              </th>
              <th className="px-5 py-4">Domain</th>
              <th className="px-5 py-4">Frontend</th>
              <th className="px-5 py-4">Backend</th>
              <th className="px-5 py-4">Database</th>
              <th className="px-5 py-4">Key concepts</th>
              <th className="px-5 py-4">Architecture pattern</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((project) => (
              <tr
                className="border-b border-[var(--border-card)] align-top last:border-0"
                key={project.slug}
              >
                <td className="sticky left-0 bg-[var(--bg-card)] px-5 py-5">
                  <Link
                    className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
                    href={`/projects/${project.slug}`}
                  >
                    {project.name}
                  </Link>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {project.status}
                  </p>
                </td>
                <td className="px-5 py-5">
                  <Badge>{project.domain}</Badge>
                </td>
                <td className="px-5 py-5 text-sm leading-6 text-[var(--text-secondary)]">
                  {frontend(project.slug)}
                </td>
                <td className="px-5 py-5 text-sm leading-6 text-[var(--text-secondary)]">
                  {backend(project.slug)}
                </td>
                <td className="px-5 py-5 text-sm leading-6 text-[var(--text-secondary)]">
                  {database(project.slug)}
                </td>
                <td className="px-5 py-5">
                  <div className="flex max-w-80 flex-wrap gap-2">
                    {project.concepts.slice(0, 4).map((concept) => (
                      <Badge className="normal-case tracking-normal" key={concept.name}>
                        {concept.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-5 text-sm leading-6 text-[var(--text-secondary)]">
                  {project.architecture.layers.map((layer) => layer.name).join(" -> ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
