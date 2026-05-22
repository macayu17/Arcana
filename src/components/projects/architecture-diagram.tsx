"use client";

import { useEffect, useId, useState } from "react";
import { Card } from "@/components/ui/card";

export function ArchitectureDiagram({
  chart,
  title,
}: {
  chart: string;
  title: string;
}) {
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
            actorBkg: "#1b1812",
            actorBorder: "#514331",
            actorTextColor: "#f7f0e4",
            activationBkgColor: "#1b1812",
            activationBorderColor: "#c46b28",
            noteBkgColor: "#1b1812",
            noteBorderColor: "#514331",
            noteTextColor: "#f7f0e4",
            sequenceNumberColor: "#130f0a",
            signalColor: "#c8bba7",
            signalTextColor: "#f7f0e4",
            fontFamily: "var(--font-geist-sans)",
          },
          themeCSS: `
            .node rect,
            .node circle,
            .node ellipse,
            .node polygon,
            .node path,
            rect.actor {
              fill: #1b1812 !important;
              stroke: rgba(222, 204, 171, 0.34) !important;
            }

            .label text,
            .nodeLabel,
            text.actor,
            .actor-box,
            .messageText,
            .loopText,
            .labelText,
            .noteText,
            .sequenceDiagram text {
              fill: #f7f0e4 !important;
              color: #f7f0e4 !important;
              stroke: none !important;
            }

            .actor-line,
            .messageLine0,
            .messageLine1,
            .loopLine,
            .note {
              stroke: rgba(222, 204, 171, 0.5) !important;
            }
          `,
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
  }, [chart, id, inView]);

  return (
    <Card className="overflow-hidden p-0" ref={setContainer}>
      <div className="border-b border-[var(--border-card)] px-6 py-4">
        <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {title}
        </p>
      </div>
      <div className="min-h-96 overflow-x-auto bg-[#0d0c09]/65 p-6">
        {!inView ? (
          <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-[var(--border-card)] text-sm text-[var(--text-muted)]">
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
          <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-[var(--border-card)] text-sm text-[var(--text-muted)]">
            Rendering diagram
          </div>
        )}
      </div>
    </Card>
  );
}
