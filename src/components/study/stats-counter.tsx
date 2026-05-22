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
      className="arcana-paper-panel rounded-xl p-5"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <p className="font-editorial text-3xl font-semibold tabular-nums tracking-tight text-[var(--text-primary)]">
        {display}
      </p>
      <p className="mt-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {label}
      </p>
    </motion.div>
  );
}
