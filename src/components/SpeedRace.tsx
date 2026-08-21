"use client";
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "./Reveal";
import { useScrub, useScrubValue, ease } from "@/lib/scrub";
import { type Locale } from "@/content/site";
import { RACE_UI } from "@/content/dayproof";

const GREEN = "#0f9d63";
const RED = "#e0554e";

/* The same request lands with two contractors: whoever answers first books the
   job. Driven by scroll, so it runs while the visitor is reading and rewinds if
   they scroll back — no play button, no replay button. */
export default function SpeedRace({ locale }: { locale: Locale }) {
  const t = RACE_UI[locale];
  const ref = useRef<HTMLDivElement>(null);
  const scrub = useScrub(ref, ["start 90%", "end 52%"]);
  const p = useScrubValue(scrub);

  /* ours is away quickly; the other shop is still dialling */
  const ours = ease(Math.min(1, p / 0.45));
  const rival = ease(Math.min(1, p / 1.6)) * 0.34;
  const booked = ours > 0.99;

  return (
    <section id="speed" className="border-y border-[var(--color-line)] band-panel py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[3rem]">
            {t.titleA} <span style={{ color: GREEN }}>{t.titleFast}</span> {t.titleB}{" "}
            <span className="text-[var(--color-mute)]">{t.titleBig}</span>
          </h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">
            {t.attribution}{" "}
            <strong className="font-semibold text-[var(--color-ink)]">{t.punch}</strong>
          </p>
        </Reveal>

        <div ref={ref} className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
          <p className="font-semibold text-[var(--color-ink)]">{t.cardTitle}</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-7">
              <Lane label={t.yours} sub={t.yoursSub} color={GREEN} at={ours} badge={booked ? `✓ ${t.booked}` : undefined} />
              <Lane label={t.rival} sub={t.rivalSub} color={RED} at={rival} />
            </div>

            <AnimatePresence>
              {booked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
      </div>
    </section>
  );
}

function Lane({ label, sub, color, at, badge }: { label: string; sub: string; color: string; at: number; badge?: string }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-[var(--color-ink)]">
          {label} <span className="ml-1 text-sm font-normal text-[var(--color-slate)]">{sub}</span>
        </p>
        <AnimatePresence>
          {badge && (
            <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-bold" style={{ color }}>
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-[var(--color-line)]">
        <span className="absolute inset-y-0 left-0 rounded-full" style={{ background: color, width: `${at * 100}%` }} />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ background: color, boxShadow: `0 0 0 3px ${color}33`, left: `calc(${at * 100}% - 8px)` }}
        />
      </div>
    </div>
  );
}
