"use client";
import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { useScroll, useSpring, useReducedMotion, type MotionValue } from "motion/react";

/* ---------------------------------------------------------------------------
   Scroll-driven playback.

   The client's note was that nobody will press a play button, that a replay
   button "looks cheap", and that a fixed-speed animation is always either too
   slow or too fast for the person watching.

   Tying playback to scroll position answers all three at once: the visitor is
   already scrolling, so the animation is running; they set the pace themselves,
   so it is never rushed and never drags; and it plays backwards if they scroll
   back, which removes any reason for a replay control.

   The raw scroll value is passed through a spring so the motion glides instead
   of tracking the wheel step for step, which is what makes it feel smooth
   rather than mechanical.
--------------------------------------------------------------------------- */

/* Runs before the browser paints, so a corrected value never flashes. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>;
type Offset = NonNullable<ScrollOptions["offset"]>;

/** 0 → 1 as the section travels through the viewport, spring-smoothed. */
export function useScrub(
  ref: RefObject<HTMLElement | null>,
  offset: Offset = ["start 85%", "end 55%"] as unknown as Offset,
): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref as RefObject<HTMLElement>, offset });
  const smooth = useSpring(scrollYProgress, {
    stiffness: reduce ? 400 : 70,
    damping: reduce ? 60 : 22,
    mass: 0.35,
    restDelta: 0.0005,
  });

  /* The first reading can be taken before the section has been laid out, and
     springing away from that wrong value looks like the bar running backwards.
     Snap to the truth once, after layout, instead of animating to it. */
  useIsomorphicLayoutEffect(() => {
    smooth.jump(scrollYProgress.get());
    let alive = true;
    /* and once more after layout has settled, in case fonts moved the section */
    const r = requestAnimationFrame(() => { if (alive) smooth.jump(scrollYProgress.get()); });
    return () => { alive = false; cancelAnimationFrame(r); };
  }, [smooth, scrollYProgress]);

  return smooth;
}

/** Reads a motion value into React state, for the places that need a number
 *  rather than a style (counters, step indexes, conditional copy). */
export function useScrubValue(mv: MotionValue<number>, round = 3): number {
  const [v, setV] = useState(0);
  useIsomorphicLayoutEffect(() => {
    const f = 10 ** round;
    const set = (n: number) => setV(Math.round(n * f) / f);
    set(mv.get());
    return mv.on("change", set);
  }, [mv, round]);
  return v;
}

/** Maps overall progress onto one item of a staggered sequence, 0 → 1.
 *  `share` is how much of the timeline each item occupies before the next
 *  begins, so items overlap instead of firing one strictly after another. */
export function stagger(p: number, index: number, count: number, share = 1.9): number {
  const step = 1 / (count + share - 1);
  const start = index * step;
  const end = start + step * share;
  if (p <= start) return 0;
  if (p >= end) return 1;
  return (p - start) / (end - start);
}

/** Ease used across the scrubbed sections so they all move with one hand. */
export function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ---------------------------------------------------------------------------
   Scrubbing needs a second way in.

   Scroll-driven playback assumes the visitor keeps scrolling. Whenever they
   stop - and they stop exactly where the section is interesting - the range
   freezes wherever it happens to be, and they are left in front of a
   half-finished animation that only finishes if they scroll away from it.
   That is backwards: the reward for paying attention should not be an
   unfinished picture.

   So a section also plays itself once it is properly in view. Callers take the
   higher of the two, so scrolling still drives it and still runs ahead of the
   clock if the visitor is quick.

   This was small-screen only at first, on the theory that a tall phone layout
   was the whole problem. It is not: a desktop section whose range ends at
   "end 45%" has the same failure, it just needs a slightly slower reader to
   show up.
--------------------------------------------------------------------------- */

/** True on phones and small tablets. Follows the viewport if it changes. */
export function useSmallScreen(query = "(max-width: 1023px)"): boolean {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return small;
}

/** 0 → 1 over `ms`, started once `ref` is `amount` visible. */
export function useSettle(
  ref: RefObject<HTMLElement | null>,
  ms = 1400,
  amount = 0.2,
): number {
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    /* reduced motion is answered by the return value, not by setting state
       here, so the effect never writes synchronously */
    if (!el || reduce) return;

    let raf = 0;
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now;
      const k = Math.min(1, (now - t0) / ms);
      setP(k);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(step);
      },
      /* a tall panel never reaches a high ratio on a phone, so ask for a
         modest slice of it and pull the viewport edges in instead */
      { threshold: amount, rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ref, ms, amount, reduce]);

  return reduce ? 1 : p;
}
