"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** A link that leans toward the cursor as it comes near, and springs back
 *  when it leaves. Reserved for the one CTA that matters, so it reads as a
 *  detail rather than a gimmick. Mouse only, and still when reduced motion
 *  is asked for. */
export default function MagneticLink({
  href, className = "", children, reach = 110, pull = 0.3, max = 10,
}: {
  href: string; className?: string; children: React.ReactNode;
  reach?: number; pull?: number; max?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 240, damping: 18, mass: 0.32 });
  const y = useSpring(my, { stiffness: 240, damping: 18, mass: 0.32 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      /* measured from the edge of the button, not its centre, so a wide
         button attracts along its whole length */
      const ox = Math.max(0, Math.abs(dx) - r.width / 2);
      const oy = Math.max(0, Math.abs(dy) - r.height / 2);
      if (Math.hypot(ox, oy) > reach) {
        mx.set(0); my.set(0);
        return;
      }
      mx.set(Math.max(-max, Math.min(max, dx * pull)));
      my.set(Math.max(-max, Math.min(max, dy * pull)));
    };
    const off = () => { mx.set(0); my.set(0); };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", off);
    window.addEventListener("blur", off);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", off);
      window.removeEventListener("blur", off);
    };
  }, [mx, my, reduce, reach, pull, max]);

  return (
    <motion.a ref={ref} href={href} className={className} style={reduce ? undefined : { x, y }}>
      {children}
    </motion.a>
  );
}
