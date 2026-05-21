"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/layout/theme-provider";

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
  const { theme } = useTheme();
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
        theme: theme === "dark" ? "github-dark-default" : "github-light",
      });

      if (!cancelled) {
        setHtml(highlighted);
      }
    }

    highlight();
    return () => {
      cancelled = true;
    };
  }, [code, inView, language, theme]);

  return (
    <Card className="overflow-hidden p-0" ref={setContainer}>
      <div className="grid gap-2 border-b border-zinc-200/70 px-6 py-5 dark:border-zinc-800">
        <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {title}
        </p>
        <p className="max-w-[70ch] text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <div className="overflow-x-auto bg-zinc-950">
        {!inView ? (
          <div className="grid h-64 place-items-center bg-zinc-950 text-sm text-zinc-500">
            Code highlight loads when visible
          </div>
        ) : html ? (
          <div
            className="arcana-code min-w-[42rem] text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="h-64 animate-pulse bg-zinc-900" />
        )}
      </div>
      {annotations?.length ? (
        <div className="grid gap-3 border-t border-zinc-200/70 px-6 py-5 dark:border-zinc-800">
          {annotations.map((annotation) => (
            <p
              className="border-l border-amber-500/50 pl-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300"
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
