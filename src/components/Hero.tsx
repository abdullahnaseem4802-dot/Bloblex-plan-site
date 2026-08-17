"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import TypeIn from "./TypeIn";
import HeroAtmosphere from "./HeroAtmosphere";
import HeroStage3D from "./HeroStage3D";
import { SPLASH_DONE } from "./SplashController";
import { CONTENT, type Locale } from "@/content/site";

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

  return (
    <section id="hero" className="hero-surface relative overflow-hidden pt-[116px] pb-14 md:pt-[128px] md:pb-24">
      <HeroAtmosphere />
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

        {/* Signature 3D orbit: chips ride a real ring and pass behind the blob */}
        <HeroStage3D chips={t.chips} />
      </div>

    </section>
  );
}
