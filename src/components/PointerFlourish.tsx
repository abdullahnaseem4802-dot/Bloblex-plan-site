"use client";
import { useEffect, useRef, useState } from "react";

/* Real cards only — not the small pills that share the same soft shadow. */
const CARD = '[class*="radius-lg"][class*="shadow-soft"], [class*="radius-xl"][class*="shadow-soft"]';

/** One pointer listener for the whole site: a soft brand halo that trails the
 *  cursor, and a light that pools inside whichever card it is over. Mouse
 *  only — touch devices get nothing and pay nothing. */
export default function PointerFlourish() {
  const [on, setOn] = useState(false);
  const lit = useRef<HTMLElement | null>(null);
  const aura = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let tx = -200, ty = -200, x = -200, y = -200, raf = 0, moved = false;

    const glide = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      if (aura.current) aura.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(glide);
    };

    const clear = () => {
      if (!lit.current) return;
      lit.current.classList.remove("bx-lit");
      lit.current.style.removeProperty("--bx-mx");
      lit.current.style.removeProperty("--bx-my");
      lit.current = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!moved) { moved = true; x = tx; y = ty; setOn(true); }

      const t = e.target as Element | null;
      const card = t?.closest?.(CARD) as HTMLElement | null;
      if (card !== lit.current) clear();
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--bx-mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--bx-my", `${e.clientY - r.top}px`);
        card.classList.add("bx-lit");
        lit.current = card;
      }
    };

    const onOut = () => { setOn(false); clear(); };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onOut);
    raf = requestAnimationFrame(glide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onOut);
      clear();
    };
  }, []);

  return <div ref={aura} className="bx-aura" data-on={on ? "" : undefined} aria-hidden="true" />;
}
