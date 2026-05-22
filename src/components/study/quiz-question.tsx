"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Difficulty, QuestionCategory } from "@/lib/types";
import { formatCategory } from "@/lib/utils";

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function QuizQuestion({
  question,
  answer,
  difficulty,
  category,
}: {
  question: string;
  answer: string;
  difficulty: Difficulty;
  category: QuestionCategory;
}) {
  const [revealed, setRevealed] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [remaining, setRemaining] = useState(120);

  useEffect(() => {
    if (!timerActive || remaining <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remaining, timerActive]);

  return (
    <div className="arcana-paper-panel rounded-xl p-5">
      <div className="flex flex-wrap gap-2">
        <Badge className="normal-case tracking-normal">
          {formatCategory(category)}
        </Badge>
        <Badge className="normal-case tracking-normal">
          {formatCategory(difficulty)}
        </Badge>
      </div>
      <p className="mt-4 text-base font-semibold leading-7 text-[var(--text-primary)]">
        {question}
      </p>
      {revealed ? (
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {answer}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="quiet"
          icon={
            revealed ? (
              <EyeOff aria-hidden="true" size={16} />
            ) : (
              <Eye aria-hidden="true" size={16} />
            )
          }
          onClick={() => setRevealed((current) => !current)}
        >
          {revealed ? "Hide answer" : "Reveal answer"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          icon={<TimerReset aria-hidden="true" size={16} />}
          onClick={() => {
            setRemaining(120);
            setTimerActive((current) => !current);
          }}
        >
          {timerActive ? "Stop timer" : "Start timer"}
        </Button>
        <span className="rounded-md border border-[var(--border-card)] bg-[rgba(13,12,10,0.55)] px-3 py-1.5 text-sm font-semibold tabular-nums text-[var(--text-secondary)]">
          {formatTimer(remaining)}
        </span>
      </div>
    </div>
  );
}
