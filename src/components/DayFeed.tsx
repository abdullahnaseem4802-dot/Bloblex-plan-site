"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import {
  DAY_JOBS, JOBS_YOURS, JOBS_AUTO, DAY_UI, type IconKey,
} from "@/content/dayproof";

/** A whole day as sixteen tiles. Thirteen tick themselves off; the three the
 *  owner touches are dark and sit proud of the rest, so the point lands on a
 *  glance without reading a single sentence. Nothing moves until the board is
 *  actually in front of the visitor, and it plays once. */
export default function DayFeed({ locale }: { locale: Locale }) {
  const t = DAY_UI[locale];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section id="day" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em]">
            {t.titleA} <span className="text-[var(--color-brand-600)]">{t.titleB}</span>
          </h2>
        </Reveal>

        <div ref={ref} className="mt-9">
          {/* the two numbers, big enough to read from across the room */}
          <div className="mb-7 grid gap-3 sm:grid-cols-2 sm:gap-5">
            <Score n={JOBS_AUTO} label={t.autoLabel} live={live} reduce={!!reduce} tone="brand" />
            <Score n={JOBS_YOURS} label={t.yoursLabel} live={live} reduce={!!reduce} tone="ink" />
          </div>

          {/* the board */}
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {DAY_JOBS.map((job, i) => {
              const mine = job.by === "you";
              return (
                <motion.li
                  key={job.at + i}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
                  animate={live || reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
                  transition={{ duration: 0.42, delay: reduce ? 0 : i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={
                    "relative flex min-h-[7.25rem] flex-col justify-between rounded-[var(--radius)] border p-3.5 sm:p-4 " +
                    (mine
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-[0_14px_30px_-14px_rgba(10,22,40,.7)] ring-2 ring-[var(--color-brand-400)]/35"
                      : "border-[var(--color-line)] bg-white text-[var(--color-ink)] shadow-[var(--shadow-card)]")
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={
                        "grid h-9 w-9 shrink-0 place-items-center rounded-[10px] " +
                        (mine ? "bg-white/12 text-[var(--color-brand-300)]" : "bg-[var(--color-brand-50)] text-[var(--color-brand-600)]")
                      }
                    >
                      <Icon name={job.icon} />
                    </span>
                    <Stamp mine={mine} live={live} reduce={!!reduce} delay={i * 0.05 + 0.3} label={mine ? t.you : t.system} />
                  </div>

                  <div className="mt-3">
                    <p className={"text-[0.92rem] font-semibold leading-snug " + (mine ? "text-white" : "")}>{job.label[locale]}</p>
                    <p className={"mt-0.5 font-mono text-[0.66rem] " + (mine ? "text-white/45" : "text-[var(--color-mute)]")}>{job.at}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <p className="mt-6 max-w-[62ch] text-sm text-[var(--color-slate)]">{t.closing}</p>
      </div>
    </section>
  );
}

/* ---------- the two headline numbers ---------- */
function Score({
  n, label, live, reduce, tone,
}: { n: number; label: string; live: boolean; reduce: boolean; tone: "brand" | "ink" }) {
  const v = useCountUp(live ? n : 0, reduce);
  const brand = tone === "brand";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={live || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={
        "flex items-baseline gap-3 rounded-[var(--radius)] border px-5 py-4 " +
        (brand
          ? "border-[var(--color-line)] bg-white"
          : "border-[var(--color-ink)] bg-[var(--color-ink)] text-white")
      }
    >
      <span
        className={
          "font-[family-name:var(--font-display)] text-[2.6rem] font-bold leading-none tabular-nums md:text-[3.1rem] " +
          (brand ? "text-[var(--color-brand-600)]" : "text-[var(--color-brand-300)]")
        }
      >
        {v}
      </span>
      <span className={"text-[0.95rem] font-semibold " + (brand ? "text-[var(--color-slate)]" : "text-white/75")}>{label}</span>
    </motion.div>
  );
}

/** Always starts at zero, per the client's rule about numbers. */
function useCountUp(to: number, reduce: boolean, ms = 800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce || to === 0) { setN(to); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms, reduce]);
  return n;
}

/* ---------- the tick, or the YOU flag ---------- */
function Stamp({
  mine, live, reduce, delay, label,
}: { mine: boolean; live: boolean; reduce: boolean; delay: number; label: string }) {
  if (mine) {
    return (
      <span className="rounded-full bg-[var(--color-brand-400)] px-2 py-[3px] text-[0.58rem] font-bold tracking-[0.12em] text-white">
        {label}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[0.58rem] font-bold tracking-[0.12em] text-[var(--color-mute)]">
      <motion.svg
        viewBox="0 0 20 20" className="h-4 w-4"
        initial={reduce ? false : { scale: 0.5, opacity: 0 }}
        animate={live || reduce ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 16, delay: reduce ? 0 : delay }}
      >
        <circle cx="10" cy="10" r="9" fill="#0f9d63" />
        <path d="M5.8 10.3l2.7 2.7 5.7-5.7" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      {label}
    </span>
  );
}

/* ---------- plain line icons, one per kind of job ---------- */
function Icon({ name }: { name: IconKey }) {
  const p = {
    fill: "none", stroke: "currentColor", strokeWidth: 1.7,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
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
