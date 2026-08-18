"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { RACE_UI } from "@/content/dayproof";

const GREEN = "#0f9d63";
const RED = "#e0554e";

/** The same request lands with two contractors. Whoever answers first books
 *  the job, which is the client's whole argument for responsiveness. */
export default function SpeedRace({ locale }: { locale: Locale }) {
  const t = RACE_UI[locale];
  const reduce = useReducedMotion();

  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [runId, setRunId] = useState(0);   // bumping this remounts the lanes
  const boxRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  /* drop back to idle for a frame first, otherwise the bars are already at
     their target width and "run it again" does nothing visible */
  /* Remount the lanes on every run. Simply flipping the target width made
     motion interpolate from wherever the bar already was, so replaying looked
     like nothing happened. */
  const run = useCallback(() => {
    clear();
    setState("idle");
    setRunId((n) => n + 1);
    timers.current.push(setTimeout(() => {
      setState("running");
      timers.current.push(setTimeout(() => setState("done"), reduce ? 200 : 2100));
    }, 80));
  }, [reduce]);

  /* play once when it scrolls into view */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  const started = state !== "idle";
  const finished = state === "done";

  return (
    <section id="speed" className="border-y border-[var(--color-line)] bg-[var(--color-panel)] py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[3rem] font-semibold leading-[1.06] tracking-[-0.03em]">
            {t.titleA} <span style={{ color: GREEN }}>{t.titleFast}</span> {t.titleB}{" "}
            <span className="text-[var(--color-mute)]">{t.titleBig}</span>
          </h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">
            {t.attribution}{" "}
            <strong className="font-semibold text-[var(--color-ink)]">{t.punch}</strong>
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div ref={boxRef} className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-[var(--color-ink)]">{t.cardTitle}</p>
              <button
                onClick={run}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)]"
              >
                {started ? `↻ ${t.again}` : `▶ ${t.play}`}
              </button>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-7">
                {/* your system */}
                <Lane
                  key={`y${runId}`}
                  label={t.yours}
                  sub={t.yoursSub}
                  color={GREEN}
                  target={100}
                  duration={reduce ? 0.1 : 1.1}
                  started={started}
                  reduce={reduce}
                  badge={finished ? `✓ ${t.booked}` : undefined}
                />
                {/* the competitor */}
                <Lane
                  key={`r${runId}`}
                  label={t.rival}
                  sub={t.rivalSub}
                  color={RED}
                  target={22}
                  duration={reduce ? 0.1 : 2.1}
                  started={started}
                  reduce={reduce}
                />
              </div>

              {/* who the client ends up talking to */}
              <AnimatePresence>
                {finished && (
                  <motion.div
                    initial={reduce ? undefined : { opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[var(--radius)] border-2 px-5 py-4 text-center"
                    style={{ borderColor: GREEN, background: "rgba(15,157,99,.07)" }}
                  >
                    <p className="text-[0.66rem] font-bold tracking-[0.14em]" style={{ color: GREEN }}>{t.clientBadge}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">{t.clientBadgeSub}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-7 text-sm text-[var(--color-mute)]">{t.footnote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Lane({
  label, sub, color, target, duration, started, reduce, badge,
}: {
  label: string; sub: string; color: string; target: number;
  duration: number; started: boolean; reduce: boolean | null; badge?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-[var(--color-ink)]">
          {label} <span className="ml-1 text-sm font-normal text-[var(--color-slate)]">{sub}</span>
        </p>
        <AnimatePresence>
          {badge && (
            <motion.span
              initial={reduce ? undefined : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-bold"
              style={{ color }}
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-[var(--color-line)]">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={{ width: "0%" }}
          animate={{ width: started ? `${target}%` : "0%" }}
          transition={{ duration, ease: "easeOut" }}
        />
        {/* the runner's head, so the race reads as movement */}
        <motion.span
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ background: color, boxShadow: `0 0 0 3px ${color}33` }}
          initial={{ left: "0%" }}
          animate={{ left: started ? `calc(${target}% - 8px)` : "0%" }}
          transition={{ duration, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
