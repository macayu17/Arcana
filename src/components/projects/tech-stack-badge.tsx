import { Badge } from "@/components/ui/badge";
import type { TechCategory } from "@/lib/types";
import { cn, formatCategory } from "@/lib/utils";

const categoryStyles: Record<TechCategory, string> = {
  frontend: "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.09)] text-[#e6a15b]",
  backend: "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.09)] text-[#e6a15b]",
  database: "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.09)] text-[#e6a15b]",
  devops: "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.09)] text-[#e6a15b]",
  ml: "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.09)] text-[#e6a15b]",
  library: "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.09)] text-[#e6a15b]",
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
