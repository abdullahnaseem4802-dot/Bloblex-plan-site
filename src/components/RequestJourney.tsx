"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { STEPS, MANUAL_TOTAL, SYSTEM_TOTAL, DECISION_COUNT, SYSTEM_CHATTER, JOURNEY_UI, fmt } from "@/content/journey";

const AMBER = "#d97316";
const GREEN = "#0f9d63";
const BLUE = "#1787c4";

/* Both columns run at once, on their own, as soon as the section is on screen.
   The client's note was that nobody will click through a simulator: it has to
   land in about three seconds, side by side, with no interaction. */
const TICK = 90;          // ms per frame of the race
const MANUAL_PER_TICK = 7; // manual minutes consumed per frame

export default function RequestJourney({ locale }: { locale: Locale }) {
  const t = JOURNEY_UI[locale];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [manualMin, setManualMin] = useState(0);
  const [systemMin, setSystemMin] = useState(0);
  const [runId, setRunId] = useState(0);

  const stop = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  useEffect(() => stop, []);

  const run = useCallback(() => {
    stop();
    if (reduce) { setManualMin(MANUAL_TOTAL); setSystemMin(SYSTEM_TOTAL); return; }
    setManualMin(0); setSystemMin(0);
    setRunId((n) => n + 1);
    /* the system finishes early and then simply waits, which is the point */
    const sysPerTick = SYSTEM_TOTAL / (MANUAL_TOTAL / MANUAL_PER_TICK / 6);
    timer.current = setInterval(() => {
      setManualMin((m) => (m + MANUAL_PER_TICK >= MANUAL_TOTAL ? (stop(), MANUAL_TOTAL) : m + MANUAL_PER_TICK));
      setSystemMin((s) => Math.min(SYSTEM_TOTAL, s + sysPerTick));
    }, TICK);
  }, [reduce]);

  /* only ever plays while the visitor is actually looking at it */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  const manualPct = (manualMin / MANUAL_TOTAL) * 100;
  const systemPct = (systemMin / SYSTEM_TOTAL) * 100;
  const manualDone = Math.round((manualMin / MANUAL_TOTAL) * STEPS.length);
  const systemDone = systemPct >= 99.5 ? STEPS.length : Math.round((systemPct / 100) * STEPS.length);

  return (
    <section id="time" className="border-y border-[var(--color-line)] band-panel py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[3rem]">{t.heading}</h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <div ref={ref} className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <Lane
            key={`m${runId}`}
            label={t.modeManual} tone={AMBER}
            clock={fmt(Math.round(manualMin), locale)}
            total={fmt(MANUAL_TOTAL, locale)}
            pct={manualPct} done={manualDone} locale={locale}
            sub={t.subManual}
            finished={manualMin >= MANUAL_TOTAL}
            finishNote={t.manualDone}
            reduce={!!reduce}
          />
          <Lane
            key={`s${runId}`}
            label={t.modeSystem} tone={GREEN} highlight
            clock={fmt(Math.round(systemMin), locale)}
            total={fmt(SYSTEM_TOTAL, locale)}
            pct={systemPct} done={systemDone} locale={locale}
            sub={t.subSystem}
            finished={systemPct >= 99.5}
            finishNote={t.systemDone(fmt(SYSTEM_TOTAL, locale), DECISION_COUNT)}
            chatter reduce={!!reduce}
          />
        </div>

        <p className="mt-6 max-w-[70ch] text-sm leading-relaxed text-[var(--color-mute)]">{t.closing}</p>
      </div>
    </section>
  );
}

function Lane({
  label, tone, clock, total, pct, done, sub, finished, finishNote, chatter, highlight, locale, reduce,
}: {
  label: string; tone: string; clock: string; total: string; pct: number; done: number;
  sub: string; finished: boolean; finishNote: string; chatter?: boolean; highlight?: boolean;
  locale: Locale; reduce: boolean;
}) {
  return (
    <div
      className="flex flex-col rounded-[var(--radius-lg)] border bg-white p-5 md:p-6"
      style={{
        borderColor: highlight ? `${tone}55` : "var(--color-line)",
        boxShadow: highlight ? `0 26px 60px -30px ${tone}` : "var(--shadow-soft)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em]" style={{ color: tone }}>{label}</p>
          <p className="mt-1 text-sm text-[var(--color-slate)]">{sub}</p>
        </div>
        <p className="shrink-0 font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums md:text-[2.6rem]" style={{ color: tone }}>
          {clock}
        </p>
      </div>

      {/* the race itself */}
      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[var(--color-line)]">
        {/* width has to be set in style as well: without it the span renders at
            its natural full width for one frame before motion takes over, which
            read as the bar sweeping backwards on load */}
        <motion.span
          className="block h-full rounded-full"
          style={{ background: tone, width: 0 }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.12, ease: "linear" }}
        />
      </div>

      {/* the twelve steps, ticking off as the lane advances */}
      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {STEPS.map((s, i) => {
          const on = i < done;
          return (
            <li key={s.label.en} className="flex items-center gap-2 text-[0.82rem]">
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold text-white transition-colors"
                style={{ background: on ? tone : "var(--color-line)" }}
                aria-hidden="true"
              >
                {on ? "✓" : ""}
              </span>
              <span className={on ? "text-[var(--color-ink)]" : "text-[var(--color-mute)]"}>{s.label[locale]}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-[var(--color-line)] pt-4">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.p
              key="done"
              initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold" style={{ color: tone }}
            >
              ✓ {finishNote}
            </motion.p>
          ) : (
            <motion.p key="run" initial={false} className="text-sm text-[var(--color-slate)]">
              {chatter ? <Chatter locale={locale} tone={tone} /> : <span className="tabular-nums">{clock} / {total}</span>}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** the client's own list: sync, connected, 23 ms, AI thinking, verify, done */
function Chatter({ locale, tone }: { locale: Locale; tone: string }) {
  const words = SYSTEM_CHATTER[locale];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 700);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.76rem]" style={{ color: BLUE }}>
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
      {words[i]}
    </span>
  );
}
