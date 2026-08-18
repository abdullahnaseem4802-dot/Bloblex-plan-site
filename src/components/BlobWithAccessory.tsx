"use client";
import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { AccessoryKey } from "@/content/sectors";

/* Accessories the blob wears, one per industry (whiteboard 3d).
   Drawn as solid shapes with a consistent weight and a soft shadow, so they
   read as objects sitting on the character rather than sketched outlines.
   Blob body is centred near (120, 100) in a 240 x 200 box. */

const INK = "#0a1628";
const GOLD = "#ffc93c";
const GOLD_DK = "#e8a613";
const STEEL = "#c9d6e4";
const STEEL_DK = "#8ba0b8";
const BRAND = "#29abe2";
const BRAND_DK = "#1274ab";

const ACCESSORY: Record<AccessoryKey, React.ReactNode> = {
  /* hard hat, sitting on the crown */
  helmet: (
    <g>
      <path d="M74 62 C74 30 166 30 166 62 Z" fill={GOLD} />
      <path d="M104 36 C104 33 136 33 136 36 L136 62 L104 62 Z" fill={GOLD_DK} opacity={0.55} />
      <rect x="58" y="60" width="124" height="13" rx="6.5" fill={GOLD} />
      <rect x="58" y="66" width="124" height="7" rx="3.5" fill={GOLD_DK} opacity={0.5} />
      <path d="M74 62 C74 30 166 30 166 62" fill="none" stroke={GOLD_DK} strokeWidth={2.5} opacity={0.6} />
    </g>
  ),

  /* safety glasses across the eyes */
  glasses: (
    <g>
      <rect x="70" y="88" width="100" height="30" rx="14" fill={BRAND} opacity={0.18} />
      <rect x="72" y="90" width="44" height="26" rx="12" fill="#d8f0fb" stroke={INK} strokeWidth={3} />
      <rect x="124" y="90" width="44" height="26" rx="12" fill="#d8f0fb" stroke={INK} strokeWidth={3} />
      <path d="M116 101 h8" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <path d="M72 95 L56 88 M168 95 L184 88" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
    </g>
  ),

  /* stethoscope hung low like a necklace, routed around the face rather
     than across it, chest piece dangling below */
  stethoscope: (
    <g fill="none" strokeLinecap="round">
      <path d="M76 114 C70 138 90 154 116 158" stroke={STEEL_DK} strokeWidth={7} />
      <path d="M178 108 C186 136 152 154 124 158" stroke={STEEL_DK} strokeWidth={7} />
      <path d="M76 114 C70 138 90 154 116 158" stroke={STEEL} strokeWidth={3.5} />
      <path d="M178 108 C186 136 152 154 124 158" stroke={STEEL} strokeWidth={3.5} />
      <circle cx="76" cy="113" r="5.5" fill={STEEL} stroke={STEEL_DK} strokeWidth={2} />
      <circle cx="178" cy="107" r="5.5" fill={STEEL} stroke={STEEL_DK} strokeWidth={2} />
      <path d="M120 158 C120 172 134 176 142 184" stroke={STEEL_DK} strokeWidth={7} />
      <path d="M120 158 C120 172 134 176 142 184" stroke={STEEL} strokeWidth={3.5} />
      <circle cx="148" cy="188" r="11" fill={STEEL} stroke={STEEL_DK} strokeWidth={3} />
      <circle cx="148" cy="188" r="5" fill={BRAND} stroke="none" />
    </g>
  ),

  /* two hands meeting */
  handshake: (
    <g>
      <rect x="140" y="146" width="46" height="18" rx="9" fill="#7fd4f5" stroke={INK} strokeWidth={2.5} />
      <rect x="168" y="146" width="46" height="18" rx="9" fill={BRAND} stroke={INK} strokeWidth={2.5} />
      <path d="M172 150 h10" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
    </g>
  ),

  /* delivery truck rolling underneath */
  truck: (
    <g>
      <rect x="62" y="150" width="62" height="34" rx="6" fill={BRAND} stroke={INK} strokeWidth={2.5} />
      <path d="M124 160 h24 l16 15 v9 h-40 Z" fill="#7fd4f5" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x="130" y="164" width="16" height="10" rx="2" fill="#d8f0fb" />
      <circle cx="84" cy="188" r="9" fill={INK} />
      <circle cx="84" cy="188" r="3.5" fill={STEEL} />
      <circle cx="146" cy="188" r="9" fill={INK} />
      <circle cx="146" cy="188" r="3.5" fill={STEEL} />
    </g>
  ),

  /* shopping bags */
  bags: (
    <g>
      <path d="M160 146 h40 l5 44 h-50 Z" fill={BRAND} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M170 146 c0 -12 20 -12 20 0" fill="none" stroke={INK} strokeWidth={2.5} />
      <path d="M142 156 h26 l4 34 h-34 Z" fill="#7fd4f5" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M149 156 c0 -9 14 -9 14 0" fill="none" stroke={INK} strokeWidth={2.5} />
    </g>
  ),

  /* a small building */
  building: (
    <g>
      <rect x="158" y="118" width="50" height="70" rx="4" fill="#7fd4f5" stroke={INK} strokeWidth={2.5} />
      <rect x="166" y="128" width="11" height="11" rx="2" fill="#fff" />
      <rect x="189" y="128" width="11" height="11" rx="2" fill="#fff" />
      <rect x="166" y="147" width="11" height="11" rx="2" fill="#fff" />
      <rect x="189" y="147" width="11" height="11" rx="2" fill="#fff" />
      <rect x="174" y="166" width="18" height="22" rx="2" fill={BRAND} stroke={INK} strokeWidth={2.5} />
    </g>
  ),

  /* reception bell */
  bell: (
    <g>
      <path d="M92 176 a30 26 0 0 1 60 0 Z" fill={BRAND} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M92 176 a30 26 0 0 1 22 -25 l0 25 Z" fill="#7fd4f5" opacity={0.7} />
      <rect x="82" y="176" width="80" height="11" rx="5.5" fill={STEEL} stroke={INK} strokeWidth={2.5} />
      <rect x="118" y="142" width="8" height="12" rx="4" fill={STEEL_DK} />
      <circle cx="122" cy="139" r="6" fill={STEEL} stroke={INK} strokeWidth={2.5} />
    </g>
  ),

  /* laptop beside the blob */
  computer: (
    <g>
      <rect x="152" y="124" width="58" height="40" rx="4" fill={BRAND_DK} stroke={INK} strokeWidth={2.5} />
      <rect x="158" y="130" width="46" height="28" rx="2" fill="#d8f0fb" />
      <path d="M166 138 h20 M166 145 h28" stroke={BRAND} strokeWidth={3} strokeLinecap="round" />
      <path d="M142 164 h78 l-6 10 h-66 Z" fill={STEEL} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  ),
};

export default function BlobWithAccessory({ accessory }: { accessory: AccessoryKey }) {
  /* the desktop and mobile copies both render, so the filter needs its own id
     or the visible one points at a filter inside a hidden svg */
  const shadow = `propShadow-${useId().replace(/[:]/g, "")}`;
  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%" role="img" aria-hidden="true">
      <defs>
        <filter id={shadow} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0a1628" floodOpacity="0.22" />
        </filter>
      </defs>

      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* The character is the real brand mark, not a redraw, so the shape is
            always exactly the logo. Placed so its eyes land where the props
            below expect them. */}
        <image href="/img/brand/mark-ink-sm.png" x="34" y="44" width="172" height="115" preserveAspectRatio="xMidYMid meet" />

        <AnimatePresence mode="wait">
          <motion.g
            key={accessory}
            filter={`url(#${shadow})`}
            initial={{ opacity: 0, scale: 0.7, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -6 }}
            transition={{ duration: 0.4, ease: [0.2, 1.3, 0.4, 1] }}
            style={{ transformOrigin: "120px 100px" }}
          >
            {ACCESSORY[accessory]}
          </motion.g>
        </AnimatePresence>
      </motion.g>
    </svg>
  );
}
