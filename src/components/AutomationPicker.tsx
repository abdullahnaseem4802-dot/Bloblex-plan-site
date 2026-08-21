"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import { useScrub, useScrubValue, useSettle, stagger, ease } from "@/lib/scrub";
import { type Locale } from "@/content/site";
import { AUTOMATION_TASKS, AUTOMATION_UI } from "@/content/extras";

const GREEN = "#0f9d63";
const AMBER = "#d97316";

const TOTAL_HOURS = AUTOMATION_TASKS.reduce((a, t) => a + t.hoursPerWeek, 0);

/* Was a list of checkboxes waiting to be ticked, which the client called
   boring: it asked the visitor to do the work before it would say anything.
   Now the week empties itself as the section is scrolled. Each job lifts out
   of "by hand", crosses over, and lands in the system, and the hours counter
   climbs from zero along with it. Nothing to click, and scrolling back puts
   the week straight again. */
export default function AutomationPicker({ locale }: { locale: Locale }) {
  const t = AUTOMATION_UI[locale];
  const ref = useRef<HTMLDivElement>(null);
  const scrub = useScrub(ref, ["start 92%", "end 45%"]);
  const raw = useScrubValue(scrub);
  const settle = useSettle(ref, 1700);
  const p = Math.max(raw, settle);

  const moved = AUTOMATION_TASKS.map((_, i) => ease(stagger(p, i, AUTOMATION_TASKS.length, 2.2)));
  const hours = AUTOMATION_TASKS.reduce((a, task, i) => a + task.hoursPerWeek * moved[i], 0);
  const count = moved.filter((m) => m > 0.99).length;

  return (
    <section id="automate" className="border-y border-[var(--color-line)] band-white py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-[3rem]">{t.title}</h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-[var(--color-slate)]">{t.lead}</p>
        </Reveal>

        <div ref={ref} className="mt-10 grid gap-4 lg:grid-cols-[1fr_320px] lg:gap-6">
          {/* the week, emptying itself */}
          <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-panel)]/50 p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between text-[0.68rem] font-bold uppercase tracking-[0.14em]">
              <span style={{ color: AMBER }}>{t.byHand}</span>
              <span style={{ color: GREEN }}>{t.handled}</span>
            </div>

            <ul className="space-y-2">
              {AUTOMATION_TASKS.map((task, i) => {
                const m = moved[i];
                return (
                  <li key={task.id} className="relative">
                    {/* The row used to slide to the right, which pushed it out of
                        the panel and under the counter card. It stays put now and
                        the system "takes it over" as a fill sweeping across it. */}
                    <motion.div
                      className="relative flex items-center justify-between gap-3 overflow-hidden rounded-[var(--radius)] border bg-white px-4 py-2.5"
                      style={{
                        borderColor: m > 0.5 ? `${GREEN}66` : "var(--color-line)",
                        boxShadow: m > 0.5 ? `0 14px 34px -20px ${GREEN}` : "none",
                        opacity: 0.5 + m * 0.5,
                      }}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0"
                        style={{ width: `${m * 100}%`, background: `linear-gradient(90deg, ${GREEN}14, ${GREEN}0e)` }}
                      />
                      <span className="relative flex items-center gap-2.5">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-bold text-white"
                          style={{ background: m > 0.5 ? GREEN : "var(--color-line)" }}
                          aria-hidden="true"
                        >
                          {m > 0.5 ? "✓" : ""}
                        </span>
                        <span className={`text-sm font-medium ${m > 0.5 ? "text-[var(--color-ink)]" : "text-[var(--color-slate)]"}`}>
                          {task.label[locale]}
                        </span>
                      </span>
                      <span
                        className="relative shrink-0 text-sm font-semibold tabular-nums"
                        style={{ color: m > 0.5 ? GREEN : AMBER, textDecoration: m > 0.9 ? "line-through" : "none" }}
                      >
                        {task.hoursPerWeek} h
                      </span>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* the counter, starting at zero */}
          <div className="sticky top-24 self-start rounded-[var(--radius-lg)] bg-[#0a1628] p-6 text-white shadow-[var(--shadow-card)]">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[#7fd4f5]">{t.savedLabel}</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[3.2rem] font-bold leading-none tabular-nums">
              {hours.toFixed(hours < 10 ? 1 : 0)}<span className="text-2xl"> h</span>
            </p>
            <p className="mt-1 text-sm text-[#9fb4cd]">{t.perWeek}</p>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/12">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: GREEN, width: `${(hours / TOTAL_HOURS) * 100}%` }}
              />
            </div>

            <p className="mt-4 text-2xl font-semibold tabular-nums text-[#7fd4f5]">
              ≈ {Math.round(hours * 48).toLocaleString(locale === "fr" ? "fr-CA" : "en-CA")} h
            </p>
            <p className="text-sm text-[#9fb4cd]">{t.perYear}</p>

            <p className="mt-5 border-t border-white/10 pt-4 text-xs text-[#9fb4cd]">
              {count} / {AUTOMATION_TASKS.length} {t.automated}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-[var(--color-mute)]">{t.hint}</p>
      </div>
    </section>
  );
}
