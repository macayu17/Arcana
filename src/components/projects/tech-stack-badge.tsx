import { Badge } from "@/components/ui/badge";
import type { TechCategory } from "@/lib/types";
import { cn, formatCategory } from "@/lib/utils";

const categoryStyles: Record<TechCategory, string> = {
  frontend: "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] text-[#e7a56d]",
  backend: "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] text-[#e7a56d]",
  database: "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] text-[#e7a56d]",
  devops: "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] text-[#e7a56d]",
  ml: "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] text-[#e7a56d]",
  library: "border-[rgba(196,107,40,0.32)] bg-[rgba(196,107,40,0.1)] text-[#e7a56d]",
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
