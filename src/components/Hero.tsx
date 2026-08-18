"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import TypeIn from "./TypeIn";
import HeroAtmosphere from "./HeroAtmosphere";
import HeroBlobStage from "./HeroBlobStage";
import { CONTENT, type Locale } from "@/content/site";

export default function Hero({ locale }: { locale: Locale }) {
  const t = CONTENT[locale].hero;
  const reduce = useReducedMotion();
  const base = locale === "en" ? "" : "/fr";

  /* The headline reveal is the site intro. There is no splash screen any
     more, so it plays once per session on a real page load and stays static
     on internal navigation. */
  const [phase, setPhase] = useState<"static" | "wait" | "play">("static");
  useEffect(() => {
    try {
      if (sessionStorage.getItem("blobex_intro")) return;
      sessionStorage.setItem("blobex_intro", "1");
      setPhase("play");
    } catch {
      /* private mode: just skip the intro */
    }
  }, []);

  const intro = phase === "play";
  const waiting = phase === "wait";
  const heroDelay = intro ? 0 : 0.1;

  return (
    <section id="hero" className="hero-dark relative overflow-hidden pt-[132px] pb-44 md:pt-[148px] md:pb-56">
      <HeroAtmosphere />
      <div className="container grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-6 items-center">
        {/* Copy */}
        <div className="hero-copy-shift max-w-xl min-w-0">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }} animate={waiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: heroDelay }}
            className="glass-pill mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.82rem] font-semibold tracking-wide"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-400)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand-400)]" />
            </span>
            {t.eyebrow}
          </motion.p>

          <h1
            className="text-[2.1rem] leading-[1.08] tracking-[-0.035em] font-semibold text-white text-balance sm:text-[2.7rem] lg:w-[750px] lg:max-w-none lg:text-[3.2rem] lg:text-wrap"
            /* stay blank behind the splash so no letters are pre-printed */
            style={waiting ? { visibility: "hidden" } : undefined}
          >
            {intro ? (
              /* solid colours: a transformed glyph cannot be painted through
                 an ancestor's background-clip:text */
              <TypeIn
                delay={heroDelay}
                segments={[
                  { text: t.titleLine1, className: "text-white" },
                  { text: t.titleLine2, className: "text-[var(--color-brand-300)]" },
                ]}
              />
            ) : (
              <>
                {t.titleLine1} <span className="text-flow">{t.titleLine2}</span>
              </>
            )}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={waiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: heroDelay + 0.5 }}
            className="mt-7 max-w-[52ch] text-lg leading-relaxed text-[#a9bdd4]"
          >
            {t.lead}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={waiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: heroDelay + 0.62 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href={`${base}#contact`} className="btn-primary btn-shine text-base">{t.ctaPrimary}</a>
            <a href={`${base}#time`} className="rounded-full px-5 py-3 font-semibold text-white/85 transition-colors hover:text-white">
              {t.ctaSecondary} →
            </a>
          </motion.div>

          {/* trust strip */}
          <motion.ul
            initial={reduce ? false : { opacity: 0 }} animate={waiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, delay: heroDelay + 0.78 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6"
          >
            {t.trust.map((item, i) => (
              <motion.li
                key={item}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={waiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: heroDelay + 0.85 + i * 0.09 }}
                className="flex items-center gap-2 text-sm font-medium text-[#9fb4cd]"
              >
                <span className="text-[var(--color-brand-400)]">✓</span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* the slime grabs each bubble, swallows it, and produces one system */}
        <div className="hero-stage-offset flex w-full items-center justify-center lg:self-start">
          <HeroBlobStage chips={t.chips} systemLabel={t.systemLabel} />
        </div>
      </div>

    </section>
  );
}
