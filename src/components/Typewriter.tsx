"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type Seg = { text: string; className?: string };

/** Letter-by-letter headline, the way the portfolio does it: one character
 *  every `speed` ms behind a blinking caret, then `onDone` releases whatever
 *  is meant to follow.
 *
 *  Every glyph is in the markup from the server, so the h1 is complete for
 *  crawlers and screen readers; typing only reveals what is already there.
 *  That also means no flash: the count is zeroed before the first paint. */
export default function Typewriter({
  segments, speed = 50, startDelay = 300, onDone, className = "",
}: {
  segments: Seg[]; speed?: number; startDelay?: number; onDone?: () => void; className?: string;
}) {
  /* -1 = "show everything": the server render, and the state a reduced-motion
     visitor stays in */
  const [shown, setShown] = useState(-1);
  const done = useRef(false);
  const cb = useRef(onDone);
  cb.current = onDone;

  const total = segments.reduce((n, s) => n + s.text.length, 0) + (segments.length - 1);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (!done.current) { done.current = true; cb.current?.(); }
      return;
    }
    setShown(0);
  }, []);

  useEffect(() => {
    if (shown < 0) return;
    if (shown >= total) {
      if (!done.current) { done.current = true; cb.current?.(); }
      return;
    }
    const wait = shown === 0 ? startDelay : speed;
    const t = setTimeout(() => setShown((n) => n + 1), wait);
    return () => clearTimeout(t);
  }, [shown, total, speed, startDelay]);

  let k = -1;
  const char = (ch: string, key: string) => {
    k += 1;
    const i = k;
    const on = shown < 0 || i < shown;
    return (
      <span
        key={key}
        className={`relative ${shown >= 0 && i === shown ? "bx-caret" : ""}`}
        style={{ opacity: on ? 1 : 0 }}
        suppressHydrationWarning
      >
        {ch}
      </span>
    );
  };

  return (
    <span className={className}>
      {segments.map((seg, si) => (
        <span key={si} className={seg.className}>
          {seg.text.split(" ").map((word, w, words) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => char(ch, `${w}-${ci}`))}
              {w < words.length - 1 && char("\u00a0", `sp-${w}`)}
            </span>
          ))}
          {si < segments.length - 1 && char("\u00a0", `seg-${si}`)}
        </span>
      ))}
    </span>
  );
}
