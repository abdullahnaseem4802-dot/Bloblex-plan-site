"use client";
import { useEffect, useRef, useState } from "react";

/** Lightweight scroll-reveal wrapper (no layout shift, reduced-motion safe). */
export default function Reveal({
  children, as: Tag = "div", className = "", delay = 0,
}: { children: React.ReactNode; as?: React.ElementType; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
