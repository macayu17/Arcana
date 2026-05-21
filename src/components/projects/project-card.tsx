"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { ProjectIcon } from "@/components/projects/project-icon";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

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
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        className={cn(
          "group grid h-full min-h-64 overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition duration-300 hover:border-amber-500/30 dark:border-zinc-700/50 dark:bg-zinc-900",
          featured && "min-h-[30rem] p-8",
        )}
        href={`/projects/${project.slug}`}
      >
        <div className="flex items-start justify-between gap-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
            <ProjectIcon name={project.icon} />
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="text-zinc-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber-500"
            size={18}
          />
        </div>

        <div className="mt-auto pt-10">
          <Badge className={project.domainColor}>{project.domain}</Badge>
          <h3
            className={cn(
              "mt-5 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50",
              featured && "text-4xl md:text-5xl",
            )}
          >
            {project.name}
          </h3>
          <p
            className={cn(
              "mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400",
              featured && "max-w-[58ch] text-base",
            )}
          >
            {project.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {visibleTech.map((tech) => (
              <span
                className="rounded-full border border-zinc-200/80 px-3 py-1 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                key={tech.name}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
