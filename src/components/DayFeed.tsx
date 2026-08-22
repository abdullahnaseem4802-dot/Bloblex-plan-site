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
const CARD_W = 15;          // card width, as a % of the rail
const CARD_GAP = 17;        // smallest allowed distance between two card centres
const YOURS_ROOM = 2.4;     // see layout(): how much wider the gaps beside a card are

/** Where each job sits along the rail, as a % of its width.
 *
 *  The jobs sit at a rhythm rather than at true clock positions: a real day is
 *  bunched into the morning, which reads as a pile-up rather than as a day. The
 *  clock times still ride on the cards, so nothing is misstated.
 *
 *  The rhythm is not quite even, though. A flat one puts the three marks that
 *  carry cards 12% and 25% apart, and a card is 15% wide - so the first two
 *  cards had nowhere to stand without either touching each other or sliding off
 *  their own mark and dragging a crooked leader line behind them. The gaps on
 *  either side of a card-carrying job are simply made wider, which buys the row
 *  its elbow room out of the fourteen places where nobody is looking. */
function layout(jobs: { by: string }[]): number[] {
  const weights = jobs.slice(1).map((_, k) => {
    /* the gap between job k and job k+1 */
    const beside = jobs[k].by === "you" || jobs[k + 1].by === "you";
    return beside ? YOURS_ROOM : 1;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  const span = 100 - RAIL_PAD * 2;
  const out = [RAIL_PAD];
  weights.forEach((w) => out.push(out[out.length - 1] + (span * w) / total));
  return out;
}

/** Where the three cards sit, in % of the rail.
 *
 *  These were pinned at 14 / 50 / 86 once - spread evenly for the look of it,
 *  with no relation to the marks they point at - and every leader line had to
 *  cross a hundred-odd pixels sideways to reach its dot: three near-horizontal
 *  streaks that read as stray rules rather than as anything joining a card to a
 *  mark.
 *
 *  Each card wants to stand directly over its own mark, and is pushed aside
 *  only if it would touch its neighbour or run off an end. With the rhythm
 *  above none of them has to be, so all three leaders come out as the same
 *  plain vertical drop - which is the point: three lines of three different
 *  shapes looks like a mistake, however correct each one is. */
function cardSlots(marks: number[]): number[] {
  const half = CARD_W / 2;
  const out = marks.slice();
  for (let i = 0; i < out.length; i++) {
    out[i] = Math.max(out[i], i === 0 ? half : out[i - 1] + CARD_GAP);
  }
  for (let i = out.length - 1; i >= 0; i--) {
    const ceiling = i === out.length - 1 ? 100 - half : out[i + 1] - CARD_GAP;
    out[i] = Math.min(out[i], ceiling);
  }
  /* if the row simply does not fit, the left clamp wins over the right one */
  return out.map((v, i) => Math.max(v, i === 0 ? half : out[i - 1] + CARD_GAP));
}

type Marked = DayJob & { i: number };

export default function DayFeed({ locale }: { locale: Locale }) {
  const t = DAY_UI[locale];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  /* 0.3 fired while the panel was still clipping the bottom of the screen,
     so the whole entrance was over before it was in front of anyone. */
  const live = useInView(ref, { once: true, amount: 0.55 });
  const onScreen = useInView(ref, { amount: 0.05 });
  const idle = onScreen && live && !reduce;   // never animates to an empty room
  const pos = useMemo(() => layout(DAY_JOBS), []);

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
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(41,171,226,.2),transparent_68%)]"
              animate={idle ? { scale: [1, 1.07, 1], opacity: [0.85, 1, 0.85] } : { scale: 1, opacity: 1 }}
              transition={idle ? { duration: 11, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
            />

            <div className="relative">
              <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
                <Score n={JOBS_AUTO} label={t.autoLabel} live={live} reduce={!!reduce} big />
                <span aria-hidden className="hidden h-12 w-px bg-white/12 sm:block" />
                <Score n={JOBS_YOURS} label={t.yoursLabel} live={live} reduce={!!reduce} />
              </div>

              {/* wide screens: the day, drawn */}
              <div className="mt-12 hidden lg:block">
                <Rail t={t} pos={pos} yours={yours} auto={auto} live={live} reduce={!!reduce} idle={idle} at={at} locale={locale} />
              </div>

              {/* narrow screens: the same story, stacked */}
              <div className="mt-9 lg:hidden">
                <Stacked t={t} marked={marked} live={live} reduce={!!reduce} visible={idle} locale={locale} />
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
  t, pos, yours, auto, live, reduce, idle, at, locale,
}: {
  t: (typeof DAY_UI)["en"]; pos: number[]; yours: Marked[]; auto: Marked[];
  live: boolean; reduce: boolean; idle: boolean; at: (i: number) => number; locale: Locale;
}) {
  const slots = cardSlots(yours.map((j) => pos[j.i]));

  return (
    <div className="relative h-[20.2rem] select-none">
      <span className="absolute left-0 top-0 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-300)]">
        {t.yoursHeading}
      </span>

      {/* The three that are yours, bottom-aligned so the row reads as a row.
          15% wide against a 19.3% pitch leaves a real gutter between them - at
          17% against the old 12.5% pitch they were shoulder to shoulder, and
          two of the three had been shoved off their own mark to fit.

          They do not drift. A card on the end of a leader line that breathes up
          and down opens and closes the gap where the line meets it, which is
          most of what made the joins look broken. Their movement is a slow
          sheen crossing the glass instead, which moves nothing. */}
      <div className="absolute inset-x-0 top-[1.5rem] h-[8.6rem]">
        {yours.map((j, k) => (
          <motion.div
            key={"y" + j.i}
            /* fixed height, not auto: "You approve prices" wraps to two lines
               where the other two labels do not, and a bottom-aligned row of
               cards with one of them standing a line taller reads as a card
               out of place rather than as a longer sentence */
            className="bx-glint absolute bottom-0 flex h-[7rem] w-[15%] -translate-x-1/2 flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--color-brand-400)]/45 bg-white/[0.07] p-3.5 shadow-[0_18px_44px_-18px_rgba(41,171,226,.85)] backdrop-blur-sm"
            /* the ::after sheen reads this delay through `animation-delay:
               inherit`, so the three cards catch the light one after another */
            style={{ left: `${slots[k]}%`, animationDelay: `${k * 2.6}s` }}
            initial={reduce ? false : { opacity: 0, y: 22, scale: 0.9 }}
            animate={live || reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 230, damping: 20, delay: at(j.i) }}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[var(--color-brand-400)] text-white shadow-[0_0_16px_-2px_rgba(69,189,236,.9)]">
                <Icon name={j.icon} />
              </span>
              <span className="text-[0.56rem] font-bold tracking-[0.16em] text-[var(--color-brand-300)]">{t.you}</span>
            </div>
            <p className="mt-2 flex-1 text-[0.86rem] font-semibold leading-snug text-white">{j.label[locale]}</p>
            <p className="font-mono text-[0.64rem] text-white/40">{j.at}</p>
          </motion.div>
        ))}
      </div>

      {/* Each card reaches down to its own moment in the day.
          All three are now the same plain vertical drop. They were not before:
          the cards that had been pushed off their mark dragged a curve behind
          them, so the middle one looked like a different kind of line to the
          other two, which reads as a mistake however correct it is.
          A light runs down each one on a loop, so the connection is something
          you watch rather than something you have to trace. */}
      <svg
        className="absolute inset-x-0 top-[10.1rem] h-[3.6rem] w-full overflow-visible"
        viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
      >
        {yours.map((j, k) => {
          const d = `M ${slots[k]} 0 C ${slots[k]} 46, ${pos[j.i]} 54, ${pos[j.i]} 100`;
          return (
            <g key={"l" + j.i}>
              <motion.path
                d={d}
                fill="none" stroke="var(--color-brand-300)" strokeWidth="1.5"
                strokeLinecap="round" strokeOpacity={0.55}
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={live || reduce ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.5, delay: at(j.i) + 0.1, ease: "easeOut" }}
              />
              {idle && (
                <motion.path
                  d={d} pathLength={100}
                  fill="none" stroke="#ffffff" strokeWidth="2"
                  strokeLinecap="round" strokeDasharray="14 86"
                  vectorEffect="non-scaling-stroke"
                  initial={{ strokeDashoffset: 100, opacity: 0 }}
                  animate={{ strokeDashoffset: [100, -14], opacity: [0, 0.9, 0.9, 0] }}
                  transition={{
                    duration: 1.5, repeat: Infinity, repeatDelay: 2.6,
                    delay: k * 0.45, ease: "easeInOut", times: [0, 0.15, 0.8, 1],
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* the rail: the day, lit as it goes */}
      <div className="absolute inset-x-0 top-[13.7rem] h-px bg-white/12" />
      <motion.div
        className="absolute inset-x-0 top-[13.65rem] h-[2px] rounded-full bg-gradient-to-r from-[var(--color-brand-500)] via-[var(--color-brand-300)] to-[var(--color-brand-500)] shadow-[0_0_18px_rgba(69,189,236,.55)]"
        style={{ transformOrigin: "left" }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={live || reduce ? { scaleX: 1 } : undefined}
        transition={{ duration: reduce ? 0 : SWEEP + 0.25, ease: [0.33, 0, 0.15, 1], delay: 0.25 }}
      />
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute top-[13.7rem] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_22px_8px_rgba(69,189,236,.7)]"
          initial={{ left: "0%", opacity: 0 }}
          animate={live ? { left: "100%", opacity: [0, 1, 1, 0] } : undefined}
          transition={{ duration: SWEEP + 0.25, ease: [0.33, 0, 0.15, 1], delay: 0.25, times: [0, 0.06, 0.9, 1] }}
        />
      )}

      {/* long after the first sweep, a quiet light still walks the day */}
      {idle && (
        <motion.span
          aria-hidden
          className="absolute top-[13.7rem] z-[5] h-[3px] w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[1px]"
          initial={{ left: "-8%", opacity: 0 }}
          animate={{ left: "104%", opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut", times: [0, 0.1, 0.85, 1] }}
        />
      )}

      {/* Where the three land on the rail. A halo breathes out of each mark on
          its own beat, so the points the cards hang from are the live part of
          the picture rather than three static pinpricks. */}
      {yours.map((j, k) => (
        <span key={"p" + j.i} aria-hidden className="absolute top-[13.7rem] z-10" style={{ left: `${pos[j.i]}%` }}>
          {idle && (
            <motion.span
              className="absolute left-0 top-0 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-brand-300)]"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 2.9], opacity: [0.7, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.5, delay: k * 0.45, ease: "easeOut" }}
            />
          )}
          <motion.span
            className="relative block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-brand-300)] bg-[var(--color-ink)] shadow-[0_0_14px_rgba(69,189,236,.9)]"
            initial={reduce ? false : { scale: 0 }}
            animate={live || reduce ? { scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 420, damping: 15, delay: at(j.i) + 0.2 }}
          />
        </span>
      ))}

      {/* the hours, quietly */}
      <span className="absolute left-0 top-[14.3rem] font-mono text-[0.64rem] text-white/30">{t.dayStart}</span>
      <span className="absolute right-0 top-[14.3rem] font-mono text-[0.64rem] text-white/30">{t.dayEnd}</span>

      {/* the thirteen the system handles: icons only, nothing to read */}
      {auto.map((j) => (
        <motion.div
          key={"a" + j.i}
          className="group absolute top-[15.4rem] -translate-x-1/2"
          style={{ left: `${pos[j.i]}%` }}
          initial={reduce ? false : { opacity: 0, y: -8, scale: 0.6 }}
          animate={live || reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: at(j.i) }}
        >
          <span aria-hidden className="absolute bottom-full left-1/2 block h-[1.7rem] w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-brand-400)]/45 to-transparent" />
          <Float on={idle} amp={3.5} secs={4.4 + (j.i % 5) * 0.6} delay={(j.i % 7) * 0.42}>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-brand-400)]/35 xl:h-10 xl:w-10 bg-[var(--color-brand-400)]/[0.14] text-[var(--color-brand-200)] shadow-[0_0_16px_-4px_rgba(69,189,236,.55)] transition-colors duration-200 group-hover:border-[var(--color-brand-300)] group-hover:bg-[var(--color-brand-400)]/30">
              <Icon name={j.icon} />
            </span>
          </Float>
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

/* ================= narrow: the same rail, stood on end =================

   A phone used to get a different picture entirely: three cards in a list,
   then a five-across grid of thirteen icons underneath, with no rail, no
   order, and nothing joining the two halves. It answered the same question,
   but it did not look like the same answer.

   This is the wide rail turned a quarter turn. Same lit line, same three
   cards hanging off it on short arms, same thirteen icons standing on it,
   same order - the day still runs start to finish, it just runs downwards.
   Every effect the wide one has comes with it: the line lights as it goes,
   a light walks it long after, a halo breathes out of each mark, a spark
   runs down each arm, and a sheen crosses each card.

   The thirteen are grouped into their runs rather than given a row each. On
   the wide rail they already cluster into fours and threes between the
   marks, and sixteen rows down a phone is a very long way to say "the system
   did a pile of things while you were out". */
type Run = { kind: "auto"; jobs: Marked[] } | { kind: "you"; job: Marked };

function runs(jobs: Marked[]): Run[] {
  const out: Run[] = [];
  jobs.forEach((j) => {
    if (j.by === "you") { out.push({ kind: "you", job: j }); return; }
    const last = out[out.length - 1];
    if (last && last.kind === "auto") last.jobs.push(j);
    else out.push({ kind: "auto", jobs: [j] });
  });
  return out;
}

const RAIL_X = "1.35rem";   // where the vertical line lives, and every node centre
const ARM = "1.6rem";       // rail to card

function Stacked({
  t, marked, live, reduce, visible, locale,
}: {
  t: (typeof DAY_UI)["en"]; marked: Marked[];
  live: boolean; reduce: boolean; visible: boolean; locale: Locale;
}) {
  const rows = useMemo(() => runs(marked), [marked]);
  /* the line lights over the same 1.6s it takes on the wide rail */
  const at = (k: number) => (reduce ? 0 : 0.3 + (k / rows.length) * SWEEP);
  let seen = 0;   // "you" rows so far, so their halos beat out of step

  return (
    <div className="relative select-none">
      <p className="mb-3 font-mono text-[0.64rem] text-white/30" style={{ paddingLeft: `calc(${RAIL_X} + ${ARM})` }}>
        {t.dayStart}
      </p>

      <ol className="relative">
        {/* the day, unlit */}
        <span aria-hidden className="absolute bottom-3 top-3 w-px bg-white/12" style={{ left: RAIL_X }} />
        {/* the day, lit as it goes */}
        <motion.span
          aria-hidden
          className="absolute top-3 w-[2px] origin-top rounded-full bg-gradient-to-b from-[var(--color-brand-500)] via-[var(--color-brand-300)] to-[var(--color-brand-500)] shadow-[0_0_18px_rgba(69,189,236,.55)]"
          style={{ left: `calc(${RAIL_X} - 0.5px)`, height: "calc(100% - 1.5rem)" }}
          initial={reduce ? false : { scaleY: 0 }}
          animate={live || reduce ? { scaleY: 1 } : undefined}
          transition={{ duration: reduce ? 0 : SWEEP + 0.25, ease: [0.33, 0, 0.15, 1], delay: 0.3 }}
        />
        {/* and long after the first pass, a quiet light still walks it */}
        {visible && (
          <motion.span
            aria-hidden
            className="absolute z-[5] h-20 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-white/70 to-transparent blur-[1px]"
            style={{ left: RAIL_X }}
            initial={{ top: "-8%", opacity: 0 }}
            animate={{ top: "102%", opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut", times: [0, 0.1, 0.85, 1] }}
          />
        )}

        {rows.map((row, k) =>
          row.kind === "you" ? (
            <YouRow
              key={"y" + row.job.i} t={t} job={row.job} locale={locale}
              live={live} reduce={reduce} visible={visible}
              delay={at(k)} beat={seen++}
            />
          ) : (
            <AutoRow
              key={"a" + row.jobs[0].i} jobs={row.jobs} locale={locale}
              live={live} reduce={reduce} delay={at(k)}
            />
          )
        )}
      </ol>

      <p className="mt-3 font-mono text-[0.64rem] text-white/30" style={{ paddingLeft: `calc(${RAIL_X} + ${ARM})` }}>
        {t.dayEnd}
      </p>
    </div>
  );
}

/** One run of things the system did, standing on the rail. */
function AutoRow({
  jobs, locale, live, reduce, delay,
}: { jobs: Marked[]; locale: Locale; live: boolean; reduce: boolean; delay: number }) {
  return (
    <li className="relative flex flex-wrap items-center gap-2 py-2" style={{ paddingLeft: `calc(${RAIL_X} - 1.0625rem)` }}>
      {jobs.map((j, n) => (
        <motion.span
          key={j.i}
          title={j.label[locale]}
          className="grid h-[2.125rem] w-[2.125rem] shrink-0 place-items-center rounded-full border border-[var(--color-brand-400)]/35 bg-[var(--color-brand-400)]/[0.14] text-[var(--color-brand-200)] shadow-[0_0_16px_-4px_rgba(69,189,236,.55)]"
          initial={reduce ? false : { opacity: 0, scale: 0.55 }}
          animate={live || reduce ? { opacity: 1, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: delay + n * 0.06 }}
        >
          <Icon name={j.icon} />
        </motion.span>
      ))}
    </li>
  );
}

/** One of the three, hanging off the rail on a short arm. */
function YouRow({
  t, job, locale, live, reduce, visible, delay, beat,
}: {
  t: (typeof DAY_UI)["en"]; job: Marked; locale: Locale;
  live: boolean; reduce: boolean; visible: boolean; delay: number; beat: number;
}) {
  return (
    <li className="relative py-2.5" style={{ paddingLeft: `calc(${RAIL_X} + ${ARM})` }}>
      {/* the mark on the rail, breathing */}
      <span aria-hidden className="absolute top-1/2 z-10" style={{ left: RAIL_X }}>
        {visible && (
          <motion.span
            className="absolute left-0 top-0 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-brand-300)]"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2.9], opacity: [0.7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.5, delay: beat * 0.45, ease: "easeOut" }}
          />
        )}
        <motion.span
          className="relative block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-brand-300)] bg-[var(--color-ink)] shadow-[0_0_14px_rgba(69,189,236,.9)]"
          initial={reduce ? false : { scale: 0 }}
          animate={live || reduce ? { scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 420, damping: 15, delay: delay + 0.15 }}
        />
      </span>

      {/* the arm out to the card, with a spark running along it */}
      <span aria-hidden className="absolute top-1/2 h-px overflow-hidden" style={{ left: RAIL_X, width: ARM }}>
        <motion.span
          className="absolute inset-0 block origin-left bg-[var(--color-brand-300)]/55"
          initial={reduce ? false : { scaleX: 0 }}
          animate={live || reduce ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.4, delay: delay + 0.2, ease: "easeOut" }}
        />
        {visible && (
          <motion.span
            className="absolute top-0 block h-px w-2.5 bg-white"
            initial={{ left: "-40%", opacity: 0 }}
            animate={{ left: "110%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 3, delay: beat * 0.45, ease: "easeInOut", times: [0, 0.2, 0.75, 1] }}
          />
        )}
      </span>

      <motion.div
        className="bx-glint relative flex items-center gap-3 overflow-hidden rounded-[var(--radius)] border border-[var(--color-brand-400)]/45 bg-white/[0.07] p-3 shadow-[0_16px_36px_-20px_rgba(41,171,226,.9)] backdrop-blur-sm"
        style={{ animationDelay: `${beat * 2.6}s` }}
        initial={reduce ? false : { opacity: 0, x: 18 }}
        animate={live || reduce ? { opacity: 1, x: 0 } : undefined}
        transition={{ type: "spring", stiffness: 240, damping: 21, delay }}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-[var(--color-brand-400)] text-white shadow-[0_0_18px_-4px_rgba(69,189,236,.9)]">
          <Icon name={job.icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.92rem] font-semibold leading-snug text-white">{job.label[locale]}</span>
          <span className="block font-mono text-[0.64rem] text-white/40">{job.at}</span>
        </span>
        <span className="shrink-0 rounded-full bg-[var(--color-brand-400)]/20 px-2 py-[3px] text-[0.54rem] font-bold tracking-[0.14em] text-[var(--color-brand-200)]">
          {t.you}
        </span>
      </motion.div>
    </li>
  );
}

/** A very small, very slow rise and fall. Only while the panel is actually
 *  on screen, so nothing is animating to an empty room. */
function Float({
  on, amp, secs, delay, className, children,
}: { on: boolean; amp: number; secs: number; delay: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      animate={on ? { y: [0, -amp, 0] } : { y: 0 }}
      transition={on ? { duration: secs, repeat: Infinity, ease: "easeInOut", delay } : { duration: 0.4 }}
    >
      {children}
    </motion.div>
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
