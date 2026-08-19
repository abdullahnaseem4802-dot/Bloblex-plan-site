"use client";
import { useId } from "react";

/* ---------------------------------------------------------------------------
   Made-up app icons.

   The client asked for logos rather than words, in the style of a phone home
   screen, and said the icon has to be understandable — so every one of these
   is paired with a small caption where it is used.

   They are invented marks, not anyone else's trademarks: each is a rounded
   tile with its own gradient, a soft inner light along the top edge and a
   drawn glyph, so it reads as a real product icon rather than clip art.
--------------------------------------------------------------------------- */

export type AppKey =
  | "crm" | "invoicing" | "estimating" | "portal" | "ai" | "automation"
  | "sheet" | "mail" | "chat" | "calendar" | "money" | "photos" | "contacts" | "quote"
  | "inventory" | "scheduling" | "quality" | "orders" | "payroll" | "docs";

type Spec = { from: string; to: string; glyph: (c: string) => React.ReactNode };

const W = "#ffffff";

const SPEC: Record<AppKey, Spec> = {
  crm: { from: "#3fb9f0", to: "#1274ab", glyph: (c) => (
    <g fill={c}>
      <circle cx="24" cy="19" r="6.4" />
      <path d="M11 41c0-6.8 5.9-10.4 13-10.4S37 34.2 37 41Z" />
      <circle cx="37.5" cy="17" r="4.2" opacity=".75" />
      <path d="M33 30.4c1.4-.5 2.9-.8 4.5-.8 5.2 0 8.5 2.6 8.5 7.4h-9.6c-.4-2.6-1.6-4.8-3.4-6.6Z" opacity=".75" />
    </g>
  )},
  invoicing: { from: "#4ad3a1", to: "#0f8f6a", glyph: (c) => (
    <g fill={c}>
      <path d="M13 8h22a3 3 0 0 1 3 3v30l-5-3.4-4.5 3.4-4.5-3.4-4.5 3.4L15 41l-2 1.4V11a3 3 0 0 1 3-3Z" opacity=".95" />
      <g fill="#0f8f6a">
        <rect x="18" y="16" width="15" height="2.8" rx="1.4" />
        <rect x="18" y="22" width="15" height="2.8" rx="1.4" />
        <rect x="18" y="28" width="9" height="2.8" rx="1.4" />
      </g>
    </g>
  )},
  estimating: { from: "#ffc65c", to: "#e08a12", glyph: (c) => (
    <g fill={c}>
      <rect x="10" y="9" width="28" height="30" rx="4" />
      <g fill="#e08a12">
        <rect x="14" y="13" width="20" height="6" rx="2" />
        <circle cx="17.5" cy="25" r="2.4" /><circle cx="24" cy="25" r="2.4" /><circle cx="30.5" cy="25" r="2.4" />
        <circle cx="17.5" cy="32" r="2.4" /><circle cx="24" cy="32" r="2.4" />
        <rect x="28" y="29.6" width="4.8" height="4.8" rx="2" />
      </g>
    </g>
  )},
  portal: { from: "#8f7bf5", to: "#5334c4", glyph: (c) => (
    <g fill={c}>
      <rect x="8" y="11" width="32" height="22" rx="3.4" />
      <rect x="16" y="35" width="16" height="3" rx="1.5" />
      <g fill="#5334c4">
        <circle cx="24" cy="19" r="3.6" />
        <path d="M17 28.5c0-3.4 3.2-5.2 7-5.2s7 1.8 7 5.2Z" />
      </g>
    </g>
  )},
  ai: { from: "#5ec8ff", to: "#1e5fd0", glyph: (c) => (
    <g fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 9v7M24 32v7M9 24h7M32 24h7M14 14l5 5M29 29l5 5M34 14l-5 5M19 29l-5 5" opacity=".6" />
      <circle cx="24" cy="24" r="8" fill={c} stroke="none" />
      <circle cx="24" cy="24" r="3.4" fill="#1e5fd0" stroke="none" />
    </g>
  )},
  automation: { from: "#ff9a6c", to: "#e0541f", glyph: (c) => (
    <g fill={c}>
      <path d="M26.5 7 14 26h8l-1.5 15L34 22h-8Z" />
    </g>
  )},
  sheet: { from: "#4fd07f", to: "#127a42", glyph: (c) => (
    <g fill={c}>
      <rect x="9" y="10" width="30" height="28" rx="3.6" />
      <g fill="#127a42">
        <rect x="9" y="10" width="30" height="7" rx="3.6" />
        <rect x="13" y="21" width="10" height="4" rx="1.4" /><rect x="25" y="21" width="10" height="4" rx="1.4" />
        <rect x="13" y="28" width="10" height="4" rx="1.4" /><rect x="25" y="28" width="10" height="4" rx="1.4" />
      </g>
    </g>
  )},
  mail: { from: "#ff8f85", to: "#c4392f", glyph: (c) => (
    <g>
      <rect x="8" y="13" width="32" height="22" rx="3.6" fill={c} />
      <path d="M10.5 16 24 27l13.5-11" fill="none" stroke="#c4392f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )},
  chat: { from: "#5fe08a", to: "#159a4d", glyph: (c) => (
    <path d="M10 16a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H22l-8 6v-6a4 4 0 0 1-4-4Z" fill={c} />
  )},
  calendar: { from: "#6aa9f5", to: "#1b52a8", glyph: (c) => (
    <g>
      <rect x="9" y="12" width="30" height="27" rx="3.6" fill={c} />
      <rect x="9" y="12" width="30" height="8" rx="3.6" fill="#1b52a8" />
      <rect x="15" y="8" width="3.6" height="8" rx="1.8" fill="#1b52a8" />
      <rect x="29.4" y="8" width="3.6" height="8" rx="1.8" fill="#1b52a8" />
      <g fill="#1b52a8"><rect x="14" y="25" width="6" height="5" rx="1.6" /><rect x="23" y="25" width="6" height="5" rx="1.6" opacity=".45" /><rect x="32" y="25" width="4" height="5" rx="1.6" opacity=".45" /></g>
    </g>
  )},
  money: { from: "#59dcbc", to: "#0d7f6a", glyph: (c) => (
    <g fill={c}>
      <path d="M26 10v3.4c3.6.5 6.3 2.1 7.9 4.4l-4.3 3.4c-1.2-1.6-3.2-2.5-5.6-2.5-2.4 0-3.9 1-3.9 2.4 0 1.6 1.6 2.1 5.2 2.9 5.2 1.1 9 2.7 9 7.6 0 4.1-3 6.7-8.3 7.4V42h-4.8v-3c-4.1-.5-7.3-2.2-9.2-4.8l4.5-3.6c1.5 1.9 3.9 3 6.7 3 2.8 0 4.3-.9 4.3-2.4 0-1.5-1.5-2-5.4-2.8-4.9-1.1-8.8-2.6-8.8-7.3 0-3.9 2.8-6.5 8-7.3V10Z" />
    </g>
  )},
  photos: { from: "#c78bf7", to: "#6b2fb5", glyph: (c) => (
    <g>
      <rect x="9" y="12" width="30" height="24" rx="3.6" fill={c} />
      <circle cx="17" cy="20" r="3.2" fill="#ffd166" />
      <path d="M12 34l8.5-9.5 6 6.4 4.6-5L37 34Z" fill="#6b2fb5" />
    </g>
  )},
  contacts: { from: "#ffb26b", to: "#d1691a", glyph: (c) => (
    <g fill={c}>
      <circle cx="24" cy="19" r="6.4" />
      <path d="M11 40c0-6.8 5.9-10.4 13-10.4S37 33.2 37 40Z" />
    </g>
  )},
  quote: { from: "#a9b7c9", to: "#4a5568", glyph: (c) => (
    <g>
      <path d="M14 8h13l9 9v23a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z" fill={c} />
      <path d="M27 8l9 9h-9Z" fill="#4a5568" opacity=".5" />
      <g fill="#4a5568"><rect x="16" y="22" width="15" height="2.8" rx="1.4" /><rect x="16" y="28" width="15" height="2.8" rx="1.4" /><rect x="16" y="34" width="9" height="2.8" rx="1.4" /></g>
    </g>
  )},
  inventory: { from: "#ffcf70", to: "#c08415", glyph: (c) => (
    <g fill={c}>
      <path d="M24 8l14 7-14 7-14-7Z" />
      <path d="M10 18l13 6.5V40L10 33.5Z" opacity=".85" />
      <path d="M38 18l-13 6.5V40l13-6.5Z" opacity=".6" />
    </g>
  )},
  scheduling: { from: "#7fd4f5", to: "#1b78b8", glyph: (c) => (
    <g>
      <circle cx="24" cy="24" r="15" fill={c} />
      <path d="M24 14v10.5l7 4" fill="none" stroke="#1b78b8" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )},
  quality: { from: "#6be3a4", to: "#0f8f5a", glyph: (c) => (
    <g>
      <path d="M24 7l14 5v12c0 9-6 14.5-14 17-8-2.5-14-8-14-17V12Z" fill={c} />
      <path d="M17 24l5 5 9-10" fill="none" stroke="#0f8f5a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )},
  orders: { from: "#9fb6ff", to: "#3b48c4", glyph: (c) => (
    <g fill={c}>
      <path d="M11 12h5l4.5 18h16l3.5-12H21" fill="none" stroke={c} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="37" r="3.2" /><circle cx="34" cy="37" r="3.2" />
    </g>
  )},
  payroll: { from: "#8fe0c4", to: "#137f63", glyph: (c) => (
    <g>
      <rect x="8" y="14" width="32" height="20" rx="3.4" fill={c} />
      <circle cx="24" cy="24" r="5.4" fill="#137f63" />
      <rect x="12" y="18" width="4" height="12" rx="2" fill="#137f63" opacity=".5" />
      <rect x="32" y="18" width="4" height="12" rx="2" fill="#137f63" opacity=".5" />
    </g>
  )},
  docs: { from: "#bcd2e8", to: "#3f5670", glyph: (c) => (
    <g>
      <rect x="12" y="8" width="24" height="32" rx="3.4" fill={c} />
      <g fill="#3f5670"><rect x="17" y="16" width="14" height="2.8" rx="1.4" /><rect x="17" y="22" width="14" height="2.8" rx="1.4" /><rect x="17" y="28" width="8" height="2.8" rx="1.4" /></g>
    </g>
  )},
};

/** The tile on its own. */
export default function AppIcon({ app, size = 44 }: { app: AppKey; size?: number }) {
  const s = SPEC[app];
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.from} />
          <stop offset="100%" stopColor={s.to} />
        </linearGradient>
        {/* the sheen along the top edge that makes a tile read as an app icon */}
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity=".38" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#g${id})`} />
      <rect width="48" height="48" rx="12" fill={`url(#s${id})`} />
      {s.glyph(W)}
      <rect x=".6" y=".6" width="46.8" height="46.8" rx="11.6" fill="none" stroke="#fff" strokeOpacity=".28" />
    </svg>
  );
}

/** Tile plus the small caption the client asked for, so the icon is never
 *  left to be guessed at. */
export function AppTile({
  app, label, size = 44, dark, className = "",
}: { app: AppKey; label: string; size?: number; dark?: boolean; className?: string }) {
  return (
    <span className={`flex flex-col items-center gap-1.5 ${className}`}>
      <span
        className="rounded-[12px]"
        style={{ boxShadow: dark ? "0 10px 26px -8px rgba(0,0,0,.55)" : "0 10px 24px -10px rgba(10,22,40,.45)" }}
      >
        <AppIcon app={app} size={size} />
      </span>
      <span
        className={`whitespace-nowrap text-[0.6rem] font-semibold tracking-[0.01em] ${
          dark ? "text-white/85" : "text-[var(--color-slate)]"
        }`}
      >
        {label}
      </span>
    </span>
  );
}
