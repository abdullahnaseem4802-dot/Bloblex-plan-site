"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import { useScrub, useScrubValue, stagger, ease } from "@/lib/scrub";
import { CONTENT, type Locale } from "@/content/site";

const BRAND = "#29abe2";
const INK = "#0a1628";

/* The process used to be six cards with a single word on each, which told a
   visitor nothing. Each step now says what actually happens and what the
   client walks away with, and the step where the price stops moving is called
   out, because that is the part they care about.
   The spine draws itself as the section is scrolled: no controls, and the pace
   belongs to whoever is reading. */
export default function ProcessSpine({ locale, bare }: { locale: Locale; bare?: boolean }) {
  const t = CONTENT[locale].process;
  const ref = useRef<HTMLDivElement>(null);
  const scrub = useScrub(ref, ["start 92%", "end 58%"]);
  const p = useScrubValue(scrub);
  const n = t.steps.length;

  return (
    <section id="process" className={`border-y border-[var(--color-line)] bg-[var(--color-panel)] ${bare ? "pt-16 pb-20 md:pt-20 md:pb-28" : "py-20 md:py-28"}`}>
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[3rem]">{t.title}</h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <div ref={ref} className="relative mt-12">
          {/* the spine */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--color-line)] md:left-0 md:right-0 md:top-[27px] md:bottom-auto md:h-px md:w-auto" />
          {/* progress along the spine: a separate element per orientation, because
              one shared element needs an inline height on phones that would then
              override the horizontal rule on wider screens */}
          <motion.div
            className="absolute left-[19px] top-2 w-px origin-top md:hidden"
            style={{ background: BRAND, height: "calc(100% - 1rem)", scaleY: p }}
          />
          <motion.div
            className="absolute left-0 top-[27px] hidden h-px w-full origin-left md:block"
            style={{ background: BRAND, scaleX: p }}
          />

          <ol className="relative grid gap-8 md:grid-cols-6 md:gap-4">
            {t.steps.map((s, i) => {
              const a = ease(stagger(p, i, n, 1.7));
              const locked = i === t.lockAt;
              return (
                <li key={s.name} className="relative flex gap-4 md:block">
                  {/* node */}
                  <motion.span
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-sm font-bold"
                    style={{
                      background: a > 0.15 ? (locked ? BRAND : INK) : "#ffffff",
                      color: a > 0.15 ? "#fff" : "var(--color-mute)",
                      border: a > 0.15 ? "none" : "1px solid var(--color-line)",
                      boxShadow: a > 0.15 ? `0 12px 28px -14px ${locked ? BRAND : INK}` : "none",
                      scale: 0.86 + a * 0.14,
                    }}
                  >
                    {i + 1}
                  </motion.span>

                  <motion.div
                    className="pb-2 md:mt-5"
                    style={{ opacity: 0.25 + a * 0.75, y: (1 - a) * 10 }}
                  >
                    <p className="font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{s.name}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-slate)]">{s.what}</p>
                    <p className="mt-2.5 flex items-start gap-1.5 text-[0.78rem] font-semibold text-[var(--color-brand-700)]">
                      <span aria-hidden="true">→</span>
                      <span>{s.get}</span>
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ol>

          {/* the moment the number stops moving */}
          <motion.p
            className="mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em]"
            style={{
              borderColor: `${BRAND}66`,
              background: "#fff",
              color: BRAND,
              opacity: ease(stagger(p, t.lockAt, n, 1.7)),
            }}
          >
            <span aria-hidden="true">🔒</span>
            {t.lockLabel}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
