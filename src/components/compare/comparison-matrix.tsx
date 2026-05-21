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
    <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
            Comparison matrix
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tighter text-zinc-950 dark:text-zinc-50 md:text-7xl">
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

      <div className="mt-12 overflow-x-auto rounded-[2rem] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="min-w-[1100px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:border-zinc-800">
              <th className="sticky left-0 bg-white px-5 py-4 dark:bg-zinc-950">
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
                className="border-b border-zinc-100 align-top last:border-0 dark:border-zinc-900"
                key={project.slug}
              >
                <td className="sticky left-0 bg-white px-5 py-5 dark:bg-zinc-950">
                  <Link
                    className="font-semibold text-zinc-950 hover:text-amber-600 dark:text-zinc-50"
                    href={`/projects/${project.slug}`}
                  >
                    {project.name}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {project.status}
                  </p>
                </td>
                <td className="px-5 py-5">
                  <Badge className={project.domainColor}>{project.domain}</Badge>
                </td>
                <td className="px-5 py-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {frontend(project.slug)}
                </td>
                <td className="px-5 py-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {backend(project.slug)}
                </td>
                <td className="px-5 py-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
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
                <td className="px-5 py-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
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
