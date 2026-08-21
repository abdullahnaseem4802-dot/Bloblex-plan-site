"use client";
import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { AccessoryKey } from "@/content/sectors";

/* One prop per industry, worn by the brand mark.

   Two families, and nothing in between: helmet and glasses are WORN, sized to
   the face and sitting on the crown; everything else is a COMPANION object
   drawn in its own 64x64 box and set down beside the character on a common
   baseline, with a contact shadow so it sits rather than floats. Earlier these
   were scattered at nine different scales and anchors, which is what made them
   read as clip art.

   Every object is built the same way: an ink outline at 2.4, a lit face, a
   shaded underside, and one white highlight. That shared recipe is what makes
   a flat vector look expensive.

   The mark is drawn at x34 y44, 172 x 115, so the character occupies
   x 34..206 and its baseline is y ~159. */

const INK = "#0a1628";
const COMPANION = { x: 150, y: 106, size: 66 };   // where a set-down object lives

type Grads = { gold: string; brand: string; deep: string; steel: string; glass: string };

function Defs({ g }: { g: Grads }) {
  return (
    <defs>
      <linearGradient id={g.gold} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd970" />
        <stop offset="55%" stopColor="#fdbe2c" />
        <stop offset="100%" stopColor="#e59a0c" />
      </linearGradient>
      <linearGradient id={g.brand} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor="#7fd4f5" />
        <stop offset="55%" stopColor="#29abe2" />
        <stop offset="100%" stopColor="#1c8dc0" />
      </linearGradient>
      <linearGradient id={g.deep} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#2b6f9c" />
        <stop offset="100%" stopColor="#11405e" />
      </linearGradient>
      <linearGradient id={g.steel} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#f2f7fb" />
        <stop offset="55%" stopColor="#cfdce8" />
        <stop offset="100%" stopColor="#9fb3c8" />
      </linearGradient>
      <linearGradient id={g.glass} x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#bfe7fa" stopOpacity="0.9" />
      </linearGradient>
    </defs>
  );
}

/** A set-down object: its own little stage, so each one is drawn to the same
 *  scale and lands in the same place. */
function Companion({ children }: { children: React.ReactNode }) {
  return (
    <g transform={`translate(${COMPANION.x} ${COMPANION.y})`}>
      <ellipse cx="33" cy="63" rx="27" ry="4.5" fill={INK} opacity="0.13" />
      {children}
    </g>
  );
}

function build(g: Grads): Record<AccessoryKey, React.ReactNode> {
  const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  return {
    /* ---------- WORN: hard hat, sized to the crown ---------- */
    helmet: (
      <g>
        {/* A brim much wider than the crown is a straw hat. A hard hat's brim
            is barely wider than the shell, and the front peak is the tell. */}
        <path d="M101 71 C101 88 137 88 137 71 Z" fill="#e0940a" {...line} />
        <path d="M88 71 C88 29 150 29 150 71 Z" fill={`url(#${g.gold})`} {...line} />
        <path d="M112 32 C112 30 126 30 126 32 L126 71 L112 71 Z" fill="#fff" opacity="0.28" />
        <path d="M98 67 C99 46 105 36 112 32" fill="none" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" opacity="0.5" />
        <ellipse cx="119" cy="74" rx="36" ry="7" fill="#e0940a" {...line} />
        <ellipse cx="119" cy="71" rx="36" ry="7" fill={`url(#${g.gold})`} {...line} />
      </g>
    ),

    /* ---------- WORN: safety glasses, on the eyes, not over the whole face ---------- */
    glasses: (
      <g>
        <path d="M100 86 L84 79" {...line} fill="none" />
        <path d="M174 86 L189 80" {...line} fill="none" />
        <rect x="99" y="79" width="30" height="28" rx="11" fill={`url(#${g.glass})`} {...line} />
        <rect x="145" y="79" width="30" height="28" rx="11" fill={`url(#${g.glass})`} {...line} />
        <path d="M129 89 h16" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M105 101 L116 84" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
        <path d="M151 101 L162 84" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
      </g>
    ),

    /* ---------- WORN: stethoscope, one clean symmetric drape ---------- */
    stethoscope: (
      <g fill="none" strokeLinecap="round">
        <path d="M102 112 C102 150 172 150 172 112" stroke={INK} strokeWidth="9" />
        <path d="M102 112 C102 150 172 150 172 112" stroke={`url(#${g.steel})`} strokeWidth="5" />
        <path d="M137 140 L137 157" stroke={INK} strokeWidth="9" />
        <path d="M137 140 L137 157" stroke={`url(#${g.steel})`} strokeWidth="5" />
        <circle cx="102" cy="110" r="6" fill={`url(#${g.steel})`} stroke={INK} strokeWidth="2.4" />
        <circle cx="172" cy="110" r="6" fill={`url(#${g.steel})`} stroke={INK} strokeWidth="2.4" />
        <circle cx="137" cy="169" r="12.5" fill={`url(#${g.steel})`} stroke={INK} strokeWidth="2.4" />
        <circle cx="137" cy="169" r="6" fill={`url(#${g.brand})`} stroke={INK} strokeWidth="1.6" />
        <path d="M129 163 A10 10 0 0 1 137 159" stroke="#fff" strokeWidth="2.6" opacity="0.9" />
      </g>
    ),

    /* ---------- briefcase: professional services ---------- */
    handshake: (
      <Companion>
        <path d="M25 14 C25 8 41 8 41 14 L41 20 L36 20 L36 15 C36 13 30 13 30 15 L30 20 L25 20 Z" fill={`url(#${g.deep})`} {...line} />
        <rect x="4" y="19" width="58" height="40" rx="7" fill={`url(#${g.brand})`} {...line} />
        <path d="M4 34 h58" stroke={INK} strokeWidth="2.4" />
        <rect x="26" y="29" width="14" height="10" rx="2.5" fill={`url(#${g.gold})`} {...line} />
        <path d="M10 25 C10 22 14 22 18 22" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />
      </Companion>
    ),

    /* ---------- delivery van: logistics ---------- */
    truck: (
      <Companion>
        <rect x="2" y="22" width="34" height="26" rx="5" fill={`url(#${g.brand})`} {...line} />
        <path d="M36 28 h13 l11 12 v8 h-24 Z" fill={`url(#${g.deep})`} {...line} />
        <path d="M40 31 h8 l7 8 h-15 Z" fill={`url(#${g.glass})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M2 44 h58" stroke={INK} strokeWidth="2.4" />
        <circle cx="16" cy="52" r="7.5" fill={INK} />
        <circle cx="16" cy="52" r="3" fill={`url(#${g.steel})`} />
        <circle cx="47" cy="52" r="7.5" fill={INK} />
        <circle cx="47" cy="52" r="3" fill={`url(#${g.steel})`} />
        <path d="M7 28 h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      </Companion>
    ),

    /* ---------- parcel: distribution ---------- */
    bags: (
      <Companion>
        <path d="M6 22 L33 12 L60 22 L33 32 Z" fill={`url(#${g.glass})`} {...line} />
        <path d="M6 22 v27 l27 10 V32 Z" fill={`url(#${g.brand})`} {...line} />
        <path d="M60 22 v27 l-27 10 V32 Z" fill={`url(#${g.deep})`} {...line} />
        <path d="M20 17 L47 27 v9 l-27 -10 Z" fill={`url(#${g.gold})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 26 v18" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.4" />
      </Companion>
    ),

    /* ---------- tower: real estate ---------- */
    building: (
      <Companion>
        <path d="M14 12 h30 l5 6 h-40 Z" fill={`url(#${g.deep})`} {...line} />
        <rect x="12" y="17" width="34" height="42" rx="4" fill={`url(#${g.brand})`} {...line} />
        <rect x="46" y="30" width="14" height="29" rx="3" fill={`url(#${g.deep})`} {...line} />
        <g fill="#fff" opacity="0.92">
          <rect x="18" y="23" width="8" height="8" rx="2" />
          <rect x="32" y="23" width="8" height="8" rx="2" />
          <rect x="18" y="36" width="8" height="8" rx="2" />
          <rect x="32" y="36" width="8" height="8" rx="2" />
          <rect x="50" y="36" width="6" height="7" rx="1.8" />
        </g>
        <rect x="24" y="47" width="12" height="12" rx="2" fill={`url(#${g.gold})`} {...line} />
        <path d="M16 22 v14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.4" />
      </Companion>
    ),

    /* ---------- cloche: hospitality ---------- */
    bell: (
      <Companion>
        <path d="M9 50 C9 22 57 22 57 50 Z" fill={`url(#${g.brand})`} {...line} />
        <path d="M9 50 C9 27 26 22 33 22 C23 27 19 36 19 50 Z" fill="#fff" opacity="0.28" />
        {/* the stem starts inside the dome, or the knob floats off it */}
        <rect x="29" y="22" width="8" height="10" rx="4" fill={`url(#${g.steel})`} {...line} />
        <circle cx="33" cy="19" r="5.5" fill={`url(#${g.gold})`} {...line} />
        <rect x="2" y="49" width="62" height="10" rx="5" fill={`url(#${g.steel})`} {...line} />
        <path d="M16 38 C18 32 24 29 29 29" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.75" fill="none" />
      </Companion>
    ),

    /* ---------- laptop: technology products ---------- */
    computer: (
      <Companion>
        <rect x="9" y="12" width="48" height="34" rx="4" fill={`url(#${g.deep})`} {...line} />
        <rect x="13.5" y="16.5" width="39" height="25" rx="2" fill={`url(#${g.glass})`} />
        <path d="M19 24 h16 M19 30 h24 M19 36 h12" stroke="#29abe2" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M2 46 h62 l-5 9 h-52 Z" fill={`url(#${g.steel})`} {...line} />
        <path d="M27 50 h12" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        <path d="M14 18 v20" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.35" />
      </Companion>
    ),
  };
}

export default function BlobWithAccessory({ accessory }: { accessory: AccessoryKey }) {
  /* the desktop and mobile copies both render, so every id needs its own
     suffix or the visible one points at a def inside a hidden svg */
  const uid = useId().replace(/:/g, "");
  const g: Grads = {
    gold: `g-gold-${uid}`, brand: `g-brand-${uid}`, deep: `g-deep-${uid}`,
    steel: `g-steel-${uid}`, glass: `g-glass-${uid}`,
  };
  const shadow = `propShadow-${uid}`;
  const art = build(g);

  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%" role="img" aria-hidden="true">
      <Defs g={g} />
      <defs>
        <filter id={shadow} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.2" floodColor="#0a1628" floodOpacity="0.2" />
        </filter>
      </defs>

      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        {/* The character is the real brand mark, not a redraw, so the shape is
            always exactly the logo. */}
        <image href="/img/brand/mark-ink.webp" x="34" y="44" width="172" height="115" preserveAspectRatio="xMidYMid meet" />

        <AnimatePresence mode="wait">
          <motion.g
            key={accessory}
            filter={`url(#${shadow})`}
            initial={{ opacity: 0, scale: 0.72, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.72, y: -8 }}
            transition={{ duration: 0.42, ease: [0.2, 1.3, 0.4, 1] }}
            style={{ transformOrigin: "120px 110px" }}
          >
            {art[accessory]}
          </motion.g>
        </AnimatePresence>
      </motion.g>
    </svg>
  );
}
