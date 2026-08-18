"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { STEPS, MANUAL_TOTAL, SYSTEM_TOTAL, DECISION_COUNT, JOURNEY_UI, SYSTEM_CHATTER, fmt } from "@/content/journey";

type Mode = "manual" | "system";

const AMBER = "#d97316";
const GREEN = "#0f9d63";
const BLUE = "#1787c4";

export default function RequestJourney({ locale }: { locale: Locale }) {
  const t = JOURNEY_UI[locale];
  const reduce = useReducedMotion();

  const [mode, setMode] = useState<Mode>("manual");
  /* each mode keeps its own place, so flipping between them compares the two
     runs rather than throwing away whichever one you were part way through */
  const [progress, setProgress] = useState<Record<Mode, number>>({ manual: 0, system: 0 });
  const [running, setRunning] = useState(false); // system mode auto-advancing
  const done = progress[mode];
  const setDone = useCallback(
    (v: number | ((d: number) => number)) =>
      setProgress((p) => ({ ...p, [mode]: typeof v === "function" ? v(p[mode]) : v })),
    [mode]
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => clear, []);

  const spent = STEPS.slice(0, done).reduce(
    (a, s) => a + (mode === "manual" ? s.manual.minutes : s.system.minutes), 0
  );
  const finished = done >= STEPS.length;
  const nextStep = STEPS[done];
  /* in system mode the run halts on any step that needs a human decision */
  const waitingOnYou = mode === "system" && !finished && !running && !!nextStep?.system.you && done > 0;

  /* switching mode keeps both runs; Restart clears only the current one */
  const switchTo = useCallback((m: Mode) => {
    clear(); setRunning(false); setMode(m);
  }, []);
  const restart = useCallback(() => {
    clear(); setRunning(false); setProgress((p) => ({ ...p, [mode]: 0 }));
  }, [mode]);

  /* system mode: roll forward until a decision is required */
  const roll = useCallback((from: number) => {
    clear();
    setRunning(true);
    const tick = (i: number) => {
      if (i >= STEPS.length) { setRunning(false); return; }
      timer.current = setTimeout(() => {
        setProgress((p) => ({ ...p, system: i + 1 }));
        const upcoming = STEPS[i + 1];
        if (upcoming?.system.you) { setRunning(false); return; } // hand control back
        tick(i + 1);
      }, reduce ? 60 : 520);
    };
    tick(from);
  }, [reduce]);

  /* the system narrates itself while it works */
  const chatter = SYSTEM_CHATTER[locale];
  const [chat, setChat] = useState(0);
  useEffect(() => {
    if (mode !== "system" || !running) return;
    const id = setInterval(() => setChat((c) => (c + 1) % chatter.length), 380);
    return () => clearInterval(id);
  }, [mode, running, chatter.length]);

  const statusBar = (() => {
    if (mode === "manual") {
      if (finished) return { text: t.manualDone, cta: null as null | string, tone: AMBER };
      return {
        text: done === 0 ? t.manualIntro : `${t.stepOf(done + 1, STEPS.length)} ${t.manualHint}`,
        cta: `${t.manualNext}  +${fmt(nextStep.manual.minutes, locale)}`,
        tone: AMBER,
      };
    }
    if (finished) return { text: t.systemDone(fmt(SYSTEM_TOTAL, locale), DECISION_COUNT), cta: null, tone: GREEN };
    if (waitingOnYou) return { text: t.systemWaiting, cta: `${nextStep.system.you![locale]}  ${fmt(nextStep.system.minutes, locale)}`, tone: BLUE };
    if (running) return { text: t.systemIntro, cta: null, tone: GREEN };
    return { text: t.systemIntro, cta: `▶  ${t.systemPlay}`, tone: GREEN };
  })();

  /* every manual click throws off a "+8 min" receipt, so the cost of the
     gesture is felt rather than just tallied */
  const [receipts, setReceipts] = useState<{ id: number; at: number; label: string }[]>([]);
  const receiptId = useRef(0);

  const onCta = () => {
    if (mode === "manual") {
      const i = done;
      if (i >= STEPS.length) return;
      const id = ++receiptId.current;
      setReceipts((r) => [...r, { id, at: i, label: `+${fmt(STEPS[i].manual.minutes, locale)}` }]);
      setTimeout(() => setReceipts((r) => r.filter((x) => x.id !== id)), 1100);
      setDone((d) => Math.min(d + 1, STEPS.length));
      return;
    }
    roll(done);
  };

  return (
    <section id="time" className="border-y border-[var(--color-line)] bg-[var(--color-panel)] py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em]">{t.heading}</h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)]">
            {/* status bar */}
            <div className="flex flex-col gap-3 border-b border-[var(--color-line)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusBar.text}
                  initial={reduce ? undefined : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-medium text-[var(--color-ink-soft)]"
                >
                  {statusBar.text}
                </motion.p>
              </AnimatePresence>

              {statusBar.cta && (
                <motion.button
                  onClick={onCta}
                  /* pulse the glow, never the size: a click target must not move */
                  animate={
                    waitingOnYou && !reduce
                      ? { boxShadow: [`0 0 0 0 ${statusBar.tone}00`, `0 0 0 10px ${statusBar.tone}00`, `0 0 0 0 ${statusBar.tone}00`] }
                      : {}
                  }
                  transition={{ duration: 1.6, repeat: waitingOnYou ? Infinity : 0 }}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-px ${waitingOnYou ? "bx-await" : "shadow-[0_10px_26px_-10px_rgba(10,22,40,.5)]"}`}
                  style={{ background: statusBar.tone }}
                >
                  {statusBar.cta}
                </motion.button>
              )}
            </div>

            {/* headline + running total */}
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-6 md:px-7">
              <div>
                <h3 className="text-lg font-semibold md:text-xl">{t.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-slate)]">
                  {mode === "manual" ? t.subManual : t.subSystem}
                </p>
              </div>
              <div className="text-right">
                <motion.p
                  key={spent}
                  initial={reduce ? undefined : { scale: 0.85, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-[2.6rem]"
                  style={{ color: mode === "manual" ? AMBER : GREEN }}
                >
                  {fmt(spent, locale)}
                </motion.p>
                <p className="text-[0.62rem] font-bold tracking-[0.12em] text-[var(--color-mute)]">{t.ofYourTime}</p>
              </div>
            </div>

            {/* the twelve steps */}
            <ol className="grid grid-cols-2 gap-3 px-5 py-6 md:grid-cols-3 md:px-7 lg:grid-cols-6">
              {STEPS.map((s, i) => {
                const complete = i < done;
                const isNext = i === done && !finished;
                const cfg = mode === "manual" ? s.manual : s.system;
                const needsYou = mode === "system" && !!s.system.you;
                const activeTone = mode === "manual" ? AMBER : needsYou && isNext ? BLUE : GREEN;

                return (
                  <motion.li
                    key={s.label.en}
                    layout
                    className="relative rounded-[var(--radius)] border p-3.5 transition-colors"
                    style={{
                      borderColor: complete ? `${activeTone}66` : isNext ? activeTone : "var(--color-line)",
                      background: complete ? `${activeTone}0f` : isNext ? `${activeTone}0a` : "#fff",
                      boxShadow: isNext ? `0 0 0 3px ${activeTone}22` : undefined,
                    }}
                  >
                    <AnimatePresence>
                      {receipts.filter((r) => r.at === i).map((r) => (
                        <motion.span
                          key={r.id}
                          initial={{ opacity: 0, y: 4, scale: 0.9 }}
                          animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1 }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className="pointer-events-none absolute -top-1 right-2 z-10 rounded-full px-2 py-0.5 text-[0.7rem] font-bold text-white"
                          style={{ background: AMBER }}
                        >
                          {r.label}
                        </motion.span>
                      ))}
                    </AnimatePresence>

                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[0.78rem] font-semibold leading-snug text-[var(--color-ink)]">{s.label[locale]}</p>
                      {complete && <span style={{ color: activeTone }} className="text-sm font-bold">✓</span>}
                    </div>

                    {complete ? (
                      <>
                        <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold" style={{ color: activeTone }}>
                          {fmt(cfg.minutes, locale)}
                        </p>
                        <p className="text-[0.52rem] font-bold tracking-[0.08em] text-[var(--color-mute)]">
                          {cfg.note[locale]}
                        </p>
                      </>
                    ) : isNext ? (
                      <>
                        <span
                          className="mt-2 block h-3 w-3 rounded-full"
                          style={{ background: activeTone, boxShadow: `0 0 0 5px ${activeTone}26` }}
                        />
                        <p className="mt-2 text-[0.52rem] font-bold tracking-[0.08em]" style={{ color: activeTone }}>
                          {needsYou ? t.systemWaitHint : t.todo}
                        </p>
                      </>
                    ) : mode === "system" && running && i === done ? (
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={chatter[chat]}
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          transition={{ duration: 0.18 }}
                          className="mt-3 font-mono text-[0.6rem] font-bold"
                          style={{ color: GREEN }}
                        >
                          {chatter[chat]}
                        </motion.p>
                      </AnimatePresence>
                    ) : (
                      <p className="mt-3 text-[var(--color-mute)]">&mdash;</p>
                    )}
                  </motion.li>
                );
              })}
            </ol>

            {/* the two totals, side by side */}
            <div className="space-y-2.5 border-t border-[var(--color-line)] px-5 py-6 md:px-7">
              <Bar label={t.byHand} value={MANUAL_TOTAL} max={MANUAL_TOTAL} color={AMBER} locale={locale}
                   live={mode === "manual" ? spent : undefined} />
              <Bar label={t.yourSystem} value={SYSTEM_TOTAL} max={MANUAL_TOTAL} color={GREEN} locale={locale}
                   live={mode === "system" ? spent : undefined} />
            </div>

            {/* mode switch */}
            <div className="flex flex-wrap gap-2 border-t border-[var(--color-line)] px-5 py-4 md:px-7">
              <ModeBtn on={mode === "manual"} tone={AMBER} onClick={() => switchTo("manual")}>{t.modeManual}</ModeBtn>
              <ModeBtn on={mode === "system"} tone={GREEN} onClick={() => switchTo("system")}>{t.modeSystem}</ModeBtn>
              <button
                onClick={restart}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)]"
              >
                ↻ {t.restart}
              </button>
            </div>
          </div>
        </Reveal>

        <p className="mt-5 max-w-[62ch] text-sm text-[var(--color-mute)]">{t.closing}</p>
      </div>
    </section>
  );
}

function ModeBtn({ on, tone, onClick, children }: { on: boolean; tone: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
      style={
        on
          ? { background: tone, borderColor: "transparent", color: "#fff", boxShadow: `0 10px 26px -10px ${tone}` }
          : { borderColor: "var(--color-line)", color: "var(--color-slate)", background: "#fff" }
      }
    >
      {children}
    </button>
  );
}

/** `value` is the run's full cost, drawn as a pale reference. `live` is how
 *  far the visitor has actually got in this mode, drawn solid on top, so the
 *  bar moves with them instead of sitting at the total the whole time. */
function Bar({
  label, value, max, color, locale, live,
}: { label: string; value: number; max: number; color: string; locale: Locale; live?: number }) {
  const active = live !== undefined;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-[0.78rem] font-semibold text-[var(--color-slate)] sm:w-28">{label}</span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color, opacity: active ? 0.28 : 1 }}
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        {active && (
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: color }}
            animate={{ width: `${(Math.min(live, max) / max) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        )}
      </div>
      <span className="w-24 shrink-0 text-right text-[0.82rem] font-bold" style={{ color }}>
        {active ? `${fmt(live, locale)} / ${fmt(value, locale)}` : fmt(value, locale)}
      </span>
    </div>
  );
}
