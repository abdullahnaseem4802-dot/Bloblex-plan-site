"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import AppIcon from "./AppIcon";
import { type Locale } from "@/content/site";
import { COMPARISON, TOOLS, LOOSE, RING } from "@/content/comparison";

const RED = "#d2544c";
const GREEN = "#0f9d63";
const BRAND = "#29abe2";

/** Both states at once, no tabs and nothing to click: the client's point is
 *  that a visitor has three seconds and will not press anything to get it. */
export default function SystemComparison({ locale }: { locale: Locale }) {
  const t = COMPARISON[locale];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  /* the picture only animates once it is actually on screen */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLive(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="comparison" className="relative overflow-hidden border-y border-[var(--color-line)] bg-[var(--color-panel)] py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[3rem]">{t.title}</h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <div ref={ref} className="mt-10 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-5">
          {/* ---------------- you right now ---------------- */}
          <Panel
            side={t.left}
            tone={RED}
            live={live}
            reduce={!!reduce}
            picture={
              <>
                {TOOLS.map((tool, i) => {
                  const p = LOOSE[i];
                  return (
                    <motion.div
                      key={tool}
                      className="absolute"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                      animate={live ? { opacity: 1, scale: 1 } : undefined}
                      transition={{ duration: 0.45, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        className="-translate-x-1/2 -translate-y-1/2"
                        style={{ transform: `translate(-50%,-50%) rotate(${p.r}deg)` }}
                      >
                        <AppIcon app={tool} size={38} />
                      </div>
                    </motion.div>
                  );
                })}
                {/* the broken hand-offs between them */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  {[[0, 3], [1, 4], [3, 6], [4, 7], [5, 6]].map(([a, b], i) => (
                    <motion.line
                      key={i}
                      x1={LOOSE[a].x} y1={LOOSE[a].y} x2={LOOSE[b].x} y2={LOOSE[b].y}
                      stroke={RED} strokeWidth="0.4" strokeDasharray="2 2.4" vectorEffect="non-scaling-stroke"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={live ? { opacity: 0.5 } : undefined}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                    />
                  ))}
                </svg>
              </>
            }
          />

          {/* ---------------- the bridge ---------------- */}
          <div className="flex items-center justify-center lg:flex-col lg:gap-3">
            <span className="hidden text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-mute)] lg:block">
              {t.bridge}
            </span>
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-[0_12px_30px_-10px_rgba(41,171,226,.9)]"
              style={{ background: BRAND }}
              aria-hidden="true"
            >
              <span className="lg:hidden">↓</span>
              <span className="hidden lg:inline">→</span>
            </span>
          </div>

          {/* ---------------- what we build you ---------------- */}
          <Panel
            side={t.right}
            tone={GREEN}
            highlight
            live={live}
            reduce={!!reduce}
            picture={
              <>
                {/* one boundary: everything lives inside it */}
                <div className="absolute inset-[6%] rounded-[26px] border-2 border-dashed" style={{ borderColor: `${BRAND}55` }} />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  {RING.map((p, i) => (
                    <motion.line
                      key={i}
                      x1={50} y1={50} x2={p.x} y2={p.y}
                      stroke={BRAND} strokeWidth="0.5" vectorEffect="non-scaling-stroke"
                      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                      animate={live ? { pathLength: 1, opacity: 0.55 } : undefined}
                      transition={{ duration: 0.5, delay: 0.35 + i * 0.06, ease: "easeOut" }}
                    />
                  ))}
                </svg>
                {TOOLS.map((tool, i) => {
                  const p = RING[i];
                  return (
                    <motion.div
                      key={tool}
                      className="absolute"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                      animate={live ? { opacity: 1, scale: 1 } : undefined}
                      transition={{ duration: 0.45, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="-translate-x-1/2 -translate-y-1/2">
                        <AppIcon app={tool} size={38} />
                      </div>
                    </motion.div>
                  );
                })}
                {/* the hub */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-4 py-3 text-center shadow-[0_18px_44px_-14px_rgba(41,171,226,.75)]"
                  initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                  animate={live ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-[family-name:var(--font-display)] text-[0.72rem] font-bold tracking-[0.1em]" style={{ color: BRAND }}>
                    {t.centerTitle}
                  </p>
                </motion.div>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}

function Panel({
  side, tone, picture, live, reduce, highlight,
}: {
  side: typeof COMPARISON["en"]["left"];
  tone: string;
  picture: React.ReactNode;
  live: boolean;
  reduce: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={live ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col rounded-[var(--radius-lg)] border bg-white p-5 md:p-6"
      style={{
        borderColor: highlight ? `${tone}55` : "var(--color-line)",
        boxShadow: highlight ? `0 26px 60px -30px ${tone}` : "var(--shadow-soft)",
      }}
    >
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em]" style={{ color: tone }}>
        {side.label}
      </p>
      <p className="mt-1.5 text-xl font-semibold text-[var(--color-ink)] md:text-2xl">{side.headline}</p>

      {/* the picture carries the argument */}
      <div className="relative mt-5 aspect-[4/3] w-full rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-panel)]/60">
        {picture}
      </div>
      <p className="mt-2 text-center text-[0.72rem] font-medium text-[var(--color-mute)]">{side.caption}</p>

      <ul className="mt-4 space-y-1.5">
        {side.points.map((p) => (
          <li key={p} className="flex gap-2 text-sm text-[var(--color-slate)]">
            <span className="mt-[2px] font-bold" style={{ color: tone }} aria-hidden="true">
              {highlight ? "✓" : "✕"}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-baseline gap-2 border-t border-[var(--color-line)] pt-4">
        <span className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-[2.4rem]" style={{ color: tone }}>
          {side.statValue}
        </span>
        <span className="text-sm text-[var(--color-slate)]">{side.statLabel}</span>
      </div>
    </motion.div>
  );
}
