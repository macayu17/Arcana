"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function StatsCounter({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const start = performance.now();
    const duration = 900;
    let frame = 0;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <p className="text-4xl font-semibold tabular-nums tracking-tighter text-zinc-950 dark:text-zinc-50">
        {display}
      </p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
    </motion.div>
  );
}
