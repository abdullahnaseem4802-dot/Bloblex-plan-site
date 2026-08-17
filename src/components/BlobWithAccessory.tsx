"use client";
import { AnimatePresence, motion } from "motion/react";
import type { AccessoryKey } from "@/content/sectors";

/* Themed accessories on the blob (whiteboard 3d). Blob centered ~ (120,100). */
const ACCESSORY: Record<AccessoryKey, React.ReactNode> = {
  helmet: (
    <g stroke="#0a1628" strokeWidth={3} strokeLinejoin="round">
      <path d="M70 60 Q120 20 170 60 Z" fill="#ffd23f" />
      <rect x="58" y="56" width="124" height="11" rx="5.5" fill="#ffd23f" />
      <path d="M120 26 V56" stroke="#f0a500" strokeWidth={5} strokeLinecap="round" />
      <path d="M96 40 V56 M144 40 V56" stroke="#f0a500" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  glasses: (
    <g stroke="#0a1628" strokeWidth={4} fill="none" strokeLinecap="round">
      <rect x="76" y="90" width="36" height="28" rx="9" fill="#bfe9fb" fillOpacity={0.75} />
      <rect x="128" y="90" width="36" height="28" rx="9" fill="#bfe9fb" fillOpacity={0.75} />
      <path d="M112 102 h16" />
      <path d="M76 96 l-14 -7" />
      <path d="M164 96 l14 -7" />
    </g>
  ),
  stethoscope: (
    <g stroke="#0a1628" strokeWidth={4} fill="none" strokeLinecap="round">
      {/* ear tubes draping over the head, forming a Y */}
      <path d="M92 70 C 88 92 104 104 116 112" />
      <path d="M150 70 C 154 92 138 104 126 112" />
      <circle cx="92" cy="68" r="4" fill="#0a1628" />
      <circle cx="150" cy="68" r="4" fill="#0a1628" />
      {/* tube down to the chest piece */}
      <path d="M121 112 C 121 138 106 158 130 166" />
      <circle cx="135" cy="170" r="11" fill="#29abe2" />
      <circle cx="135" cy="170" r="5" fill="#0a1628" stroke="none" />
    </g>
  ),
  handshake: (
    <g stroke="#0a1628" strokeWidth={3} strokeLinejoin="round">
      <rect x="146" y="150" width="42" height="16" rx="8" fill="#7fd4f5" />
      <rect x="168" y="150" width="42" height="16" rx="8" fill="#29abe2" />
    </g>
  ),
  truck: (
    <g stroke="#0a1628" strokeWidth={3} strokeLinejoin="round">
      <rect x="66" y="156" width="58" height="30" rx="5" fill="#29abe2" />
      <path d="M124 164 h24 l14 14 v8 h-38 Z" fill="#7fd4f5" />
      <circle cx="86" cy="190" r="9" fill="#0a1628" />
      <circle cx="146" cy="190" r="9" fill="#0a1628" />
    </g>
  ),
  bags: (
    <g stroke="#0a1628" strokeWidth={3} strokeLinejoin="round">
      <path d="M166 138 h34 l6 46 h-46 Z" fill="#29abe2" />
      <path d="M176 138 c0 -11 14 -11 14 0" fill="none" />
      <path d="M150 150 h22 l4 34 h-30 Z" fill="#7fd4f5" />
    </g>
  ),
  building: (
    <g stroke="#0a1628" strokeWidth={3} strokeLinejoin="round">
      <rect x="164" y="118" width="46" height="68" fill="#7fd4f5" />
      <rect x="172" y="128" width="10" height="10" fill="#fff" />
      <rect x="192" y="128" width="10" height="10" fill="#fff" />
      <rect x="172" y="146" width="10" height="10" fill="#fff" />
      <rect x="192" y="146" width="10" height="10" fill="#fff" />
      <rect x="180" y="166" width="14" height="20" fill="#29abe2" />
    </g>
  ),
  bell: (
    <g stroke="#0a1628" strokeWidth={3} strokeLinejoin="round">
      {/* service / reception bell */}
      <path d="M92 178 a30 24 0 0 1 60 0 Z" fill="#29abe2" />
      <rect x="84" y="178" width="76" height="9" rx="4.5" fill="#7fd4f5" />
      <rect x="118" y="142" width="8" height="12" rx="4" fill="#0a1628" stroke="none" />
      <circle cx="122" cy="140" r="5" fill="#0a1628" stroke="none" />
    </g>
  ),
  computer: (
    <g stroke="#0a1628" strokeWidth={3} strokeLinejoin="round">
      <rect x="160" y="126" width="54" height="36" rx="3" fill="#29abe2" />
      <rect x="168" y="134" width="38" height="20" rx="2" fill="#bfe9fb" />
      <rect x="152" y="162" width="70" height="9" rx="3" fill="#0a1628" />
    </g>
  ),
};

export default function BlobWithAccessory({ accessory }: { accessory: AccessoryKey }) {
  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="swBlob" cx="42%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#8ddaf7" />
          <stop offset="52%" stopColor="#29abe2" />
          <stop offset="100%" stopColor="#1274ab" />
        </radialGradient>
      </defs>

      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path fill="url(#swBlob)" d="M120 30C82 30 40 50 40 102c0 38 34 58 80 58s80-20 80-58C200 50 158 30 120 30Z" />
        <ellipse cx="94" cy="66" rx="26" ry="13" fill="#fff" opacity={0.22} />
        <circle cx="98" cy="104" r="10" fill="#0a1628" />
        <circle cx="142" cy="104" r="10" fill="#0a1628" />
        <circle cx="94.6" cy="100.6" r="3.3" fill="#fff" />
        <circle cx="138.6" cy="100.6" r="3.3" fill="#fff" />

        <AnimatePresence mode="wait">
          <motion.g
            key={accessory}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ transformOrigin: "120px 100px" }}
          >
            {ACCESSORY[accessory]}
          </motion.g>
        </AnimatePresence>
      </motion.g>
    </svg>
  );
}
