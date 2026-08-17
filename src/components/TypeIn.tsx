"use client";
import { motion, useReducedMotion } from "motion/react";

export type Segment = { text: string; className?: string };

/** Cinematic letter-by-letter reveal: each glyph rises out of a mask with a
 *  brief blur, like a film title card. Segments share one continuous timeline
 *  and one rendering treatment, so every part of the headline animates alike.
 *  The full text stays in the DOM for SEO and screen readers. */
export default function TypeIn({
  segments, className = "", delay = 0, stagger = 0.016,
}: { segments: Segment[]; className?: string; delay?: number; stagger?: number }) {
  const reduce = useReducedMotion();
  const label = segments.map((s) => s.text).join(" ");

  if (reduce) {
    return (
      <span className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
            {i < segments.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  let i = -1;

  return (
    <span className={className} aria-label={label}>
      {segments.map((seg, si) => {
        const words = seg.text.split(" ");
        return (
          <span key={si} className={seg.className}>
            {words.map((word, w) => (
              <span key={w} className="inline-block whitespace-nowrap">
                {/* masked rise. no per-glyph filter: it would create a stacking
                    context and break the ancestor background-clip:text */}
                <span className="inline-block overflow-hidden align-bottom pb-[0.09em]">
                  {Array.from(word).map((ch) => {
                    i += 1;
                    return (
                      <motion.span
                        key={i}
                        aria-hidden
                        className="inline-block will-change-transform"
                        initial={{ opacity: 0, y: "105%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        transition={{ duration: 0.42, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {ch}
                      </motion.span>
                    );
                  })}
                </span>
                {(w < words.length - 1 || si < segments.length - 1) && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
