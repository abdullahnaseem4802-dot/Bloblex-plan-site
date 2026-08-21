"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { useScrub, useScrubValue, stagger, ease } from "@/lib/scrub";
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

  /* The right-hand system wires itself together as the section is scrolled,
     spoke by spoke, and only once it is whole does data start moving through
     it. The left side never resolves: it keeps twitching and its hand-offs
     keep dropping in and out, which is the whole argument. */
  /* Tuned so the system is finished by the time the panel is properly in
     front of the visitor, not after they have scrolled past it. */
  const scrub = useScrub(ref, ["start 92%", "end 96%"]);
  const raw = useScrubValue(scrub);

  /* Belt and braces: once the panel is meaningfully on screen it finishes on
     its own, so nobody can ever be looking at a half-built system because
     their scroll happened to stop there. Whichever is further along wins, so
     scrolling still drives it and scrolling back still unwinds it. */
  const [auto, setAuto] = useState(0);
  useEffect(() => {
    if (!live || reduce) return;
    const t0 = performance.now();
    let f = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 1100);
      setAuto(t);
      if (t < 1) f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [live, reduce]);

  const p = Math.max(raw, auto);
  const wire = (i: number) => (reduce ? 1 : ease(stagger(p, i, RING.length, 1.7)));
  const hub = reduce ? 1 : ease(Math.min(1, Math.max(0, (p - 0.62) / 0.3)));
  const flowing = p > 0.9;

  /* the picture only animates once it is actually on screen */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLive(true); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="comparison" className="relative overflow-hidden border-y border-[var(--color-line)] band-panel py-20 md:py-28">
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
                      animate={
                        live
                          ? reduce
                            ? { opacity: 1, scale: 1 }
                            : {
                                opacity: 1, scale: 1,
                                /* never settles: each one drifts on its own clock */
                                x: [0, (i % 2 ? 1 : -1) * (3 + (i % 3)), 0],
                                y: [0, (i % 3 ? -1 : 1) * (3 + (i % 2) * 2), 0],
                              }
                          : undefined
                      }
                      transition={{
                        opacity: { duration: 0.45, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] },
                        scale: { duration: 0.45, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] },
                        x: { duration: 3.4 + (i % 4) * 0.7, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 4.1 + (i % 3) * 0.6, repeat: Infinity, ease: "easeInOut" },
                      }}
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
                      /* the hand-offs keep dropping and coming back */
                      animate={live ? (reduce ? { opacity: 0.5 } : { opacity: [0.08, 0.55, 0.12, 0.5, 0.08] }) : undefined}
                      transition={{ duration: 3.2 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 + i * 0.08 }}
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
                      style={{ pathLength: wire(i), opacity: wire(i) * 0.6 }}
                    />
                  ))}
                  {/* once every spoke is wired, one packet runs each of them */}
                  {flowing && !reduce && RING.map((q, i) => (
                    <motion.circle
                      key={"pk" + i}
                      r="1.6" fill={BRAND}
                      initial={{ cx: 50, cy: 50, opacity: 0 }}
                      animate={{ cx: [50, q.x], cy: [50, q.y], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.34, ease: "easeInOut", repeatDelay: 1.4 }}
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
                      animate={{ opacity: wire(i), scale: 0.62 + wire(i) * 0.38 }}
                      transition={{ duration: 0 }}
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
                  animate={{ opacity: hub, scale: 0.72 + hub * 0.28 }}
                  transition={{ duration: 0 }}
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
