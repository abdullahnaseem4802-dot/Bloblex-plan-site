"use client";
import { useEffect, useRef } from "react";
import {
  motion, useAnimationFrame, useMotionValue, useSpring, useTransform, useReducedMotion,
} from "motion/react";

const R = 200;   // orbit radius
const TILT = 16; // ring tilt so the orbit reads as an ellipse

/** The signature hero object: the blob sits at the centre of a real 3D orbit.
 *  Chips ride the ring and pass physically behind the blob, and the whole rig
 *  tips toward the pointer. Everything is CSS 3D, so it stays light. */
export default function HeroStage3D({ chips }: { chips: string[] }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  // continuous orbit
  const spin = useMotionValue(0);
  useAnimationFrame((t) => { if (!reduce) spin.set((t / 1000) * 14); });

  // pointer parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-1, 1], [9, -9]), { stiffness: 60, damping: 18 });
  const rotX = useSpring(useTransform(py, [-1, 1], [-7, 7]), { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r) return;
      px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduce]);

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[480px]" aria-hidden="true">
      {/* glow pool behind the whole rig */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.55),rgba(41,171,226,.18)_45%,transparent_70%)] blur-2xl" />

      <motion.div
        className="absolute inset-0"
        style={{ perspective: 1200, rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY, transformStyle: "preserve-3d" }}
      >
        {/* orbit rings */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-[var(--color-brand-300)]/35"
          style={{ width: R * 2, height: R * 2, transform: `translate(-50%,-50%) rotateX(${90 - TILT}deg)` }}
        />
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-[var(--color-brand-300)]/25"
          style={{ width: R * 1.42, height: R * 1.42, transform: `translate(-50%,-50%) rotateX(${90 - TILT}deg)` }}
        />

        {/* the rotating ring carrying the chips */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: "preserve-3d", rotateX: -TILT, rotateY: spin, width: 0, height: 0 }}
        >
          {chips.map((label, i) => {
            const a = (i / chips.length) * 360;
            return (
              <div
                key={label}
                className="absolute"
                style={{ transformStyle: "preserve-3d", transform: `rotateY(${a}deg) translateZ(${R}px)` }}
              >
                {/* counter-rotate so the label always faces the viewer */}
                <Chip label={label} spin={spin} angle={a} />
              </div>
            );
          })}
        </motion.div>

        {/* the blob, centre of the system */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ translateX: "-50%", translateY: "-50%", transformStyle: "preserve-3d" }}
          animate={reduce ? {} : { y: [-8, 8, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative" style={{ transform: "translateZ(60px)" }}>
            <img src="/img/brand/mark.png" alt="" className="w-[215px] max-w-[40vw] drop-shadow-[0_26px_48px_rgba(41,171,226,.45)]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Chip that stays camera-facing and dims as it swings behind the blob. */
function Chip({ label, spin, angle }: { label: string; spin: ReturnType<typeof useMotionValue<number>>; angle: number }) {
  const face = useTransform(spin, (s) => -(s + angle));
  // cos of world angle: +1 = nearest the viewer, -1 = furthest behind
  const depth = useTransform(spin, (s) => Math.cos(((s + angle) * Math.PI) / 180));
  const opacity = useTransform(depth, [-1, 0, 1], [0.28, 0.7, 1]);
  const scale = useTransform(depth, [-1, 1], [0.82, 1.06]);

  return (
    <motion.span
      style={{ rotateY: face, opacity, scale, translateX: "-50%", translateY: "-50%" }}
      className="block whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.85rem] font-semibold text-white shadow-[0_10px_34px_-6px_rgba(41,171,226,.55)]"
    >
      {label}
    </motion.span>
  );
}
