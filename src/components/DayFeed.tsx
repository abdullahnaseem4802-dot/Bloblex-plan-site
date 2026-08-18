"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { DAY_FEED, FEED_TOTAL, FEED_YOURS, FEED_UI } from "@/content/dayproof";

const GREEN = "#0f9d63";
const BLUE = "#1787c4";

/** A day replayed line by line: sixteen things happen, three need you. */
export default function DayFeed({ locale }: { locale: Locale }) {
  const t = FEED_UI[locale];
  const reduce = useReducedMotion();

  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false);   // starts once scrolled into view
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };

  /* only start once the section is actually on screen */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setArmed(true); setPlaying(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    clear();
    if (!playing || !armed) return;
    if (shown >= FEED_TOTAL) { setPlaying(false); return; }
    timer.current = setTimeout(() => setShown((n) => n + 1), reduce ? 120 : 950);
    return clear;
  }, [playing, armed, shown, reduce]);

  /* keep the newest line in view inside the scroller */
  useEffect(() => {
    const list = listRef.current;
    if (!list || shown === 0) return;
    const last = list.children[shown - 1] as HTMLElement | undefined;
    last?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [shown, reduce]);

  const step = useCallback(() => { setPlaying(false); setShown((n) => Math.min(n + 1, FEED_TOTAL)); }, []);
  const restart = useCallback(() => { clear(); setShown(0); setPlaying(true); }, []);

  const doneCount = shown;
  const yoursCount = DAY_FEED.slice(0, shown).filter((i) => i.by === "you").length;

  return (
    <section id="day" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em]">
            {t.titleA} <span className="text-[var(--color-brand-600)]">{t.titleB}</span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div ref={boxRef} className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)]">
            {/* controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] px-5 py-4 md:px-7">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-panel)]"
                >
                  {playing ? `❚❚ ${t.pause}` : `▶ ${t.play}`}
                </button>
                <button
                  onClick={step}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)]"
                >
                  ⏭ {t.oneLine}
                </button>
                <button
                  onClick={restart}
                  aria-label={t.restart}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)]"
                >
                  ↻
                </button>
              </div>

              <p className="text-sm font-medium text-[var(--color-slate)]">
                <span className="font-bold" style={{ color: GREEN }}>{doneCount}</span> {t.doneLabel}
                {" · "}
                <span className="font-bold" style={{ color: BLUE }}>{yoursCount}</span> {t.yoursLabel}
              </p>
            </div>

            {/* the feed */}
            <ul ref={listRef} className="max-h-[24rem] overflow-y-auto">
              <AnimatePresence initial={false}>
                {DAY_FEED.slice(0, shown).map((item, i) => {
                  const mine = item.by === "you";
                  const tone = mine ? BLUE : GREEN;
                  return (
                    <motion.li
                      key={item.at + i}
                      initial={reduce ? undefined : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3 border-b border-[var(--color-line)] px-5 py-3 last:border-0 md:gap-4 md:px-7"
                      style={{ background: mine ? "rgba(23,135,196,.05)" : undefined }}
                    >
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center rounded text-[0.6rem] font-bold text-white"
                        style={{ background: tone }}
                      >
                        {mine ? "●" : "✓"}
                      </span>
                      <span className="w-16 shrink-0 font-mono text-[0.72rem] text-[var(--color-mute)]">{item.at}</span>
                      <span className={`flex-1 text-[0.9rem] ${mine ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-slate)]"}`}>
                        {item.text[locale]}
                      </span>
                      <span className="hidden shrink-0 text-[0.58rem] font-bold tracking-[0.1em] sm:block" style={{ color: mine ? BLUE : "var(--color-mute)" }}>
                        {mine ? t.you : t.system}
                      </span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>

              {shown === 0 && (
                <li className="px-5 py-10 text-center text-sm text-[var(--color-mute)] md:px-7">…</li>
              )}
            </ul>
          </div>
        </Reveal>

        <p className="mt-5 max-w-[62ch] text-sm text-[var(--color-slate)]">
          {t.closingA} <strong className="font-semibold text-[var(--color-ink)]">{t.closingB}</strong> {t.closingC}
        </p>
      </div>
    </section>
  );
}
