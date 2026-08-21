"use client";
import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { AccessoryKey } from "@/content/sectors";

/* One prop per industry, worn by the brand mark.

   Every prop is a set-down object: drawn in its own 66x66 box, standing on a
   common baseline with a contact shadow. Worn props were tried first and did
   not survive review - a hat, glasses and a stethoscope sit on top of the
   face, so they either hide an eye or hover above the crown, and no amount of
   nudging fixes that. As objects they read as the industry's own sign, which
   is what the reference pictograms do, and the character stays untouched.

   Every object is built the same way: an ink outline at 2.4, a lit face, a
   shaded underside, and one white highlight. That shared recipe is what makes
   a flat vector look expensive.

   The mark is drawn at x34 y44, 172 x 115, so the character occupies
   x 34..206 and its baseline is y ~159. */

const INK = "#0a1628";
const COMPANION = { x: 157, y: 109, size: 66 };   // where a set-down object lives

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
function Companion({ scale = 1, children }: { scale?: number; children: React.ReactNode }) {
  /* scaling about the baseline keeps every prop standing on the same line */
  const base = COMPANION.y + 63;
  const x = COMPANION.x + 33 - 33 * scale;
  return (
    <g transform={`translate(${x} ${base - 63 * scale}) scale(${scale})`}>
      <ellipse cx="33" cy="63" rx="27" ry="4.5" fill={INK} opacity="0.13" />
      {children}
    </g>
  );
}

function build(g: Grads): Record<AccessoryKey, React.ReactNode> {
  const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  return {
    /* ---------- tower crane over a rising building: construction ----------
       The reference is the site, not a worker. Built tall on purpose: the
       mast and jib give it a silhouette nothing else on the page has, which
       is what makes it readable at this size. The jib starts well right of
       centre so it never reaches across the character's face. */
    helmet: (
      <Companion scale={1.15}>
        {/* building: finished floors below, open slab and rebar on top */}
        <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M11 21 v-4 M15 21 v-5 M19 21 v-4 M23 21 v-5 M27 21 v-4 M31 21 v-5 M35 21 v-4" strokeLinecap="round" />
          <rect x="8" y="21" width="30" height="4" rx="0.8" fill={`url(#${g.deep})`} />
          <rect x="8" y="25" width="30" height="34" rx="1" fill={`url(#${g.brand})`} />
        </g>
        <g fill="#fff" opacity="0.9">
          {[28, 36, 44, 52].map((y) =>
            [11, 18, 25, 32].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="4.6" height="4.6" rx="0.8" />)
          )}
        </g>
        <path d="M8 33.5 h30 M8 41.5 h30 M8 49.5 h30" stroke={INK} strokeWidth="1.2" opacity="0.55" />

        {/* crane: mast, then the A-frame ties, jib and counterweight */}
        <rect x="45" y="12" width="7.5" height="47" rx="1" fill={`url(#${g.steel})`} stroke={INK} strokeWidth="1.8" />
        <path d="M45 22 h7.5 M45 32 h7.5 M45 42 h7.5 M45 52 h7.5" stroke={INK} strokeWidth="1.1" opacity="0.5" />
        <path d="M48.7 3 L20 11 M48.7 3 L60 11" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="12" y="11" width="42" height="4.6" rx="1" fill={`url(#${g.deep})`} stroke={INK} strokeWidth="1.6" />
        <path d="M14 15.6 L18 11 L22 15.6 L26 11 L30 15.6 L34 11 L38 15.6 L42 11" fill="none" stroke={INK} strokeWidth="1.1" opacity="0.55" />
        <rect x="53" y="11" width="8.5" height="4.6" rx="1" fill={`url(#${g.deep})`} stroke={INK} strokeWidth="1.6" />
        <rect x="54.2" y="16" width="7.2" height="9" rx="1" fill={INK} />

        {/* hoist rope and hook, hanging over the open floor */}
        <path d="M21 15.6 V27" stroke={INK} strokeWidth="1.3" />
        <rect x="18.4" y="27" width="5.4" height="3.6" rx="1" fill={`url(#${g.gold})`} stroke={INK} strokeWidth="1.4" />
      </Companion>
    ),

    /* ---------- factory: manufacturing ---------- */
    glasses: (
      <Companion>
        <rect x="44" y="18" width="15" height="41" rx="3" fill={`url(#${g.deep})`} {...line} />
        <rect x="47.5" y="9" width="8" height="9" rx="2.5" fill={`url(#${g.steel})`} {...line} />
        <path d="M4 59 V40 L18 30 V40 L32 30 V40 L46 30 V59 Z" fill={`url(#${g.brand})`} {...line} />
        <g fill="#fff" opacity="0.9">
          <rect x="9" y="45" width="7" height="7" rx="1.6" />
          <rect x="23" y="45" width="7" height="7" rx="1.6" />
          <rect x="37" y="45" width="7" height="7" rx="1.6" />
          <rect x="48.5" y="26" width="6" height="6" rx="1.6" />
          <rect x="48.5" y="38" width="6" height="6" rx="1.6" />
        </g>
        <path d="M7 42 L18 34" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.4" />
      </Companion>
    ),

    /* ---------- first aid case: healthcare ---------- */
    stethoscope: (
      <Companion>
        {/* the cross has to dominate, or at this size the case is just the
            briefcase from professional services in another colour */}
        <path d="M26 22 v-4 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 v4 Z" fill={`url(#${g.deep})`} {...line} />
        <rect x="5" y="21" width="56" height="38" rx="8" fill="#f4f8fc" {...line} />
        {/* one path, not two crossed rectangles: their outlines would run
            straight through the middle of the cross */}
        <path d="M27 27 H39 V34 H46 V46 H39 V53 H27 V46 H20 V34 H27 Z" fill={`url(#${g.brand})`} {...line} />
        <path d="M11 27 C11 25 13 24 16 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      </Companion>
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
    /* ---------- cloche: hospitality ----------
       The reference board is this shape over and over. A serving hand was
       tried underneath and collapsed into a dark wedge at 55px, so the
       platter carries it alone, with the steam that makes it read as service
       rather than as a bell. Tall dome, narrow tray: a wide flat one reads
       as a flying saucer. */
    bell: (
      <Companion scale={1.14}>
        <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <path d="M24 14 C20.5 10.5 27.5 8.5 24 5" />
          <path d="M33 11 C29.5 7.5 36.5 5.5 33 2" />
          <path d="M42 14 C38.5 10.5 45.5 8.5 42 5" />
        </g>
        <circle cx="33" cy="18" r="3.9" fill={`url(#${g.gold})`} {...line} />
        <rect x="30.7" y="20" width="4.6" height="5" rx="2.3" fill={`url(#${g.steel})`} {...line} />
        <path d="M16 43 C16 9 50 9 50 43 Z" fill={`url(#${g.brand})`} {...line} />
        <path d="M16 43 C16 18 26 11 33 10 C25 16 22 28 22 43 Z" fill="#fff" opacity="0.24" />
        <path d="M21 38 C21.5 27 25 20 29 17" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="33" cy="47" rx="25" ry="4.2" fill="#8ea6bd" {...line} />
        <ellipse cx="33" cy="43.5" rx="25" ry="4.2" fill={`url(#${g.steel})`} {...line} />
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
