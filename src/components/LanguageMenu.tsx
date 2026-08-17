"use client";
import { useEffect, useRef, useState } from "react";
import { type Locale } from "@/content/site";

const LABELS: Record<Locale, string> = { en: "English", fr: "Français" };

function Globe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}

/** alt = equivalent URL of the current page in each locale. */
export default function LanguageMenu({ locale, alt, dark = false }: { locale: Locale; alt: { en: string; fr: string }; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const langs: Locale[] = ["en", "fr"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox" aria-expanded={open} aria-label="Change language"
        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${dark ? "text-white/85 hover:text-white" : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"}`}
      >
        <Globe /> {locale.toUpperCase()} <span aria-hidden className="text-[10px]">▾</span>
      </button>
      {open && (
        <ul role="listbox" aria-label="Language"
          className="absolute right-0 mt-2 w-40 rounded-[var(--radius)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)] p-1.5 z-50">
          {langs.map((code) => {
            const on = code === locale;
            return (
              <li key={code}>
                <a href={alt[code]} role="option" aria-selected={on}
                  className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                    on ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]" : "text-[var(--color-ink-soft)] hover:bg-[var(--color-panel)]"
                  }`}>
                  {LABELS[code]}
                  {on && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
