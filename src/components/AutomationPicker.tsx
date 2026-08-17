"use client";
import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { AUTOMATION_TASKS, AUTOMATION_UI } from "@/content/extras";

export default function AutomationPicker({ locale }: { locale: Locale }) {
  const ui = AUTOMATION_UI[locale];
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const totalHours = AUTOMATION_TASKS.reduce((a, t) => a + t.hoursPerWeek, 0);
  const savedWeek = AUTOMATION_TASKS.filter((t) => selected.has(t.id)).reduce((a, t) => a + t.hoursPerWeek, 0);
  const savedYear = savedWeek * 48;
  const pct = Math.round((savedWeek / totalHours) * 100);

  return (
    <section id="automate" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{ui.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{ui.title}</h2>
          <p className="mt-5 text-lg text-[var(--color-slate)]">{ui.lead}</p>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Task toggles */}
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-3">
              {AUTOMATION_TASKS.map((t) => {
                const on = selected.has(t.id);
                return (
                  <button
                    key={t.id} onClick={() => toggle(t.id)} aria-pressed={on}
                    className={`flex items-center justify-between rounded-[var(--radius)] border px-4 py-3.5 text-left transition-all ${
                      on ? "border-[var(--color-brand-400)] bg-[var(--color-brand-50)] shadow-[var(--shadow-soft)]" : "border-[var(--color-line)] bg-white hover:border-[var(--color-brand-200)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`grid h-5 w-5 place-items-center rounded-md border-2 transition-colors ${on ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)] text-white" : "border-[var(--color-line)]"}`}>
                        {on && <span className="text-xs leading-none">✓</span>}
                      </span>
                      <span className="font-semibold text-[var(--color-ink)]">{t.label[locale]}</span>
                    </span>
                    <span className="text-sm font-medium text-[var(--color-mute)]">{t.hoursPerWeek}h</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Live result */}
          <Reveal delay={120}>
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-ink)] text-white p-7 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15.5" fill="none" stroke="#45bdec" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={97.4}
                      initial={{ strokeDashoffset: 97.4 }}
                      animate={{ strokeDashoffset: 97.4 - (97.4 * pct) / 100 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center font-[family-name:var(--font-display)] text-lg font-bold">{pct}%</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{ui.savedLabel}</p>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-bold">
                    {savedWeek}h <span className="text-base font-medium text-white/70">{ui.perWeek}</span>
                  </p>
                  <p className="text-sm text-[var(--color-brand-300)]">{savedYear}h {ui.perYear}</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-white/55">{selected.size}/{AUTOMATION_TASKS.length} {ui.automated}</p>
              <a href={locale === "en" ? "#contact" : "/fr#contact"} className="btn-primary w-full justify-center mt-5">{ui.cta}</a>
            </div>
          </Reveal>
        </div>
        <p className="mt-5 text-sm text-[var(--color-mute)]">{AUTOMATION_UI[locale].hint}</p>
      </div>
    </section>
  );
}
