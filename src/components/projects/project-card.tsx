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
          "group arcana-paper-panel grid h-full min-h-72 overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:border-[rgba(196,107,40,0.48)]",
          featured && "min-h-[24rem] md:min-h-[28rem] md:p-8",
        )}
        href={`/projects/${project.slug}`}
      >
        <div className="flex items-start justify-between gap-5 font-mono">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-[rgba(196,107,40,0.24)] bg-[rgba(196,107,40,0.1)] text-[0.66rem] font-semibold uppercase tracking-tight text-[#e7a56d]">
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

        <div className="mt-10">
          <Badge className="border-[var(--border-card)] bg-transparent text-[var(--text-muted)]">
            Dossier
          </Badge>
          <h3
            className={cn(
              "font-editorial mt-5 text-3xl font-medium leading-[1.02] tracking-tight text-[var(--text-primary)]",
              featured && "max-w-[13ch] text-5xl md:text-6xl",
            )}
          >
            {project.name}
          </h3>
          <p
            className={cn(
              "mt-4 max-w-[56ch] text-sm italic leading-6 text-[var(--text-secondary)]",
              featured && "text-base leading-7",
            )}
          >
            {project.tagline}
          </p>
        </div>

        <div className="mt-auto pt-10">
          <div className="mb-5 h-px w-full bg-[var(--border-card)]" />
          <div className="flex flex-wrap gap-2">
            {visibleTech.map((tech) => (
              <span
                className="rounded-md border border-[rgba(196,107,40,0.22)] bg-[rgba(196,107,40,0.09)] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#e7a56d]"
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
