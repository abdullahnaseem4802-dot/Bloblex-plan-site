"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SIZE = 460;            // stage box, square
const C = SIZE / 2;
const RX = 170, RY = 132;    // where the bubbles wait
const REACH_MS = 620;        // arm goes out and takes hold
const PULL_MS = 640;         // arm hauls the bubble back in
const PAYOFF_MS = 2600;      // how long "One System" stays

/** The hero act, as the client described it: the slime reaches out, grabs each
 *  bubble, pulls it inside itself, and once it has swallowed them all it
 *  produces one thing: your system. Then it starts over. */
export default function HeroBlobStage({ chips, systemLabel }: { chips: string[]; systemLabel: string }) {
  const reduce = useReducedMotion();
  const [eaten, setEaten] = useState(0);        // how many are inside
  const [reaching, setReaching] = useState(-1); // which one the arm has hold of
  const [pulling, setPulling] = useState(-1);   // which one is being hauled in
  const [payoff, setPayoff] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const seats = chips.map((label, i) => {
    const a = (i / chips.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / 7;
    return { label, x: C + RX * Math.cos(a), y: C + RY * Math.sin(a) };
  });

  useEffect(() => {
    if (reduce) { setEaten(chips.length); return; }
    setPulling(-1);
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    let stop = false;

    const cycle = (i: number) => {
      if (stop) return;
      if (i >= chips.length) {
        setReaching(-1);
        setPayoff(true);
        timers.current.push(setTimeout(() => {
          if (stop) return;
          setPayoff(false); setEaten(0);
          timers.current.push(setTimeout(() => cycle(0), 500));
        }, PAYOFF_MS));
        return;
      }
      /* beat 1: the arm goes out and takes hold */
      setReaching(i);
      setPulling(-1);
      timers.current.push(setTimeout(() => {
        if (stop) return;
        /* beat 2: the arm hauls it back in */
        setPulling(i);
        timers.current.push(setTimeout(() => {
          if (stop) return;
          setEaten(i + 1);
          setReaching(-1);
          setPulling(-1);
          timers.current.push(setTimeout(() => cycle(i + 1), 200));
        }, PULL_MS));
      }, REACH_MS));
    };

    timers.current.push(setTimeout(() => cycle(0), 700));
    return () => { stop = true; clear(); };
  }, [chips.length, reduce]);

  /* the blob swells a little with every bubble it swallows */
  const fullness = eaten / chips.length;

  return (
    <div
      className="hero-stage-box relative mx-auto"
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ containerType: "size" }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full">
          {/* the slime tendril reaching for the current bubble */}
          <AnimatePresence>
            {reaching >= 0 && !reduce && (
              <motion.path
                key={reaching}
                d={tendril(seats[reaching].x, seats[reaching].y)}
                fill="none"
                stroke="url(#tendrilGrad)"
                strokeWidth={9}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  pulling === reaching
                    ? { pathLength: 0.05, opacity: 0.9 }   /* retracting, bubble in tow */
                    : { pathLength: 1, opacity: 1 }        /* reaching out */
                }
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: (pulling === reaching ? PULL_MS : REACH_MS) / 1000, ease: pulling === reaching ? [0.6, 0, 0.3, 1] : "easeOut" }}
              />
            )}
          </AnimatePresence>
          <defs>
            <linearGradient id="tendrilGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#29abe2" />
              <stop offset="100%" stopColor="#7fd4f5" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>

        {/* glow pool */}
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.55),rgba(41,171,226,.16)_45%,transparent_70%)] blur-2xl" />

        {/* the bubbles */}
        {seats.map((seat, i) => {
          const inside = i < eaten;
          const held = reaching === i && pulling !== i;
          const hauled = pulling === i;
          return (
            <motion.span
              key={seat.label}
              className="absolute whitespace-nowrap rounded-full border border-white/25 bg-white/12 px-2.5 py-1 text-[0.62rem] font-semibold text-white backdrop-blur-sm sm:px-3.5 sm:py-1.5 sm:text-[0.78rem]"
              style={{ left: `${(seat.x / SIZE) * 100}%`, top: `${(seat.y / SIZE) * 100}%` }}
              initial={false}
              animate={
                inside
                  ? { left: "50%", top: "50%", x: "-50%", y: "-50%", scale: 0, opacity: 0 }
                  : hauled
                    /* dragged along the arm, back into the blob */
                    ? { left: "50%", top: "50%", x: "-50%", y: "-50%", scale: 0.25, opacity: 0.9 }
                    : held
                      /* caught: a wobble, but it has not moved yet */
                      ? { x: "-50%", y: "-50%", scale: [1, 1.14, 1.04], opacity: 1 }
                      : { x: "-50%", y: "-50%", scale: 1, opacity: 1 }
              }
              transition={{
                duration: hauled ? PULL_MS / 1000 : held ? REACH_MS / 1000 : 0.5,
                ease: hauled ? [0.6, 0, 0.3, 1] : "easeOut",
              }}
            >
              {seat.label}
            </motion.span>
          );
        })}

        {/* the slime itself */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[42%]"
          style={{ x: "-50%", y: "-50%" }}
          animate={
            reduce
              ? {}
              : {
                  scale: 1 + fullness * 0.16,
                  y: ["-50%", "-53%", "-50%"],
                }
          }
          transition={{
            scale: { type: "spring", stiffness: 160, damping: 12 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <motion.img
            src="/img/brand/mark-ink-sm.png"
            alt=""
            className="w-full drop-shadow-[0_26px_48px_rgba(41,171,226,.5)]"
            /* a swallow makes it squash, like something just went down */
            animate={reduce ? {} : { scaleX: [1, 1.09, 0.96, 1], scaleY: [1, 0.92, 1.05, 1] }}
            key={eaten}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        {/* what it produces once everything is inside */}
        <AnimatePresence>
          {payoff && (
            <motion.div
              className="absolute left-1/2 top-[74%]"
              style={{ x: "-50%" }}
              initial={{ opacity: 0, y: -10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: [0.5, 1.12, 1] }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.7, ease: [0.2, 1.4, 0.4, 1] }}
            >
              <span className="whitespace-nowrap rounded-full bg-white px-5 py-2 font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-ink)] shadow-[0_14px_40px_-8px_rgba(41,171,226,.9)]">
                {systemLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** a curved arm from the blob out to a bubble */
function tendril(x: number, y: number) {
  const mx = (C + x) / 2 + (y - C) * 0.18;
  const my = (C + y) / 2 - (x - C) * 0.18;
  return `M ${C} ${C} Q ${mx} ${my} ${x} ${y}`;
}
