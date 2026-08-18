"use client";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { ChartFrame } from "./ChartFrame";
import { type Locale } from "@/content/site";
import { SCALE_UI } from "@/content/extras";

/* The "Second Page" comparison graphs from whiteboard folder 1:
   more clients → more admin work / less time WITHOUT a system, flat + rising capacity WITH one. */
function Chart({
  lines, yLabel, xLabel, reduce,
}: {
  /* label/lx/ly draw the series name right on the curve, because people scan */
  lines: { d: string; color: string; dash?: boolean; delay?: number; label?: string; lx?: number; ly?: number }[];
  yLabel: string; xLabel: string; reduce: boolean | null;
}) {
  return (
    <svg viewBox="0 0 360 240" className="w-full h-auto" aria-hidden>
      <ChartFrame yLabel={yLabel} xLabel={xLabel} />
      {lines.map((l, i) => (
        <motion.path
          key={i} d={l.d} fill="none" stroke={l.color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={l.dash ? "7 8" : undefined}
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: l.delay ?? 0 }}
        />
      ))}
      {lines.map((l, i) =>
        l.label ? (
          <text
            key={"t" + i}
            x={l.lx} y={l.ly}
            textAnchor="end"
            fontSize="12"
            fontWeight="700"
            fill={l.color}
          >
            {l.label}
          </text>
        ) : null
      )}
    </svg>
  );
}

function Legend({ items }: { items: { color: string; label: string; dash?: boolean }[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink-soft)]">
          <span className="inline-block h-1 w-5 rounded-full" style={{ background: it.dash ? undefined : it.color, borderTop: it.dash ? `3px dashed ${it.color}` : undefined }} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

export default function ScaleGraph({ locale }: { locale: Locale }) {
  const t = SCALE_UI[locale];
  const reduce = useReducedMotion();
  const RED = "#e0554e", SLATE = "#8a94a8", BLUE = "#29abe2", GREEN = "#22b07d";

  return (
    <section id="scale" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{t.title}</h2>
          <p className="mt-5 text-lg text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal>
            <figure className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <figcaption className="mb-2 font-semibold text-[var(--color-ink)]">{t.panelA}</figcaption>
              <Chart reduce={reduce} yLabel={t.yAxis} xLabel={t.xAxis}
                lines={[
                  { d: "M54 182 C150 174 235 96 330 40", color: RED, label: t.workShort, lx: 326, ly: 32 },
                  { d: "M54 52 C150 76 240 160 330 180", color: SLATE, dash: true, delay: 0.2, label: t.timeShort, ly: 172, lx: 326 },
                ]} />
              <Legend items={[{ color: RED, label: t.work }, { color: SLATE, label: t.time, dash: true }]} />
            </figure>
          </Reveal>

          <Reveal delay={120}>
            <figure className="h-full rounded-[var(--radius-lg)] border-2 border-[var(--color-brand-300)] bg-[var(--color-brand-50)]/40 p-6 shadow-[var(--shadow-soft)]">
              <figcaption className="mb-2 font-semibold text-[var(--color-brand-800)]">{t.panelB}</figcaption>
              <Chart reduce={reduce} yLabel={t.yAxis} xLabel={t.xAxis}
                lines={[
                  { d: "M54 156 C150 154 240 151 330 148", color: BLUE, label: t.workShort, lx: 326, ly: 166 },
                  { d: "M54 164 C150 138 240 98 330 50", color: GREEN, delay: 0.2, label: t.capacityShort, lx: 326, ly: 42 },
                ]} />
              <Legend items={[{ color: BLUE, label: t.work }, { color: GREEN, label: t.capacity }]} />
            </figure>
          </Reveal>
        </div>
        <p className="mt-5 text-sm text-[var(--color-mute)]">{t.note}</p>
      </div>
    </section>
  );
}
