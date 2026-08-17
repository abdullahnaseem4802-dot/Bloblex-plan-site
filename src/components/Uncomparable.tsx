"use client";
import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { UNCOMPARABLE_UI } from "@/content/extras";

export default function Uncomparable({ locale }: { locale: Locale }) {
  const ui = UNCOMPARABLE_UI[locale];
  const [revealed, setRevealed] = useState(false);
  const contactHref = locale === "en" ? "#contact" : "/fr#contact";

  return (
    <section id="uncomparable" className="py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-ink)] px-8 py-14 md:px-14 md:py-20 text-white">
            <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.4),transparent_65%)]" />
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
                  onChange={() => setRevealed(false)}
                  className="flex-1 rounded-[var(--radius)] border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-[var(--color-brand-400)]"
                />
                <button onClick={() => setRevealed(true)} className="btn-primary justify-center whitespace-nowrap">{ui.button}</button>
              </div>

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
