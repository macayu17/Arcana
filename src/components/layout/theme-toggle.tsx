"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useTheme } from "@/components/layout/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Tooltip label={theme === "dark" ? "Switch to light" : "Switch to dark"}>
      <Button
        aria-label="Toggle theme"
        className="h-11 min-h-11 w-11 px-0"
        type="button"
        variant="secondary"
        onClick={toggleTheme}
      >
        <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
      </Button>
    </Tooltip>
  );
}
