"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { STEPS, MANUAL_TOTAL, SYSTEM_TOTAL, DECISION_COUNT, SYSTEM_CHATTER, JOURNEY_UI, fmt } from "@/content/journey";

const AMBER = "#d97316";
const GREEN = "#0f9d63";
const BLUE = "#1787c4";

/* Both columns run at once, on their own, as soon as the section is on screen.
   The client's note was that nobody will click through a simulator: it has to
   land in about three seconds, side by side, with no interaction.

   Each lane now owns its own clock rather than sharing one timer. On a desktop
   the two are side by side, come into view together and still race. On a phone
   they are stacked a screen apart, and a shared timer meant the system lane had
   already run to 12 min before it was ever scrolled to - the visitor saw a
   finished bar and no animation at all. Owning the clock lets each lane start
   when it is actually looked at. */
const RUN_MS = 2600;       // the manual lane, end to end
const SYSTEM_SHARE = 1 / 6; // the system finishes early and then waits, which is the point

export default function RequestJourney({ locale }: { locale: Locale }) {
  const t = JOURNEY_UI[locale];
  const reduce = useReducedMotion();

  return (
    <section id="time" className="border-y border-[var(--color-line)] band-panel py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[3rem]">{t.heading}</h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <Lane
            label={t.modeManual} tone={AMBER}
            total={MANUAL_TOTAL} runMs={RUN_MS}
            locale={locale} sub={t.subManual}
            finishNote={t.manualDone} reduce={!!reduce}
          />
          <Lane
            label={t.modeSystem} tone={GREEN} highlight
            total={SYSTEM_TOTAL} runMs={RUN_MS * SYSTEM_SHARE}
            locale={locale} sub={t.subSystem}
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
  label, tone, total, runMs, sub, finishNote, chatter, highlight, locale, reduce,
}: {
  label: string; tone: string; total: number; runMs: number;
  sub: string; finishNote: string; chatter?: boolean; highlight?: boolean;
  locale: Locale; reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [minutes, setMinutes] = useState(0);

  /* starts the first time this lane is properly on screen, and only then */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) { setMinutes(total); return; }
    let raf = 0;
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now;
      const k = Math.min(1, (now - t0) / runMs);
      setMinutes(total * k);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      raf = requestAnimationFrame(step);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [total, runMs, reduce]);

  const pct = (minutes / total) * 100;
  const finished = pct >= 99.5;
  const done = finished ? STEPS.length : Math.round((pct / 100) * STEPS.length);
  const clock = fmt(Math.round(minutes), locale);
  const totalLabel = fmt(total, locale);

  return (
    <div
      ref={ref}
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
        {/* The clock now advances every frame, so the bar is driven straight
            from it. Handing each frame to a 120ms tween made the bar chase a
            target it never caught: it read 35% while the counter was at 98%. */}
        <span
          className="block h-full rounded-full"
          style={{ background: tone, width: `${pct}%` }}
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
              {chatter ? <Chatter locale={locale} tone={tone} /> : <span className="tabular-nums">{clock} / {totalLabel}</span>}
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
