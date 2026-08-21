"use client";
import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number };

/** Port of the portfolio's ParticleBackground: drifting motes that bounce off
 *  the edges and draw a hairline between any two that come within 120px.
 *  Same maths, Blobex blue instead of indigo. `boost` lifts the ink so the
 *  web stays readable on the navy hero. */
export default function ParticleBackground({
  fixed = true, boost = 1, className = "",
}: { fixed?: boolean; boost?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = fixed ? null : canvas.parentElement;
    let frame = 0;
    let particles: Particle[] = [];
    let w = 0, h = 0;

    const resizeCanvas = () => {
      const r = host ? host.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor((w * h) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > w) p.speedX *= -1;
        if (p.y < 0 || p.y > h) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(41,171,226,${Math.min(1, p.opacity * boost)})`;
        ctx.fill();

        /* links only to later particles: the original drew each pair twice */
        for (let j = index + 1; j < particles.length; j++) {
          const o = particles[j];
          const dx = p.x - o.x;
          const dy = p.y - o.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(41,171,226,${0.14 * boost * (1 - distance / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });

      frame = requestAnimationFrame(drawParticles);
    };

    const rebuild = () => { resizeCanvas(); createParticles(); };
    rebuild();
    drawParticles();

    const ro = host ? new ResizeObserver(rebuild) : null;
    ro?.observe(host!);
    if (!host) window.addEventListener("resize", rebuild);

    return () => {
      cancelAnimationFrame(frame);
      ro?.disconnect();
      if (!host) window.removeEventListener("resize", rebuild);
    };
  }, [fixed, boost]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${fixed ? "fixed" : "absolute"} inset-0 block h-full w-full pointer-events-none ${className}`}
      style={{ background: "transparent" }}
    />
  );
}
