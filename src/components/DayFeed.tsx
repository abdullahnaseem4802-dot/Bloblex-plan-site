"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { DAY_JOBS, JOBS_YOURS, JOBS_AUTO, DAY_UI, type IconKey, type DayJob } from "@/content/dayproof";

/* The brief was "a day, replayed". This is not that list: it is the day
   itself, drawn once. A lit rail sweeps from first coffee to end of day;
   the thirteen things the system handles tick past underneath it without
   asking for a single word of reading, and the three that are actually
   the owner's rise above the rail with their name on them.
   Read time: about a second, and no sentence in sight. */

const SWEEP = 1.6;          // seconds for the light to cross the whole day
const RAIL_PAD = 3;         // % kept clear at each end of the rail
const CARD_SLOTS = [14, 50, 86];  // where the three cards sit, spread on purpose

/** The jobs sit at an even rhythm rather than at true clock positions: a real
 *  day is bunched into the morning, which reads as a pile-up rather than as a
 *  day. The clock times still ride on the cards, so nothing is misstated. */
function layout(n: number) {
  const span = 100 - RAIL_PAD * 2;
  return Array.from({ length: n }, (_, i) => RAIL_PAD + (span * i) / (n - 1));
}

type Marked = DayJob & { i: number };

export default function DayFeed({ locale }: { locale: Locale }) {
  const t = DAY_UI[locale];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { once: true, amount: 0.3 });
  const pos = useMemo(() => layout(DAY_JOBS.length), []);

  /* each job wakes as the light reaches its own hour */
  const at = (i: number) => (reduce ? 0 : 0.25 + (pos[i] / 100) * SWEEP);

  const marked: Marked[] = DAY_JOBS.map((j, i) => ({ ...j, i }));
  const yours = marked.filter((j) => j.by === "you");
  const auto = marked.filter((j) => j.by === "system");

  return (
    <section id="day" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em]">
            {t.titleA} <span className="text-[var(--color-brand-600)]">{t.titleB}</span>
          </h2>
        </Reveal>

        <Reveal delay={90}>
          <div
            ref={ref}
            className="relative mt-9 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-ink)] px-5 py-9 text-white sm:px-8 md:px-12 md:py-12"
          >
            {/* light pooling behind the working part of the day */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(41,171,226,.2),transparent_68%)]" />

            <div className="relative">
              <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
                <Score n={JOBS_AUTO} label={t.autoLabel} live={live} reduce={!!reduce} big />
                <span aria-hidden className="hidden h-12 w-px bg-white/12 sm:block" />
                <Score n={JOBS_YOURS} label={t.yoursLabel} live={live} reduce={!!reduce} />
              </div>

              {/* wide screens: the day, drawn */}
              <div className="mt-12 hidden lg:block">
                <Rail t={t} pos={pos} yours={yours} auto={auto} live={live} reduce={!!reduce} at={at} locale={locale} />
              </div>

              {/* narrow screens: the same story, stacked */}
              <div className="mt-9 lg:hidden">
                <Stacked t={t} yours={yours} auto={auto} live={live} reduce={!!reduce} locale={locale} />
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 text-sm text-[var(--color-slate)]">{t.closing}</p>
      </div>
    </section>
  );
}

/* ================= the two numbers ================= */
function Score({ n, label, live, reduce, big }: { n: number; label: string; live: boolean; reduce: boolean; big?: boolean }) {
  const v = useCountUp(live ? n : 0, reduce);
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={live || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: big ? 0 : 0.12 }}
      className="flex items-baseline gap-3"
    >
      <span
        className={
          "font-[family-name:var(--font-display)] font-bold leading-none tabular-nums " +
          (big
            ? "text-[3.4rem] text-[var(--color-brand-300)] [text-shadow:0_0_34px_rgba(69,189,236,.45)] md:text-[4.4rem]"
            : "text-[2.4rem] text-white md:text-[3rem]")
        }
      >
        {v}
      </span>
      <span className={"text-[0.95rem] font-semibold " + (big ? "text-white/80" : "text-white/55")}>{label}</span>
    </motion.p>
  );
}

/** Always starts at zero, per the client's rule about numbers. */
function useCountUp(to: number, reduce: boolean, ms = 850) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce || to === 0) { setN(to); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms, reduce]);
  return n;
}

/* ================= wide: the lit rail =================
   The three cards sit at fixed, well-spread slots and reach down to their own
   mark on the rail with a drawn line. Annotating the day this way means the
   cards can never collide, however close together two of them happen to fall. */
function Rail({
  t, pos, yours, auto, live, reduce, at, locale,
}: {
  t: (typeof DAY_UI)["en"]; pos: number[]; yours: Marked[]; auto: Marked[];
  live: boolean; reduce: boolean; at: (i: number) => number; locale: Locale;
}) {
  return (
    <div className="relative h-[18.6rem] select-none">
      <span className="absolute left-0 top-0 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-300)]">
        {t.yoursHeading}
      </span>

      {/* the three that are yours, bottom-aligned so the row reads as a row */}
      <div className="absolute inset-x-0 top-[1.7rem] h-[8rem]">
        {yours.map((j, k) => (
          <motion.div
            key={"y" + j.i}
            className="absolute bottom-0 w-[11.5rem] -translate-x-1/2"
            style={{ left: `${CARD_SLOTS[k]}%` }}
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.92 }}
            animate={live || reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 250, damping: 21, delay: at(j.i) }}
          >
            <div className="rounded-[var(--radius)] border border-[var(--color-brand-400)]/45 bg-white/[0.07] p-3.5 shadow-[0_18px_44px_-18px_rgba(41,171,226,.85)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[var(--color-brand-400)] text-white">
                  <Icon name={j.icon} />
                </span>
                <span className="text-[0.56rem] font-bold tracking-[0.16em] text-[var(--color-brand-300)]">{t.you}</span>
              </div>
              <p className="mt-2.5 text-[0.9rem] font-semibold leading-snug text-white">{j.label[locale]}</p>
              <p className="mt-0.5 font-mono text-[0.64rem] text-white/40">{j.at}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* each card reaches down to its own moment in the day */}
      <svg
        className="absolute inset-x-0 top-[9.7rem] h-[2.2rem] w-full overflow-visible"
        viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
      >
        {yours.map((j, k) => (
          <motion.path
            key={"l" + j.i}
            d={`M ${CARD_SLOTS[k]} 0 L ${CARD_SLOTS[k]} 34 L ${pos[j.i]} 66 L ${pos[j.i]} 100`}
            fill="none" stroke="var(--color-brand-400)" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={live || reduce ? { pathLength: 1, opacity: 0.85 } : undefined}
            transition={{ duration: 0.45, delay: at(j.i) + 0.1, ease: "easeOut" }}
          />
        ))}
      </svg>

      {/* the rail: the day, lit as it goes */}
      <div className="absolute inset-x-0 top-[11.9rem] h-px bg-white/12" />
      <motion.div
        className="absolute inset-x-0 top-[11.85rem] h-[2px] rounded-full bg-gradient-to-r from-[var(--color-brand-500)] via-[var(--color-brand-300)] to-[var(--color-brand-500)] shadow-[0_0_18px_rgba(69,189,236,.55)]"
        style={{ transformOrigin: "left" }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={live || reduce ? { scaleX: 1 } : undefined}
        transition={{ duration: reduce ? 0 : SWEEP + 0.25, ease: [0.33, 0, 0.15, 1], delay: 0.25 }}
      />
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute top-[11.9rem] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_22px_8px_rgba(69,189,236,.7)]"
          initial={{ left: "0%", opacity: 0 }}
          animate={live ? { left: "100%", opacity: [0, 1, 1, 0] } : undefined}
          transition={{ duration: SWEEP + 0.25, ease: [0.33, 0, 0.15, 1], delay: 0.25, times: [0, 0.06, 0.9, 1] }}
        />
      )}

      {/* where the three land on the rail */}
      {yours.map((j) => (
        <motion.span
          key={"p" + j.i}
          aria-hidden
          className="absolute top-[11.9rem] z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-brand-300)] bg-[var(--color-ink)] shadow-[0_0_14px_rgba(69,189,236,.9)]"
          style={{ left: `${pos[j.i]}%` }}
          initial={reduce ? false : { scale: 0 }}
          animate={live || reduce ? { scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 420, damping: 15, delay: at(j.i) + 0.2 }}
        />
      ))}

      {/* the hours, quietly */}
      <span className="absolute left-0 top-[12.5rem] font-mono text-[0.64rem] text-white/30">{t.dayStart}</span>
      <span className="absolute right-0 top-[12.5rem] font-mono text-[0.64rem] text-white/30">{t.dayEnd}</span>

      {/* the thirteen the system handles: icons only, nothing to read */}
      {auto.map((j) => (
        <motion.div
          key={"a" + j.i}
          className="group absolute top-[13.6rem] -translate-x-1/2"
          style={{ left: `${pos[j.i]}%` }}
          initial={reduce ? false : { opacity: 0, y: -8, scale: 0.6 }}
          animate={live || reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: at(j.i) }}
        >
          <span aria-hidden className="absolute bottom-full left-1/2 block h-[1.7rem] w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-brand-400)]/45 to-transparent" />
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-brand-400)]/35 bg-[var(--color-brand-400)]/[0.14] text-[var(--color-brand-200)] shadow-[0_0_16px_-4px_rgba(69,189,236,.55)] transition-colors duration-200 group-hover:border-[var(--color-brand-300)] group-hover:bg-[var(--color-brand-400)]/30">
            <Icon name={j.icon} />
          </span>
          {/* the word is there for whoever wants it, never required */}
          <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-max max-w-[9rem] -translate-x-1/2 rounded-md bg-white/10 px-2 py-1 text-center text-[0.68rem] font-medium text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            {j.label[locale]}
          </span>
        </motion.div>
      ))}

      <motion.span
        className="absolute bottom-0 left-0 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/60"
        initial={reduce ? false : { opacity: 0 }}
        animate={live || reduce ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: reduce ? 0 : SWEEP }}
      >
        {t.autoHeading}
      </motion.span>
    </div>
  );
}

/* ================= narrow: the same story, stacked ================= */
function Stacked({
  t, yours, auto, live, reduce, locale,
}: {
  t: (typeof DAY_UI)["en"]; yours: Marked[]; auto: Marked[];
  live: boolean; reduce: boolean; locale: Locale;
}) {
  return (
    <div>
      <p className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-300)]">{t.yoursHeading}</p>
      <ul className="grid gap-2.5 sm:grid-cols-3">
        {yours.map((j, k) => (
          <motion.li
            key={"y" + j.i}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={live || reduce ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.45, delay: reduce ? 0 : k * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--color-brand-400)]/45 bg-white/[0.07] p-3.5 shadow-[0_16px_36px_-20px_rgba(41,171,226,.9)]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[var(--color-brand-400)] text-white">
              <Icon name={j.icon} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.9rem] font-semibold leading-snug text-white">{j.label[locale]}</span>
              <span className="block font-mono text-[0.64rem] text-white/40">{j.at}</span>
            </span>
          </motion.li>
        ))}
      </ul>

      <p className="mb-3 mt-8 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/35">{t.autoHeading}</p>
      <ul className="flex flex-wrap gap-2">
        {auto.map((j, k) => (
          <motion.li
            key={"a" + j.i}
            initial={reduce ? false : { opacity: 0, scale: 0.7 }}
            animate={live || reduce ? { opacity: 1, scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 360, damping: 20, delay: reduce ? 0 : 0.4 + k * 0.05 }}
            className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] py-1.5 pl-2 pr-3.5"
          >
            <span className="text-[var(--color-brand-300)]"><Icon name={j.icon} /></span>
            <span className="text-[0.76rem] font-medium text-white/70">{j.label[locale]}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ================= plain line icons ================= */
function Icon({ name }: { name: IconKey }) {
  const p = {
    fill: "none", stroke: "currentColor", strokeWidth: 1.7,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" aria-hidden="true">
      {name === "phone" && <path {...p} d="M5 3h3l2 5-2.2 1.3a12 12 0 0 0 6.9 6.9L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />}
      {name === "photo" && <>
        <rect {...p} x="3" y="5" width="18" height="14" rx="2" />
        <circle {...p} cx="8.5" cy="10" r="1.5" />
        <path {...p} d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" />
      </>}
      {name === "ruler" && <>
        <path {...p} d="m3 16 13-13 5 5-13 13z" />
        <path {...p} d="M7 12l2 2M10 9l2 2M13 6l2 2" />
      </>}
      {name === "calc" && <>
        <rect {...p} x="4" y="3" width="16" height="18" rx="2" />
        <path {...p} d="M8 7h8M8 12h2m3 0h3M8 16h2m3 0h3" />
      </>}
      {name === "check" && <>
        <circle {...p} cx="12" cy="12" r="9" />
        <path {...p} d="m8 12.3 2.7 2.7L16 9.5" />
      </>}
      {name === "doc" && <>
        <path {...p} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path {...p} d="M14 3v5h5M9 13h6M9 17h4" />
      </>}
      {name === "send" && <path {...p} d="M21 3 3 10.5l7 2.5 2.5 7z M10 13 21 3" />}
      {name === "mail" && <>
        <rect {...p} x="3" y="5" width="18" height="14" rx="2" />
        <path {...p} d="m3.5 7 8.5 6 8.5-6" />
      </>}
      {name === "eye" && <>
        <path {...p} d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
        <circle {...p} cx="12" cy="12" r="2.6" />
      </>}
      {name === "tag" && <>
        <path {...p} d="M3 12V4h8l10 10-8 8z" />
        <circle {...p} cx="7.5" cy="7.5" r="1.3" />
      </>}
      {name === "pen" && <path {...p} d="M4 20h4L20 8a2.8 2.8 0 0 0-4-4L4 16z M14 6l4 4" />}
      {name === "clip" && <>
        <rect {...p} x="5" y="4" width="14" height="17" rx="2" />
        <path {...p} d="M9 4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v1.5H9z M9 12h6M9 16h4" />
      </>}
      {name === "receipt" && <>
        <path {...p} d="M5 3h14v18l-2.3-1.6-2.4 1.6-2.3-1.6L9.7 21l-2.4-1.6L5 21z" />
        <path {...p} d="M9 8h6M9 12h6" />
      </>}
      {name === "clock" && <>
        <circle {...p} cx="12" cy="12" r="9" />
        <path {...p} d="M12 7v5.3l3.3 2" />
      </>}
      {name === "chart" && <>
        <path {...p} d="M4 20V4M4 20h16" />
        <path {...p} d="m7.5 15 3.5-4 3 2.6 4.5-6" />
      </>}
    </svg>
  );
}
