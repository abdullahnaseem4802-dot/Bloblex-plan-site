"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { RESILIENCE_UI } from "@/content/extras";

const R = 37; // circle radius in the 0..100 viewBox
const positions = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
  });

function Panel({
  mode, tools, ui,
}: { mode: "fragile" | "resilient"; tools: string[]; ui: (typeof RESILIENCE_UI)["en"] }) {
  const pts = positions(tools.length);
  const [broken, setBroken] = useState<number | null>(null); // fragile: stays broken
  const [swap, setSwap] = useState<number | null>(null);     // resilient: temporary
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [taken, setTaken] = useState(false);                 // visitor took over
  const boxRef = useRef<HTMLDivElement>(null);

  const isFragile = mode === "fragile";
  const down = isFragile && broken !== null;

  /* The client's brief: "people scan, they don't read" — so the demo plays
     itself until the visitor interacts, then it hands over control. */
  useEffect(() => {
    if (taken) return;
    const el = boxRef.current;
    if (!el) return;
    let disposed = false;   // effect torn down
    let running = false;    // loop currently scheduled
    let step = 0;
    let t: ReturnType<typeof setTimeout> | undefined;

    const schedule = (fn: () => void, ms: number) => { t = setTimeout(fn, ms); };

    const tick = () => {
      if (disposed || !running) return;
      const i = step % tools.length;
      if (isFragile) {
        setBroken(i);
        schedule(() => {
          if (disposed || !running) return;
          setBroken(null); step++;
          schedule(tick, 900);
        }, 2000);
      } else {
        setSwap(i);
        schedule(() => {
          if (disposed || !running) return;
          setSwap(null); step++;
          schedule(tick, 900);
        }, 1400);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      if (disposed) return;
      if (e.isIntersecting) {
        if (running) return;
        running = true;
        schedule(tick, isFragile ? 600 : 1400);
      } else {
        running = false;
        clearTimeout(t);
        setBroken(null); setSwap(null);
      }
    }, { threshold: 0.3 });
    io.observe(el);

    return () => { disposed = true; running = false; clearTimeout(t); io.disconnect(); };
  }, [taken, isFragile, tools.length]);

  function click(i: number) {
    setTaken(true);
    if (timer.current) clearTimeout(timer.current);
    if (isFragile) { setSwap(null); setBroken(i); return; }
    setBroken(null);
    setSwap(i);
    timer.current = setTimeout(() => setSwap(null), 1100);
  }
  function reset() { setBroken(null); if (timer.current) clearTimeout(timer.current); setSwap(null); }

  const RED = "#e0554e", BLUE = "#29abe2", GREY = "#c3cbd8", GREEN = "#22b07d";

  return (
    <div ref={boxRef} className={`rounded-[var(--radius-lg)] border p-6 ${isFragile ? "border-[var(--color-line)] bg-white" : "border-2 border-[var(--color-brand-300)] bg-[var(--color-brand-50)]/40"} shadow-[var(--shadow-soft)]`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold ${isFragile ? "text-[var(--color-ink)]" : "text-[var(--color-brand-800)]"}`}>{isFragile ? ui.panelA : ui.panelB}</h3>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${down ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${down ? "bg-red-500" : "bg-emerald-500"}`} />
          {down ? ui.down : ui.operational}
        </span>
      </div>

      <div className="relative mx-auto mt-4 aspect-square w-full max-w-[360px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {pts.map((p, i) => {
            let stroke = isFragile ? BLUE : BLUE;
            let dash: string | undefined;
            if (isFragile && broken !== null) { stroke = i === broken ? RED : GREY; dash = i === broken ? "3 3" : undefined; }
            if (!isFragile && swap === i) { stroke = RED; dash = "3 3"; }
            return <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke={stroke} strokeWidth="0.9" strokeDasharray={dash} strokeLinecap="round" />;
          })}
        </svg>

        {/* core */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full text-center text-[11px] font-bold text-white shadow-[var(--shadow-card)]"
          style={{ width: "30%", height: "30%" }}
          animate={down ? { backgroundColor: RED, x: [0, -3, 3, -2, 0] } : { backgroundColor: isFragile ? "#1c2b40" : BLUE, x: 0 }}
          transition={{ duration: down ? 0.35 : 0.3 }}
        >
          {down ? "⚠" : ui.core}
        </motion.div>

        {/* tools */}
        {pts.map((p, i) => {
          const broke = isFragile && broken === i;
          const offline = isFragile && broken !== null && broken !== i;
          const swapping = !isFragile && swap === i;
          return (
            <button
              key={i} onClick={() => click(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors"
              style={{
                left: `${p.x}%`, top: `${p.y}%`,
                background: broke || swapping ? "#fff1f0" : "#fff",
                borderColor: broke || swapping ? RED : offline ? GREY : "var(--color-line)",
                color: broke || swapping ? RED : offline ? GREY : "var(--color-ink-soft)",
              }}
            >
              {broke ? `✕ ${tools[i]}` : swapping ? ui.swapping : tools[i]}
            </button>
          );
        })}
      </div>

      <p className={`mt-3 text-sm font-medium ${down ? "text-red-600" : isFragile ? "text-[var(--color-mute)]" : "text-[var(--color-brand-700)]"}`}>
        {down ? ui.brokeNote : isFragile ? ui.instruction : ui.healNote}
      </p>
      {isFragile && taken && broken !== null && (
        <button onClick={reset} className="mt-2 text-sm font-semibold text-[var(--color-mute)] hover:text-[var(--color-ink)]">{ui.reset}</button>
      )}
    </div>
  );
}

export default function Resilience({ locale }: { locale: Locale }) {
  const ui = RESILIENCE_UI[locale];
  return (
    <section id="resilience" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{ui.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{ui.title}</h2>
          <p className="mt-5 text-lg text-[var(--color-slate)]">{ui.lead}</p>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal><Panel mode="fragile" tools={ui.tools} ui={ui} /></Reveal>
          <Reveal delay={120}><Panel mode="resilient" tools={ui.tools} ui={ui} /></Reveal>
        </div>
      </div>
    </section>
  );
}
