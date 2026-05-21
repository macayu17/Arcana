import { Badge } from "@/components/ui/badge";
import type { TechCategory } from "@/lib/types";
import { cn, formatCategory } from "@/lib/utils";

const categoryStyles: Record<TechCategory, string> = {
  frontend: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  backend:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  database:
    "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  devops:
    "border-zinc-400/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  ml: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  library:
    "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
};

export function TechStackBadge({
  name,
  category,
  className,
}: {
  name: string;
  category: TechCategory;
  className?: string;
}) {
  return (
    <Badge className={cn("normal-case tracking-normal", categoryStyles[category], className)}>
      {name}
      <span className="ml-2 text-[0.62rem] opacity-70">
        {formatCategory(category)}
      </span>
    </Badge>
  );
}
