"use client";
import { useEffect, useState, type RefObject } from "react";
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

type ScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>;
type Offset = NonNullable<ScrollOptions["offset"]>;

/** 0 → 1 as the section travels through the viewport, spring-smoothed. */
export function useScrub(
  ref: RefObject<HTMLElement | null>,
  offset: Offset = ["start 85%", "end 55%"] as unknown as Offset,
): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref as RefObject<HTMLElement>, offset });
  return useSpring(scrollYProgress, {
    stiffness: reduce ? 400 : 70,
    damping: reduce ? 60 : 22,
    mass: 0.35,
    restDelta: 0.0005,
  });
}

/** Reads a motion value into React state, for the places that need a number
 *  rather than a style (counters, step indexes, conditional copy). */
export function useScrubValue(mv: MotionValue<number>, round = 3): number {
  const [v, setV] = useState(0);
  useEffect(() => {
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
