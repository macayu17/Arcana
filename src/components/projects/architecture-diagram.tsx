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
          theme: "dark",
          themeVariables: {
            primaryColor: "#15130f",
            primaryTextColor: "#f7f0e4",
            primaryBorderColor: "#514331",
            lineColor: "#c46b28",
            secondaryColor: "#1b1812",
            tertiaryColor: "#0e0d0a",
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
      <div className="border-b border-[var(--border-card)] px-6 py-4">
        <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {title}
        </p>
      </div>
      <div className="min-h-96 overflow-x-auto p-6">
        {!inView ? (
          <div className="grid min-h-80 place-items-center rounded-[1.5rem] border border-dashed border-[var(--border-card)] text-sm text-[var(--text-muted)]">
            Diagram loads when visible
          </div>
        ) : error ? (
          <pre className="whitespace-pre-wrap text-sm text-[#f0a38d]">
            {error}
          </pre>
        ) : svg ? (
          <div
            className="arcana-mermaid min-w-[44rem]"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="grid min-h-80 place-items-center rounded-[1.5rem] border border-dashed border-[var(--border-card)] text-sm text-[var(--text-muted)]">
            Rendering diagram
          </div>
        )}
      </div>
    </Card>
  );
}
