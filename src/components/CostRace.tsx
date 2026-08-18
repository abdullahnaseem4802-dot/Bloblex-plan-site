"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import {
  RING, FIXED_PRICE, RIVAL_END, RIVAL_PROGRESS, OURS_PROGRESS, COST_UI, money,
} from "@/content/costrace";

const RED = "#e0554e";
const BLUE = "#1787c4";
const RUN_MS = 4200;

/** Two projects run side by side: the hourly meter climbs while the work
 *  crawls, ours holds its price and finishes. Then the punchlines land. */
export default function CostRace({ locale }: { locale: Locale }) {
  const t = COST_UI[locale];
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<"idle" | "running" | "punchA" | "punchB">("idle");
  const [k, setK] = useState(0);           // 0..1 through the run
  const raf = useRef<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const clear = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const run = useCallback(() => {
    clear();
    setPhase("running");
    setK(0);
    if (reduce) {
      setK(1); setPhase("punchA");
      timers.current.push(setTimeout(() => setPhase("punchB"), 900));
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / RUN_MS);
      setK(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setPhase("punchA");
        timers.current.push(setTimeout(() => setPhase("punchB"), 2200));
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, [reduce]);

  /* play once when it comes into view */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  const started = phase !== "idle";
  const rivalCost = FIXED_PRICE + (RIVAL_END - FIXED_PRICE) * k;
  const showPunch = phase === "punchA" || phase === "punchB";

  return (
    <section id="cost" className="border-y border-[var(--color-line)] bg-[var(--color-panel)] py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em]">{t.title}</h2>
          <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <Reveal delay={100}>
          <div ref={boxRef} className="relative mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-card)] md:p-10">
            {/* the two systems */}
            <motion.div
              className="grid gap-10 sm:grid-cols-2"
              animate={{ opacity: showPunch ? 0.12 : 1 }}
              transition={{ duration: 0.6 }}
            >
              <Dial
                name={t.rival} sub={t.rivalSub} color={RED}
                progress={started ? RIVAL_PROGRESS * k : 0}
                cost={started ? rivalCost : FIXED_PRICE}
                rising
                locale={locale} t={t} reduce={reduce}
              />
              <Dial
                name={t.ours} sub={t.oursSub} color={BLUE}
                progress={started ? OURS_PROGRESS * k : 0}
                cost={FIXED_PRICE}
                locale={locale} t={t} reduce={reduce}
              />
            </motion.div>

            {/* the punchlines, once the run is over */}
            <AnimatePresence mode="wait">
              {showPunch && (
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center font-[family-name:var(--font-display)] text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] md:text-[2.5rem]"
                  style={{ color: phase === "punchA" ? RED : BLUE }}
                >
                  {phase === "punchA" ? t.punchA : t.punchB}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--color-mute)]">{t.footnote}</p>
              <button
                onClick={run}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)]"
              >
                {started ? `↻ ${t.again}` : `▶ ${t.play}`}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** A ring of segments that fills with progress, with the running cost inside. */
function Dial({
  name, sub, color, progress, cost, rising, locale, t, reduce,
}: {
  name: string; sub: string; color: string; progress: number; cost: number;
  rising?: boolean; locale: Locale; t: (typeof COST_UI)["en"]; reduce: boolean | null;
}) {
  const filled = Math.round(progress * RING);
  return (
    <div className="text-center">
      <p className="font-semibold text-[var(--color-ink)]">{name}</p>
      <p className="text-sm text-[var(--color-slate)]">{sub}</p>

      <div className="relative mx-auto mt-6 aspect-square w-full max-w-[230px]">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {Array.from({ length: RING }, (_, i) => {
            const a = (i / RING) * Math.PI * 2;
            const on = i < filled;
            const r1 = 36, r2 = 45;
            const x1 = 50 + r1 * Math.cos(a), y1 = 50 + r1 * Math.sin(a);
            const x2 = 50 + r2 * Math.cos(a), y2 = 50 + r2 * Math.sin(a);
            return (
              <line
                key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={on ? color : "var(--color-line)"}
                strokeWidth={5} strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: reduce ? undefined : "stroke .25s ease" }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 grid place-content-center">
          <motion.p
            className="font-[family-name:var(--font-display)] text-[1.55rem] font-bold leading-none"
            style={{ color }}
            animate={rising && !reduce ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.5, repeat: rising ? Infinity : 0 }}
          >
            {money(cost, locale)}
            {rising && <span className="ml-0.5 align-top text-base">↑</span>}
          </motion.p>
          <p className="mt-1 text-[0.6rem] font-bold tracking-[0.12em] text-[var(--color-mute)]">
            {t.costLabel}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[0.72rem] font-bold tracking-[0.1em] text-[var(--color-mute)]">
        {t.progressLabel} · <span style={{ color }}>{Math.round(progress * 100)}%</span>
      </p>
    </div>
  );
}
