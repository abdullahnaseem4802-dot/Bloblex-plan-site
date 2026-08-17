"use client";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import { CONTENT, type Locale } from "@/content/site";
import { MANUAL_STEPS, STAGES, TIMEGAME_UI, formatMinutes } from "@/content/timegame";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Track({ stages, reached, current }: { stages: string[]; reached: number; current: number }) {
  return (
    <ol className="flex flex-col gap-0">
      {stages.map((s, i) => {
        const on = i <= reached;
        const isCurrent = i === current;
        return (
          <li key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-colors ${
                  on ? "bg-[var(--color-brand-500)] text-white" : "bg-[var(--color-line)] text-[var(--color-mute)]"
                } ${isCurrent ? "ring-4 ring-[var(--color-brand-200)]" : ""}`}
              >
                {i + 1}
              </span>
              {i < stages.length - 1 && (
                <span className={`w-0.5 h-6 ${i < reached ? "bg-[var(--color-brand-400)]" : "bg-[var(--color-line)]"}`} />
              )}
            </div>
            <span className={`text-sm font-semibold ${on ? "text-[var(--color-ink)]" : "text-[var(--color-mute)]"}`}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function TimeGame({ locale }: { locale: Locale }) {
  const head = CONTENT[locale].time;
  const ui = TIMEGAME_UI[locale];
  const stages = STAGES[locale];

  // manual side
  const [mStep, setMStep] = useState(0);
  const mElapsed = MANUAL_STEPS.slice(0, mStep).reduce((a, s) => a + s.minutes, 0);
  const mDone = mStep >= MANUAL_STEPS.length;
  const nextStep = MANUAL_STEPS[mStep];

  // auto side
  const [autoStage, setAutoStage] = useState(0);
  const [autoState, setAutoState] = useState<"idle" | "running" | "confirm" | "done">("idle");
  const cancel = useRef(false);

  async function runAuto() {
    cancel.current = false;
    setAutoState("running");
    for (const stage of [1, 2, 3]) {
      await wait(550);
      if (cancel.current) return;
      setAutoStage(stage);
    }
    await wait(400);
    if (cancel.current) return;
    setAutoState("confirm");
  }
  async function confirm() {
    setAutoState("running");
    await wait(500);
    if (cancel.current) return;
    setAutoStage(4);
    setAutoState("done");
  }
  function resetAuto() {
    cancel.current = true;
    setAutoStage(0);
    setAutoState("idle");
  }

  return (
    <section id="time" className="py-20 md:py-28 bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{head.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{head.title}</h2>
          <p className="mt-5 text-lg text-[var(--color-slate)]">{head.lead}</p>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          {/* MANUAL */}
          <Reveal>
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-6 md:p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{ui.manualTitle}</h3>
                  <p className="mt-1 text-sm text-[var(--color-slate)]">{ui.manualSub}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-mute)]">{ui.totalLabel}</p>
                  <motion.p key={mElapsed} initial={{ scale: 0.8, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
                    className={`font-[family-name:var(--font-display)] text-3xl font-bold ${mDone ? "text-red-600" : "text-[var(--color-ink)]"}`}>
                    {formatMinutes(mElapsed, locale)}
                  </motion.p>
                </div>
              </div>

              <div className="mt-6"><Track stages={stages} reached={mStep} current={mStep} /></div>

              <div className="mt-7">
                {!mDone ? (
                  <button onClick={() => setMStep((s) => s + 1)} className="btn-primary w-full justify-center !bg-[var(--color-ink)]">
                    {nextStep.label[locale]} <span className="opacity-80">(+{formatMinutes(nextStep.minutes, locale)})</span>
                  </button>
                ) : (
                  <div className="rounded-[var(--radius)] bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
                    {ui.manualDone}
                  </div>
                )}
                {mStep > 0 && (
                  <button onClick={() => setMStep(0)} className="mt-3 text-sm font-semibold text-[var(--color-mute)] hover:text-[var(--color-ink)]">
                    {ui.reset}
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* AUTO */}
          <Reveal delay={120}>
            <div className="h-full rounded-[var(--radius-lg)] border-2 border-[var(--color-brand-300)] bg-[var(--color-brand-50)]/40 p-6 md:p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-brand-800)]">{ui.autoTitle}</h3>
                  <p className="mt-1 text-sm text-[var(--color-slate)]">{ui.autoSub}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-mute)]">{ui.totalLabel}</p>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-brand-600)]">
                    {autoState === "done" ? ui.autoTotal : autoState === "running" ? "…" : "0 min"}
                  </p>
                </div>
              </div>

              <div className="mt-6"><Track stages={stages} reached={autoStage} current={autoStage} /></div>

              <div className="mt-7">
                {autoState === "idle" && (
                  <button onClick={runAuto} className="btn-primary w-full justify-center">{ui.autoBtn}</button>
                )}
                {autoState === "running" && (
                  <button disabled className="btn-primary w-full justify-center opacity-70">{ui.running}</button>
                )}
                {autoState === "confirm" && (
                  <motion.button initial={{ scale: 0.95 }} animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                    onClick={confirm} className="btn-primary w-full justify-center">
                    ✓ {ui.confirmBtn}
                  </motion.button>
                )}
                {autoState === "done" && (
                  <div className="rounded-[var(--radius)] bg-white border border-[var(--color-brand-200)] px-4 py-3 text-sm font-medium text-[var(--color-brand-800)]">
                    {ui.autoDone}
                  </div>
                )}
                {(autoState === "done" || autoStage > 0) && (
                  <button onClick={resetAuto} className="mt-3 text-sm font-semibold text-[var(--color-mute)] hover:text-[var(--color-ink)]">
                    {ui.reset}
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
