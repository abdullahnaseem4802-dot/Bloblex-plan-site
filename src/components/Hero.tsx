"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import TypeIn from "./TypeIn";
import { SPLASH_DONE } from "./SplashController";
import { CONTENT, type Locale } from "@/content/site";

const STAGE = 440;
const C = STAGE / 2;
const RX = 168;
const RY = 150;

export default function Hero({ locale }: { locale: Locale }) {
  const t = CONTENT[locale].hero;
  const reduce = useReducedMotion();
  const base = locale === "en" ? "" : "/fr";

  /* The headline reveal is part of the site intro: it plays once, on a fresh
     open or reload, and starts the instant the splash curtain lifts.
     "static" = internal navigation, "wait" = splash still up, "play" = reveal. */
  const [phase, setPhase] = useState<"static" | "wait" | "play">("static");
  useEffect(() => {
    const w = window as unknown as { __blobexSplashDone?: boolean };
    if (w.__blobexSplashDone || !document.documentElement.hasAttribute("data-splash")) return;

    setPhase("wait");
    const play = () => setPhase("play");
    window.addEventListener(SPLASH_DONE, play, { once: true });
    // safety net: never leave the headline hidden if the event is missed
    const failsafe = setTimeout(play, 6000);
    return () => { window.removeEventListener(SPLASH_DONE, play); clearTimeout(failsafe); };
  }, []);

  const intro = phase === "play";
  const waiting = phase === "wait";
  const heroDelay = intro ? 0 : 0.1;

  // scale the fixed-size stage down to fit its column (mobile-safe, no clipping)
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / STAGE));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // fixed chip positions around the blob (px within STAGE)
  const chips = t.chips.map((label, i) => {
    const a = (i / t.chips.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / 6; // rotate so nothing sits straight below
    const px = C + RX * Math.cos(a);
    const py = C + RY * Math.sin(a);
    return { label, px, py, toX: C - px, toY: C - py };
  });

  const cycle = chips.length * 1.9; // total loop seconds

  return (
    <section id="hero" className="hero-surface relative overflow-hidden pt-[116px] pb-14 md:pt-[128px] md:pb-24">
      <div className="container grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-6 items-center">
        {/* Copy */}
        <div className="max-w-xl min-w-0">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }} animate={waiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: heroDelay }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5 text-[0.82rem] font-semibold tracking-wide text-[var(--color-brand-700)] shadow-[var(--shadow-soft)] backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />
            {t.eyebrow}
          </motion.p>

          <h1
            className={`text-[2.15rem] leading-[1.08] tracking-[-0.035em] font-semibold text-[var(--color-ink)] text-balance sm:text-[2.9rem] lg:text-[3.5rem] ${intro ? "sheen" : ""}`}
            /* stay blank behind the splash so no letters are pre-printed */
            style={waiting ? { visibility: "hidden" } : undefined}
          >
            {intro ? (
              /* solid colours here: a transformed glyph cannot be painted
                 through an ancestor's background-clip:text */
              <TypeIn
                delay={heroDelay}
                segments={[
                  { text: t.titleLine1, className: "text-[var(--color-ink)]" },
                  { text: t.titleLine2, className: "text-[var(--color-brand-500)]" },
                ]}
              />
            ) : (
              <>
                {t.titleLine1} <span className="text-gradient">{t.titleLine2}</span>
              </>
            )}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={waiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: heroDelay + 0.5 }}
            className="mt-7 text-lg leading-relaxed text-[var(--color-slate)] max-w-[52ch]"
          >
            {t.lead}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={waiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: heroDelay + 0.62 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href={`${base}#contact`} className="btn-primary">{t.ctaPrimary}</a>
            <a href={`${base}#time`} className="btn-ghost">{t.ctaSecondary} →</a>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }} animate={waiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, delay: heroDelay + 0.74 }}
            className="mt-8 border-l-2 border-[var(--color-brand-200)] pl-4 text-sm font-medium text-[var(--color-mute)]"
          >
            {t.note}
          </motion.p>
        </div>

        {/* Signature animation, the blob eats the systems.
            Wrapper is min-w-0 + absolute inner so the fixed 440px stage never
            forces the grid column width (mobile-safe, no clipping). */}
        <div
          ref={wrapRef}
          className="relative w-full min-w-0 max-w-[440px] mx-auto lg:ml-auto lg:mr-0 overflow-hidden"
          style={{ height: STAGE * scale }}
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/2" style={{ width: STAGE, height: STAGE, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}>
              {/* soft halo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.16),transparent_62%)]" />

              {/* pulse rings */}
              {!reduce && [0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full border border-[var(--color-brand-300)]"
                  style={{ width: 170, height: 150, x: "-50%", y: "-50%" }}
                  initial={{ scale: 0.7, opacity: 0.5 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 3.4, repeat: Infinity, delay: i * 1.7, ease: "easeOut" }}
                />
              ))}

              {/* chips */}
              {chips.map((chip, i) => (
                <motion.span
                  key={chip.label}
                  className="absolute select-none whitespace-nowrap rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)]"
                  style={{ left: chip.px, top: chip.py, x: "-50%", y: "-50%" }}
                  animate={
                    reduce
                      ? {}
                      : {
                          x: ["-50%", "-50%", "-50%"],
                          y: ["-50%", "-50%", "-50%"],
                          translateX: [0, chip.toX, chip.toX, 0, 0],
                          translateY: [0, chip.toY, chip.toY, 0, 0],
                          scale: [1, 0.15, 0.15, 1, 1],
                          opacity: [1, 0, 0, 1, 1],
                        }
                  }
                  transition={
                    reduce
                      ? {}
                      : {
                          duration: cycle,
                          times: [0, 0.16, 0.2, 0.36, 1],
                          repeat: Infinity,
                          delay: (i * cycle) / chips.length,
                          ease: "easeInOut",
                        }
                  }
                >
                  {chip.label}
                </motion.span>
              ))}

              {/* the blob */}
              <motion.div
                className="absolute left-1/2 top-1/2"
                style={{ x: "-50%", y: "-50%" }}
                animate={reduce ? {} : { scale: [1, 1.05, 0.97, 1.02, 1], rotate: [0, 1.5, -1.5, 0] }}
                transition={reduce ? {} : { duration: cycle / chips.length, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 240 200" width="256" height="213">
                  <defs>
                    <radialGradient id="heroBlob" cx="42%" cy="34%" r="78%">
                      <stop offset="0%" stopColor="#8ddaf7" />
                      <stop offset="52%" stopColor="#29abe2" />
                      <stop offset="100%" stopColor="#1274ab" />
                    </radialGradient>
                    <filter id="blobShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#29abe2" floodOpacity="0.35" />
                    </filter>
                  </defs>
                  <path
                    filter="url(#blobShadow)"
                    fill="url(#heroBlob)"
                    d="M120 22C80 22 34 44 34 100c0 40 36 62 86 62s86-22 86-62C206 44 160 22 120 22Z"
                  />
                  {/* sheen */}
                  <ellipse cx="92" cy="64" rx="30" ry="16" fill="#ffffff" opacity="0.25" />
                  {/* eyes */}
                  <circle cx="96" cy="104" r="11" fill="#0a1628" />
                  <circle cx="144" cy="104" r="11" fill="#0a1628" />
                  <circle cx="92.5" cy="100.5" r="3.6" fill="#fff" />
                  <circle cx="140.5" cy="100.5" r="3.6" fill="#fff" />
                </svg>
              </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}
