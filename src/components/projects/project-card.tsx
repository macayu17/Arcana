"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";

export function ProjectCard({
  project,
  featured = false,
  className,
  style,
}: {
  project: Project;
  featured?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const visibleTech = project.techStack.slice(0, 3);

  return (
    <motion.div
      className={cn("h-full", className)}
      style={style}
      whileHover={{ y: -4, scale: 1.005 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        className={cn(
          "group arcana-paper-panel grid h-full min-h-56 overflow-hidden rounded-xl p-5 transition duration-300 hover:border-[rgba(217,119,6,0.45)]",
          featured && "min-h-[19rem] md:min-h-[22rem] md:p-6",
        )}
        href={`/projects/${project.slug}`}
      >
        <div className="flex items-start justify-between gap-5 font-mono">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-[rgba(217,119,6,0.24)] bg-[rgba(217,119,6,0.09)] text-[0.66rem] font-semibold uppercase tracking-tight text-[#e6a15b]">
              {getInitials(project.name)}
            </span>
            <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              {project.domain}
            </span>
          </div>
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {project.status}
          </span>
        </div>

        <div className="mt-8">
          <Badge className="border-[var(--border-card)] bg-transparent text-[var(--text-muted)]">
            Dossier
          </Badge>
          <h3
            className={cn(
              "font-editorial mt-4 text-2xl font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)]",
              featured && "max-w-[13ch] text-4xl md:text-5xl",
            )}
          >
            {project.name}
          </h3>
          <p
            className={cn(
              "mt-4 max-w-[56ch] text-sm italic leading-6 text-[var(--text-secondary)]",
              featured && "text-sm leading-7",
            )}
          >
            {project.tagline}
          </p>
        </div>

        <div className="mt-auto pt-8">
          <div className="mb-5 h-px w-full bg-[var(--border-card)]" />
          <div className="flex flex-wrap gap-2">
            {visibleTech.map((tech) => (
              <span
                className="rounded-md border border-[rgba(217,119,6,0.22)] bg-[rgba(217,119,6,0.09)] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#e6a15b]"
                key={tech.name}
              >
                {tech.name}
              </span>
            ))}
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-6 text-[var(--text-muted)] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--accent)]"
            size={18}
          />
        </div>
      </Link>
    </motion.div>
  );
}
