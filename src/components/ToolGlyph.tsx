/* App tiles for the comparison picture.
   The client asked for logos rather than text: these are drawn as the kind of
   coloured app tile people recognise from their own phone, so the panel reads
   as "your apps" at a glance without shipping anyone else's trademark. */

export type ToolKey =
  | "sheet" | "mail" | "chat" | "calendar"
  | "money" | "photos" | "contacts" | "quote";

const TILE: Record<ToolKey, { bg: string; glyph: React.ReactNode }> = {
  /* spreadsheet */
  sheet: {
    bg: "#1d8a4e",
    glyph: (
      <g fill="#fff">
        <rect x="7" y="8" width="18" height="16" rx="2" opacity=".35" />
        <rect x="7" y="8" width="18" height="4" rx="1.6" />
        <rect x="7" y="14" width="8" height="3" />
        <rect x="17" y="14" width="8" height="3" />
        <rect x="7" y="19" width="8" height="3" />
        <rect x="17" y="19" width="8" height="3" />
      </g>
    ),
  },
  /* email */
  mail: {
    bg: "#c4392f",
    glyph: (
      <g fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round">
        <rect x="6" y="9" width="20" height="14" rx="2.5" fill="#fff" stroke="none" />
        <path d="M7.5 11 L16 18 L24.5 11" stroke="#c4392f" />
      </g>
    ),
  },
  /* text messages */
  chat: {
    bg: "#2fae5a",
    glyph: (
      <g fill="#fff">
        <path d="M7 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H9a2 2 0 0 1-2-2Z" />
      </g>
    ),
  },
  /* schedule */
  calendar: {
    bg: "#2f6fd0",
    glyph: (
      <g>
        <rect x="6" y="9" width="20" height="17" rx="2.5" fill="#fff" />
        <rect x="6" y="9" width="20" height="5" rx="2.5" fill="#1b4f9c" />
        <rect x="10" y="7" width="2.6" height="5" rx="1.3" fill="#1b4f9c" />
        <rect x="19.4" y="7" width="2.6" height="5" rx="1.3" fill="#1b4f9c" />
        <rect x="9" y="17" width="4" height="4" rx="1" fill="#2f6fd0" />
        <rect x="15" y="17" width="4" height="4" rx="1" fill="#9db8e0" />
        <rect x="21" y="17" width="3" height="4" rx="1" fill="#9db8e0" />
      </g>
    ),
  },
  /* accounting */
  money: {
    bg: "#0f8f7a",
    glyph: (
      <g fill="#fff">
        <circle cx="16" cy="16" r="9" opacity=".28" />
        <path d="M17.4 9.5v1.6c1.7.2 3 .9 3.7 1.8l-2 1.7c-.6-.7-1.5-1.1-2.6-1.1-1.1 0-1.8.4-1.8 1 0 .7.7.9 2.4 1.3 2.4.5 4.2 1.2 4.2 3.5 0 1.9-1.4 3.1-3.9 3.4v1.8h-2.2v-1.8c-1.9-.2-3.4-1-4.3-2.2l2.1-1.7c.7.9 1.8 1.4 3.1 1.4 1.3 0 2-.4 2-1.1 0-.7-.7-.9-2.5-1.3-2.3-.5-4.1-1.2-4.1-3.4 0-1.8 1.3-3 3.7-3.4V9.5Z" />
      </g>
    ),
  },
  /* job photos */
  photos: {
    bg: "#7b4cc4",
    glyph: (
      <g>
        <rect x="6" y="9" width="20" height="15" rx="2.5" fill="#fff" />
        <circle cx="11.5" cy="14" r="2.2" fill="#f2b134" />
        <path d="M8 22l5.5-6 4 4.2 3-3.2L24 22Z" fill="#7b4cc4" />
      </g>
    ),
  },
  /* clients */
  contacts: {
    bg: "#e07a1f",
    glyph: (
      <g fill="#fff">
        <circle cx="16" cy="13" r="4.2" />
        <path d="M7.5 25c0-4.4 3.8-6.8 8.5-6.8s8.5 2.4 8.5 6.8Z" />
      </g>
    ),
  },
  /* quotes */
  quote: {
    bg: "#4a5568",
    glyph: (
      <g>
        <path d="M9 6.5h10L24 12v13.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 8 25.5V8A1.5 1.5 0 0 1 9.5 6.5Z" fill="#fff" />
        <path d="M19 6.5 24 12h-5Z" fill="#cbd5e0" />
        <g fill="#4a5568">
          <rect x="11" y="15" width="10" height="1.9" rx=".9" />
          <rect x="11" y="19" width="10" height="1.9" rx=".9" />
          <rect x="11" y="23" width="6" height="1.9" rx=".9" />
        </g>
      </g>
    ),
  },
};

export default function ToolGlyph({ tool, size = 34 }: { tool: ToolKey; size?: number }) {
  const t = TILE[tool];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={t.bg} />
      {t.glyph}
    </svg>
  );
}
