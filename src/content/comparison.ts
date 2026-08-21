/* =================================================================
   SIDE-BY-SIDE COMPARISON
   Client direction (Aug 2026), verbatim:
     "It has to be clear: YOU RIGHT NOW vs WHAT WE WILL BUILD YOU,
      side by side comparison. People scan, they don't read. They gotta
      understand in 3 seconds. I said logos not text. People won't click
      'leur solution' — who are we talking about?"

   So: no tabs, no clicking, both sides visible at once, app tiles instead
   of word pills, and the middle state ("their solution") is gone because
   nobody knew who "they" were.
   French is the client's own informal wording ("tu"), and speaks as "on",
   never "je".
   ================================================================= */
import type { Locale } from "./site";
import type { AppKey } from "@/components/AppIcon";

/** The same eight tools appear on both sides. Only the wiring changes. */
export const TOOLS: AppKey[] = [
  "sheet", "mail", "chat", "calendar",
  "money", "photos", "contacts", "quote",
];

/** Scattered placement for the "right now" side, in % of the stage. */
/* Kept inside 22..78 across and 20..78 down: an icon is centred on its point,
   so anything nearer the edge than half an icon hangs out of the frame, which
   is exactly what happened on a phone where the frame is barely 290px wide. */
export const LOOSE: { x: number; y: number; r: number }[] = [
  { x: 24, y: 20, r: -12 }, { x: 52, y: 22, r: 8 },
  { x: 76, y: 21, r: 14 }, { x: 26, y: 49, r: 6 },
  { x: 74, y: 50, r: -9 }, { x: 24, y: 77, r: 11 },
  { x: 50, y: 76, r: -6 }, { x: 76, y: 77, r: 7 },
];

/** Even ring for the "what we build" side. */
export const RING: { x: number; y: number }[] = [
  { x: 50, y: 12 }, { x: 79, y: 24 }, { x: 88, y: 50 }, { x: 79, y: 76 },
  { x: 50, y: 88 }, { x: 21, y: 76 }, { x: 12, y: 50 }, { x: 21, y: 24 },
];

export type Side = {
  /** the big scannable label above the picture */
  label: string;
  headline: string;
  /** three short scannable lines, never a paragraph */
  points: string[];
  /** the one number that carries the argument */
  statValue: string;
  statLabel: string;
  /** caption under the picture */
  caption: string;
};

export type ComparisonCopy = {
  kicker: string;
  title: string;
  lead: string;
  left: Side;
  right: Side;
  centerTitle: string;
  /** the arrow between the two panels */
  bridge: string;
};

export const COMPARISON: Record<Locale, ComparisonCopy> = {
  fr: {
    kicker: "La différence, en trois secondes",
    title: "Toi maintenant. Toi avec ton système.",
    lead: "Les mêmes outils des deux bords. Seul le câblage change.",
    left: {
      label: "TOI, MAINTENANT",
      headline: "Rien ne se parle.",
      points: [
        "La même donnée tapée 4 fois",
        "Chaque copier-coller peut se tromper",
        "Rien ne se retrouve au bon endroit",
      ],
      statValue: "8 h 05",
      statLabel: "pour une seule demande",
      caption: "chacun de son bord",
    },
    right: {
      label: "CE QU'ON TE BÂTIT",
      headline: "Un seul système. À toi.",
      points: [
        "La donnée est entrée 1 fois",
        "Tout se parle, tout suit",
        "Tu le possèdes, c'est un actif",
      ],
      statValue: "12 min",
      statLabel: "pour la même demande",
      caption: "un seul système",
    },
    centerTitle: "TON SYSTÈME",
    bridge: "ON LE BÂTIT",
  },

  en: {
    kicker: "The difference, in three seconds",
    title: "You right now. You with your system.",
    lead: "The same tools on both sides. Only the wiring changes.",
    left: {
      label: "YOU RIGHT NOW",
      headline: "Nothing talks.",
      points: [
        "The same data typed 4 times",
        "Every copy-paste can go wrong",
        "Nothing ends up where you need it",
      ],
      statValue: "8 h 05",
      statLabel: "for one single request",
      caption: "each on its own",
    },
    right: {
      label: "WHAT WE BUILD YOU",
      headline: "One system. Yours.",
      points: [
        "Data is entered once",
        "Everything talks, everything follows",
        "You own it — it's an asset",
      ],
      statValue: "12 min",
      statLabel: "for the same request",
      caption: "one single system",
    },
    centerTitle: "YOUR SYSTEM",
    bridge: "WE BUILD IT",
  },
};
