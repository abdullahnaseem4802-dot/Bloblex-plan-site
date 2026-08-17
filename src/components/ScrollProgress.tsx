"use client";
import { motion, useScroll, useSpring } from "motion/react";

/** Thin brand-coloured reading indicator across the top of every page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[var(--color-brand-600)] via-[var(--color-brand-400)] to-[var(--color-brand-300)]"
    />
  );
}
