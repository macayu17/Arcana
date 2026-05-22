"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export function CodeHighlight({
  title,
  description,
  language,
  code,
  annotations,
}: {
  title: string;
  description: string;
  language: string;
  code: string;
  annotations?: string[];
}) {
  const [html, setHtml] = useState("");
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

    async function highlight() {
      const { codeToHtml } = await import("shiki");
      const highlighted = await codeToHtml(code, {
        lang: language,
        theme: "github-dark-default",
      });

      if (!cancelled) {
        setHtml(highlighted);
      }
    }

    highlight();
    return () => {
      cancelled = true;
    };
  }, [code, inView, language]);

  return (
    <Card className="overflow-hidden p-0" ref={setContainer}>
      <div className="grid gap-2 border-b border-[var(--border-card)] px-6 py-5">
        <p className="font-editorial text-2xl font-medium tracking-tight text-[var(--text-primary)]">
          {title}
        </p>
        <p className="max-w-[70ch] text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </p>
      </div>
      <div className="overflow-x-auto bg-[#0d0c09]">
        {!inView ? (
          <div className="grid h-64 place-items-center bg-[#0d0c09] text-sm text-[var(--text-muted)]">
            Code highlight loads when visible
          </div>
        ) : html ? (
          <div
            className="arcana-code min-w-[42rem] text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="h-64 animate-pulse bg-[rgba(235,231,223,0.035)]" />
        )}
      </div>
      {annotations?.length ? (
        <div className="grid gap-3 border-t border-[var(--border-card)] px-6 py-5">
          {annotations.map((annotation) => (
            <p
              className="border-l border-[rgba(217,119,6,0.5)] pl-4 text-sm leading-6 text-[var(--text-secondary)]"
              key={annotation}
            >
              {annotation}
            </p>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
