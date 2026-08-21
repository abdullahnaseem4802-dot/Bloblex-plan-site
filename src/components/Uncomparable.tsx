"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import Parallax from "./Parallax";
import { type Locale } from "@/content/site";
import { UNCOMPARABLE_UI } from "@/content/extras";

/* What Blobex typically comes in at against an agency quote. Deliberately one
   number in one place: if the client wants to claim more or less, this is the
   only line to change. */
const BEAT = 0.8;

/** Counts from zero to `to` whenever the target moves. The client's rule is
 *  that a number never starts anywhere but zero. */
function useCountUp(to: number, ms = 900) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const from = useRef(0);
  const latest = useRef(0);
  latest.current = n;

  useEffect(() => {
    if (reduce) { setN(to); return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      setN(a + (to - a) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); from.current = latest.current; };
  }, [to, ms, reduce]);

  return n;
}

export default function Uncomparable({ locale }: { locale: Locale }) {
  const ui = UNCOMPARABLE_UI[locale];
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [raw, setRaw] = useState("");
  const contactHref = locale === "en" ? "#contact" : "/fr#contact";

  const money = (v: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-CA" : "fr-CA", {
      style: "currency", currency: "CAD", maximumFractionDigits: 0,
    }).format(Math.round(v));

  /* whatever they type, read the number out of it */
  const theirs = Number(raw.replace(/[^\d]/g, "")) || 0;
  const live = theirs >= 500;
  const ours = live ? Math.round((theirs * BEAT) / 100) * 100 : 0;
  const saving = live ? theirs - ours : 0;

  const oursNow = useCountUp(ours);
  const savingNow = useCountUp(saving);

  return (
    <section id="uncomparable" className="py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-ink)] px-8 py-14 md:px-14 md:py-20 text-white">
            <Parallax speed={26} className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72">
              <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.4),transparent_65%)]" />
            </Parallax>
            <div className="absolute right-6 top-6 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-brand-300)]">{ui.kicker}</div>

            <div className="relative max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-semibold text-white">{ui.title}</h2>
              <p className="mt-5 text-lg text-white/80">{ui.lead}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {ui.points.map((p) => (
                  <span key={p} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold">✓ {p}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  aria-label={ui.placeholder}
                  placeholder={ui.placeholder}
                  inputMode="numeric"
                  value={raw}
                  onChange={(e) => { setRaw(e.target.value); setRevealed(false); }}
                  className="flex-1 rounded-[var(--radius)] border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-[var(--color-brand-400)]"
                />
                <button onClick={() => setRevealed(true)} className="btn-primary justify-center whitespace-nowrap">{ui.button}</button>
              </div>

              {/* the meter: their number against ours, the moment they type it */}
              <AnimatePresence>
                {live && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-7 rounded-[var(--radius-lg)] border border-white/12 bg-white/[0.06] p-5 md:p-6"
                  >
                    <Bar label={ui.theirs} value={money(theirs)} pct={100} tone="rgba(255,255,255,.35)" reduce={!!reduce} />
                    <div className="mt-5">
                      <Bar label={ui.ours} value={money(oursNow)} pct={BEAT * 100} tone="var(--color-brand-400)" glow reduce={!!reduce} />
                    </div>

                    <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-white/10 pt-5">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-300)]">{ui.saving}</span>
                      <span className="font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums text-white md:text-[2.4rem]">
                        {money(savingNow)}
                      </span>
                    </div>

                    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Row term={ui.scope} theirs="—" ours={ui.scopeValue} />
                      <Row term={ui.timeline} theirs={ui.timelineTheirs} ours={ui.timelineOurs} />
                    </dl>

                    <p className="mt-5 text-[0.78rem] leading-relaxed text-white/45">{ui.note}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {revealed && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex flex-wrap items-center gap-4 rounded-[var(--radius)] bg-white/10 px-5 py-4">
                  <p className="text-white/90 font-medium">{ui.done}</p>
                  <a href={contactHref} className="btn-primary">{ui.cta}</a>
                </motion.div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Bar({
  label, value, pct, tone, glow, reduce,
}: { label: string; value: string; pct: number; tone: string; glow?: boolean; reduce: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/50">{label}</span>
        <span className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums text-white md:text-xl">{value}</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: tone, boxShadow: glow ? "0 0 22px rgba(69,189,236,.75)" : undefined }}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 110, damping: 20 }}
        />
      </div>
    </div>
  );
}

function Row({ term, theirs, ours }: { term: string; theirs: string; ours: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-white/10 bg-white/[0.04] px-4 py-3">
      <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/40">{term}</dt>
      <dd className="mt-1 text-sm text-white/45 line-through decoration-white/25">{theirs}</dd>
      <dd className="mt-0.5 text-sm font-semibold text-white">{ours}</dd>
    </div>
  );
}
