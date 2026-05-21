"use client";

import { useEffect, useId, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/layout/theme-provider";

export function ArchitectureDiagram({
  chart,
  title,
}: {
  chart: string;
  title: string;
}) {
  const { theme } = useTheme();
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!container || inView) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [container, inView]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: theme === "dark" ? "dark" : "base",
          themeVariables: {
            primaryColor: theme === "dark" ? "#18181b" : "#ffffff",
            primaryTextColor: theme === "dark" ? "#fafafa" : "#18181b",
            primaryBorderColor: theme === "dark" ? "#3f3f46" : "#e4e4e7",
            lineColor: "#f59e0b",
            fontFamily: "var(--font-geist-sans)",
          },
        });

        const result = await mermaid.render(`arcana-${id}`, chart);
        if (!cancelled) {
          setSvg(result.svg);
          setError("");
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Diagram render failed",
          );
        }
      }
    }

    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart, id, inView, theme]);

  return (
    <Card className="overflow-hidden p-0" ref={setContainer}>
      <div className="border-b border-zinc-200/70 px-6 py-4 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </p>
      </div>
      <div className="min-h-96 overflow-x-auto p-6">
        {!inView ? (
          <div className="grid min-h-80 place-items-center rounded-[1.5rem] border border-dashed border-zinc-200 text-sm text-zinc-400 dark:border-zinc-800">
            Diagram loads when visible
          </div>
        ) : error ? (
          <pre className="whitespace-pre-wrap text-sm text-rose-600 dark:text-rose-300">
            {error}
          </pre>
        ) : svg ? (
          <div
            className="arcana-mermaid min-w-[44rem]"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="grid min-h-80 place-items-center rounded-[1.5rem] border border-dashed border-zinc-200 text-sm text-zinc-400 dark:border-zinc-800">
            Rendering diagram
          </div>
        )}
      </div>
    </Card>
  );
}
