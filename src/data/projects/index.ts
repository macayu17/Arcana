import { engram } from "@/data/projects/engram";
import { equityflow } from "@/data/projects/equityflow";
import { gridpulse } from "@/data/projects/gridpulse";
import { occasio } from "@/data/projects/occasio";
import { parkinsons } from "@/data/projects/parkinsons";
import { sentinel } from "@/data/projects/sentinel";

export const projects = [
  sentinel,
  engram,
  parkinsons,
  occasio,
  equityflow,
  gridpulse,
] as const;

export const projectBySlug = new Map(
  projects.map((project) => [project.slug, project]),
);

export function getProjectBySlug(slug: string) {
  return projectBySlug.get(slug);
}

export function getProjectSlugs() {
  return projects.map((project) => project.slug);
}
