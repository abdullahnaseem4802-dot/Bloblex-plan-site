"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type Seg = { text: string; className?: string };

/** Letter-by-letter headline, the way the portfolio does it: characters land
 *  on a clock behind a blinking caret, then `onDone` releases whatever is
 *  meant to follow.
 *
 *  Two things it does differently, both deliberate:
 *
 *  - Every glyph is in the markup from the server, so the h1 is whole for
 *    crawlers and screen readers; typing only reveals what is already there.
 *    Whether this visit types at all is decided by the inline script in the
 *    document head, which stamps `data-intro` on <html> before anything
 *    paints — so neither the typed nor the static opening ever flashes.
 *  - The clock is a rAF reading elapsed time, not one timer per character.
 *    A timer chain pays a React render per letter and drifts far behind the
 *    speed it was asked for.
 */
export default function Typewriter({
  segments, speed = 26, startDelay = 120, onDone, className = "",
}: {
  segments: Seg[]; speed?: number; startDelay?: number; onDone?: () => void; className?: string;
}) {
  /* -1 = "show everything": the server render, and where a visitor who is not
     getting the intro stays */
  const [shown, setShown] = useState(-1);
  const [running, setRunning] = useState(false);
  const done = useRef(false);
  const cb = useRef(onDone);
  cb.current = onDone;

  const total = segments.reduce((n, s) => n + s.text.length, 0) + (segments.length - 1);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    cb.current?.();
  };

  useLayoutEffect(() => {
    const root = document.documentElement;
    const play = root.hasAttribute("data-intro")
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* claim it, so nothing else in this document replays the intro */
    root.removeAttribute("data-intro");
    if (!play) { finish(); return; }
    setShown(0);
    setRunning(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0 - startDelay;
      const n = elapsed <= 0 ? 0 : Math.min(total, Math.floor(elapsed / speed));
      setShown(n);
      if (n >= total) { setRunning(false); finish(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, total, speed, startDelay]);

  let k = -1;
  const char = (ch: string, key: string) => {
    k += 1;
    const i = k;
    const on = shown < 0 || i < shown;
    return (
      <span
        key={key}
        className={`bx-tw-ch relative ${shown >= 0 && i === shown ? "bx-caret" : ""}`}
        /* only the hidden ones carry a style, so the pre-hydration CSS in
           globals can hold every glyph back without being overridden */
        style={on ? undefined : { opacity: 0 }}
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
