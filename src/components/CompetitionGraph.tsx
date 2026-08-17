"use client";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { ChartFrame } from "./ChartFrame";
import { type Locale } from "@/content/site";
import { COMPETITION_UI } from "@/content/extras";

export default function CompetitionGraph({ locale }: { locale: Locale }) {
  const ui = COMPETITION_UI[locale];
  const reduce = useReducedMotion();

  return (
    <section id="competition" className="py-20 md:py-28 bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{ui.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{ui.title}</h2>
          <p className="mt-5 text-lg text-[var(--color-slate)]">{ui.lead}</p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-3 font-semibold text-[var(--color-ink)]">
              <span className="h-3 w-3 rounded-full bg-[#e0554e]" /> {ui.themLabel}
            </li>
            <li className="flex items-center gap-3 font-semibold text-[var(--color-ink)]">
              <span className="h-3 w-3 rounded-full bg-[var(--color-brand-500)]" /> {ui.usLabel}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <figure className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <svg viewBox="0 0 360 240" className="w-full h-auto" role="img" aria-label={`${ui.themLabel} vs ${ui.usLabel}`}>
              <ChartFrame yLabel={ui.yAxis} xLabel={`${ui.xAxis} →`} />
              {/* them, rising steeply */}
              <motion.path
                d="M54 182 C150 172 235 100 330 40" fill="none" stroke="#e0554e" strokeWidth="4" strokeLinecap="round"
                initial={reduce ? undefined : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              {/* us, flat */}
              <motion.path
                d="M54 150 C150 149 240 148 330 146" fill="none" stroke="#29abe2" strokeWidth="4" strokeLinecap="round"
                initial={reduce ? undefined : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeInOut", delay: 0.2 }}
              />
              <text x="326" y="34" textAnchor="end" fontSize="11" fill="#e0554e" fontWeight="700">$ ↑↑</text>
              <text x="326" y="140" textAnchor="end" fontSize="11" fill="#1787c4" fontWeight="700">$ =</text>
            </svg>
            <figcaption className="mt-4 text-sm text-[var(--color-slate)]">{ui.note}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
