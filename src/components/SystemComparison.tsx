"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { COMPARISON, NODES } from "@/content/comparison";

const CX = 50, CY = 47; // centre of the stage, in %

/* State 2 wiring: every tool cross-wired to several others. Fixed pairs, so
   the tangle renders identically on server and client. */
const SPAGHETTI: [number, number][] = [];
for (let i = 0; i < NODES.length; i++) {
  for (const step of [1, 3, 5, 7]) SPAGHETTI.push([i, (i + step) % NODES.length]);
}

export default function SystemComparison({ locale }: { locale: Locale }) {
  const t = COMPARISON[locale];
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const state = t.states[tab];
  const labels = tab === 2 ? t.owned : t.tools;
  const accent = tab === 0 ? "#8a94a8" : tab === 1 ? "#d97316" : "#1787c4";

  return (
    <section id="comparison" className="relative overflow-hidden bg-[var(--color-panel)] border-y border-[var(--color-line)] py-20 md:py-28">
      <div className="container relative">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em]">{t.title}</h2>
          <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        {/* state switcher */}
        <div className="mt-10 flex flex-wrap gap-2">
          {t.tabs.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              aria-pressed={tab === i}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                tab === i
                  ? "border-transparent bg-[var(--color-brand-500)] text-white shadow-[0_10px_30px_-8px_rgba(41,171,226,.8)]"
                  : "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--color-brand-300)] hover:text-[var(--color-ink)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          {/* ---------------- diagram ---------------- */}
          <div className="relative aspect-[10/7] w-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {/* state 2: the tangle */}
              {tab === 1 && SPAGHETTI.map(([a, b], i) => (
                <motion.line
                  key={"s" + i}
                  x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                  stroke="#e08133" strokeOpacity={0.5} strokeWidth={1} vectorEffect="non-scaling-stroke"
                  initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: (i % 12) * 0.03 }}
                />
              ))}
              {/* state 3: clean spokes into the owned core */}
              {tab === 2 && NODES.map((n, i) => (
                <motion.line
                  key={"r" + i}
                  x1={n.x} y1={n.y} x2={CX} y2={CY}
                  stroke="#29abe2" strokeOpacity={0.6} strokeWidth={1} vectorEffect="non-scaling-stroke"
                  initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.55, delay: i * 0.045 }}
                />
              ))}
            </svg>

            {/* state 3: the owned core */}
            <AnimatePresence>
              {tab === 2 && (
                <motion.div
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: CX + "%", top: CY + "%" }}
                  initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mx-auto mb-2 block h-14 w-14 rotate-45 rounded-[10px] border-2 border-[var(--color-brand-400)] bg-[var(--color-brand-50)] shadow-[0_0_36px_rgba(41,171,226,.45)]" />
                  <span className="block font-[family-name:var(--font-display)] text-[0.95rem] font-bold tracking-wide text-[var(--color-ink)]">{t.centerTitle}</span>
                  <span className="mt-1 block text-[0.6rem] font-bold tracking-[0.12em] text-[var(--color-brand-600)]">{t.centerSub}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* the tools: identical positions in every state, only wiring changes */}
            {NODES.map((n, i) => (
              <div
                key={i}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: n.x + "%", top: n.y + "%" }}
              >
                <motion.span
                  animate={{ borderColor: accent + "99", color: "#0a1628" }}
                  transition={{ duration: 0.4 }}
                  className="block whitespace-nowrap rounded-lg border px-2.5 py-1 text-[0.62rem] font-semibold shadow-[var(--shadow-soft)] sm:text-[0.72rem]"
                  style={{ background: tab === 1 ? "rgba(224,129,51,.08)" : tab === 2 ? "rgba(41,171,226,.09)" : "#ffffff" }}
                >
                  {labels[i]}
                </motion.span>
                <AnimatePresence>
                  {tab === 2 && (
                    <motion.span
                      initial={reduce ? undefined : { opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, delay: 0.15 + i * 0.03 }}
                      className="mt-1 block whitespace-nowrap text-[0.42rem] font-bold tracking-[0.08em] text-[#0f9d63] sm:text-[0.5rem]"
                    >
                      {t.badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* running caption for the current state */}
            <AnimatePresence mode="wait">
              <motion.p
                key={tab}
                initial={reduce ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-x-4 bottom-3 text-center text-[0.7rem] font-semibold"
                style={{ color: accent }}
              >
                {state.note}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ---------------- narrative ---------------- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-2xl font-semibold md:text-[1.9rem]">{state.headline}</h3>
              <p className="mt-4 leading-relaxed text-[var(--color-slate)]">{state.body}</p>

              {state.pros && (
                <div className="mt-6">
                  <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#0f9d63]">{t.prosLabel}</p>
                  <ul className="space-y-1.5">
                    {state.pros.map((x) => (
                      <li key={x} className="flex gap-2.5 text-[0.95rem] text-[var(--color-ink-soft)]">
                        <span className="text-[#0f9d63]">+</span>{x}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {state.cons && (
                <div className="mt-5">
                  <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>{t.consLabel}</p>
                  <ul className="space-y-1.5">
                    {state.cons.map((x) => (
                      <li key={x} className="flex gap-2.5 text-[0.95rem] text-[var(--color-slate)]">
                        <span style={{ color: accent }}>&minus;</span>{x}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {state.punch && (
                <p
                  className="mt-6 border-l-2 pl-4 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]"
                  style={{ borderColor: accent }}
                >
                  {state.punch}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
