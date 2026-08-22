"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { useSettle, ease } from "@/lib/scrub";
import { type Locale } from "@/content/site";
import { FIXED_PRICE, RIVAL_END, COST_UI, money } from "@/content/costrace";

const RED = "#d2544c";
const BRAND = "#1787c4";

/* Two meters running the same job. Both start at zero, the client's own note.
   There is nothing to press.

   This used to take the higher of the scroll position and a self-playing clock,
   which broke the "start at zero" rule outright: a visitor who scrolled down at
   any speed arrived with the scroll range already spent, so the meters were sat
   at 100% before the panel had finished entering the screen. There was never an
   animation to see, only its result.

   So the clock alone drives it now, started the moment the panel is properly in
   view. Whoever arrives, however they got here, sees $0 and watches the two
   numbers separate. Same on a phone. */
/** 0 → 1 across [a, b], flat outside it. */
const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

export default function CostRace({ locale }: { locale: Locale }) {
  const t = COST_UI[locale];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  /* 2.2s: long enough that the rival meter visibly keeps climbing after ours
     has stopped, which is the whole comparison */
  const p = useSettle(ref, 2200);

  /* the hourly shop bills all the way through; we stop at the agreed number
     once the work is done, which happens sooner */
  const ours = Math.min(1, p / 0.68);
  const rival = p;

  const oursCost = FIXED_PRICE * ease(Math.min(1, p / 0.2));  // agreed up front, lands early
  const rivalCost = RIVAL_END * ease(rival);

  const done = p > 0.97;

  return (
    <section id="cost" className="border-y border-[var(--color-line)] band-white py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[3rem]">{t.title}</h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <div ref={ref} className="relative mt-10 min-h-[420px] rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-panel)]/50 p-6 md:p-10">
          <div className="grid gap-10 md:grid-cols-2 md:gap-6">
            <Meter
              title={t.rival} sub={t.rivalSub} tone={RED}
              progress={rival} cost={rivalCost} locale={locale}
              costLabel={t.costLabel} progressLabel={t.progressLabel}
              climbing={!done}
              reduce={!!reduce}
            />
            <Meter
              title={t.ours} sub={t.oursSub} tone={BRAND}
              progress={ours} cost={oursCost} locale={locale}
              costLabel={t.costLabel} progressLabel={t.progressLabel}
              settled={p > 0.22}
              reduce={!!reduce}
            />
          </div>

          {/* The two lines the client wrote, arriving as the meters resolve.
              These read from the merged progress, not the raw scroll value:
              wired to the scroll alone they stayed invisible whenever the
              panel finished by settling, leaving a gap where the payoff is. */}
          <div className="pointer-events-none mt-10 min-h-[92px] text-center">
            <p
              className="text-xl font-semibold leading-tight tracking-[-0.02em] transition-opacity duration-300 md:text-[1.7rem]"
              style={{ color: RED, opacity: ramp(p, 0.5, 0.62) * (1 - ramp(p, 0.78, 0.86)) }}
            >
              {t.punchA}
            </p>
            <p
              className="mt-[-2.1rem] text-xl font-semibold leading-tight tracking-[-0.02em] transition-opacity duration-300 md:mt-[-2.6rem] md:text-[1.7rem]"
              style={{ color: BRAND, opacity: ramp(p, 0.82, 0.93) }}
            >
              {t.punchB}
            </p>
          </div>

          <p className="mt-6 text-sm text-[var(--color-mute)]">{t.footnote}</p>
        </div>
      </div>
    </section>
  );
}

function Meter({
  title, sub, tone, progress, cost, locale, costLabel, progressLabel, climbing, settled, reduce,
}: {
  title: string; sub: string; tone: string; progress: number; cost: number;
  locale: Locale; costLabel: string; progressLabel: string;
  climbing?: boolean; settled?: boolean; reduce: boolean;
}) {
  const R = 78;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-lg font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mt-0.5 text-sm text-[var(--color-slate)]">{sub}</p>

      <div className="relative mt-5 h-[196px] w-[196px]">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--color-line)" strokeWidth="12" />
          <circle
            cx="100" cy="100" r={R} fill="none" stroke={tone} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
          />
        </svg>
        {/* the number the visitor actually reads */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-[family-name:var(--font-display)] text-[1.9rem] font-bold tabular-nums leading-none"
            style={{ color: tone }}
          >
            {money(cost, locale)}
          </span>
          <span className="mt-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[var(--color-mute)]">
            {costLabel}
          </span>
          {climbing && progress > 0.06 && !reduce && (
            <motion.span
              className="mt-1 text-xs font-bold"
              style={{ color: tone }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ↑
            </motion.span>
          )}
          {settled && (
            <span className="mt-1 text-xs font-bold" style={{ color: tone }}>✓</span>
          )}
        </div>
      </div>

      <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--color-mute)]">
        {progressLabel} · <span style={{ color: tone }}>{Math.round(progress * 100)}%</span>
      </p>
    </div>
  );
}
