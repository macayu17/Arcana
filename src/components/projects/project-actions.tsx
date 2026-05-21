"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectActions() {
  return (
    <Button
      className="no-print"
      type="button"
      variant="secondary"
      icon={<Download aria-hidden="true" size={16} />}
      onClick={() => window.print()}
    >
      Export PDF
    </Button>
  );
}
