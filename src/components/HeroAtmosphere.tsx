"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

/** Hero depth: a spotlight that tracks the cursor plus slow-rising motes.
 *  Purely decorative and pointer-transparent. */
export default function HeroAtmosphere() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(72);
  const my = useMotionValue(30);
  const x = useSpring(mx, { stiffness: 60, damping: 20 });
  const y = useSpring(my, { stiffness: 60, damping: 20 });
  const sx = useTransform(x, (n) => `${n}%`);
  const sy = useTransform(y, (n) => `${n}%`);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current?.parentElement;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width) * 100);
      my.set(((e.clientY - r.top) / r.height) * 100);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  // deterministic mote layout, so server and client render the same markup
  const motes = Array.from({ length: 14 }, (_, i) => ({
    left: (i * 37) % 100,
    size: 3 + (i % 4),
    delay: (i % 7) * 1.4,
    duration: 14 + (i % 5) * 3,
    drift: (i % 2 ? 1 : -1) * (18 + (i % 3) * 12),
  }));

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {!reduce && (
        <motion.div
          className="absolute inset-0"
          style={{
            ["--sx" as string]: sx,
            ["--sy" as string]: sy,
            background:
              "radial-gradient(38rem 30rem at var(--sx) var(--sy), rgba(41,171,226,.15), transparent 65%)",
          }}
        />
      )}

      {!reduce &&
        motes.map((m, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[var(--color-brand-400)]"
            style={{ left: `${m.left}%`, bottom: -20, width: m.size, height: m.size }}
            animate={{ y: [-20, -520], x: [0, m.drift, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
    </div>
  );
}
