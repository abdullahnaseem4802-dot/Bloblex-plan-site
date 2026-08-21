"use client";
import { useEffect, useRef } from "react";

type Props = {
  /** "dark" glows on the navy hero, "light" whispers on the white page. */
  variant?: "light" | "dark";
  /** the fixed site-wide layer drifts as the page scrolls, for depth */
  parallax?: boolean;
  className?: string;
};

/** A living network of motes wired together by hairline links. It fills its
 *  positioned parent, leans toward the cursor, and drifts with the scroll so
 *  the whole page reads as one deep space rather than a flat sheet. */
export default function ConstellationField({ variant = "light", parallax = false, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const host = canvas.parentElement ?? canvas;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dark = variant === "dark";
    const RGB = dark ? "127,212,245" : "41,171,226";
    const DOT_A = dark ? 0.9 : 0.62;
    const LINE_A = dark ? 0.44 : 0.26;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];
    let w = 0, h = 0, link = 130, narrow = false;
    let raf = 0, visible = true, oy = 0;
    const ptr = { x: -9999, y: -9999, on: false };

    /* seeded, so a remount never reshuffles the sky */
    let seed = 20260821;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

    function build() {
      const rect = host.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      narrow = w < 768;
      link = narrow ? 96 : 148;
      const count = Math.round(Math.min(narrow ? 32 : 130, (w * h) / (narrow ? 13000 : 11000)));
      seed = 20260821;
      pts = Array.from({ length: count }, () => ({
        x: rnd() * w,
        y: rnd() * h,
        vx: (rnd() - 0.5) * 0.2,
        vy: (rnd() - 0.5) * 0.2,
        r: 0.7 + rnd() * 1.6,
      }));
    }

    const wrap = (v: number, m: number) => ((v % m) + m) % m;

    function frame() {
      const reach = narrow ? 0 : 190;
      if (parallax) oy = -window.scrollY * 0.05;

      ctx!.clearRect(0, 0, w, h);
      const ys: number[] = new Array(pts.length);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          p.x = wrap(p.x, w);
          p.y = wrap(p.y, h);
        }
        ys[i] = wrap(p.y + oy, h);
      }

      /* links first, so the dots sit on top of their own web */
      ctx!.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = ys[i] - ys[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > link * link) continue;
          const a = (1 - Math.sqrt(d2) / link) * LINE_A;
          ctx!.strokeStyle = `rgba(${RGB},${a.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.moveTo(pts[i].x, ys[i]);
          ctx!.lineTo(pts[j].x, ys[j]);
          ctx!.stroke();
        }
      }

      /* the cursor is just another node: it wires itself into the nearby web */
      if (ptr.on && reach) {
        for (let i = 0; i < pts.length; i++) {
          const dx = pts[i].x - ptr.x;
          const dy = ys[i] - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d > reach) continue;
          const a = (1 - d / reach) * (LINE_A + 0.22);
          ctx!.strokeStyle = `rgba(${RGB},${a.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.moveTo(pts[i].x, ys[i]);
          ctx!.lineTo(ptr.x, ptr.y);
          ctx!.stroke();
          if (!reduce) {
            /* a whisper of pull, never a yank */
            pts[i].vx -= (dx / (d || 1)) * 0.008;
            pts[i].vy -= (dy / (d || 1)) * 0.008;
          }
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        /* speed is capped so the cursor pull can never fling a mote away */
        const s = Math.hypot(p.vx, p.vy);
        if (s > 0.42) { p.vx = (p.vx / s) * 0.42; p.vy = (p.vy / s) * 0.42; }
        ctx!.fillStyle = `rgba(${RGB},${DOT_A})`;
        ctx!.beginPath();
        ctx!.arc(p.x, ys[i], p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduce) { frame(); return; }
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = ptr.x > -60 && ptr.y > -60 && ptr.x < w + 60 && ptr.y < h + 60;
    }
    const onLeave = () => { ptr.on = false; };

    build();
    start();

    const ro = new ResizeObserver(() => { build(); if (reduce) frame(); });
    ro.observe(host);
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; if (visible) start(); else cancelAnimationFrame(raf); },
      { rootMargin: "120px" }
    );
    io.observe(canvas);
    const onVis = () => { visible = !document.hidden; visible ? start() : cancelAnimationFrame(raf); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant, parallax]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 block h-full w-full ${className}`} />;
}
