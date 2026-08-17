"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "@/content/countries";

/** Phone input with a searchable country-code dropdown (flag + dial code). */
export default function PhoneField({
  value, onChange, onBlur, country, onCountryChange, invalid, placeholder, searchPlaceholder, id = "phone",
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  country: Country;
  onCountryChange: (c: Country) => void;
  invalid?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc); };
  }, []);

  useEffect(() => { if (open) searchRef.current?.focus(); }, [open]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COUNTRIES;
    return COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(s) || c.dial.includes(s) || c.iso.toLowerCase() === s
    );
  }, [q]);

  return (
    <div ref={wrap} className="relative">
      <div className={`flex items-stretch overflow-hidden rounded-[var(--radius)] border bg-white transition-all ${
        invalid ? "border-red-400 ring-4 ring-red-100" : "border-[var(--color-line)] focus-within:border-[var(--color-brand-400)] focus-within:ring-4 focus-within:ring-[rgba(41,171,226,.12)]"
      }`}>
        <button
          type="button" onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox" aria-expanded={open} aria-label="Select country code"
          className="flex shrink-0 items-center gap-1.5 border-r border-[var(--color-line)] bg-[var(--color-panel)] px-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-50)]"
        >
          <span className={`fi fi-${country.iso.toLowerCase()} rounded-[2px] shadow-[0_0_0_1px_rgba(10,22,40,.08)]`} style={{ width: 20, height: 15 }} />
          <span>{country.dial}</span>
          <span aria-hidden className="text-[10px] text-[var(--color-mute)]">▾</span>
        </button>
        <input
          id={id} name="phone" type="tel" inputMode="tel" autoComplete="tel-national"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s().-]/g, ""))}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent px-4 py-3 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-mute)]"
        />
      </div>

      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)]">
          <div className="border-b border-[var(--color-line)] p-2">
            <input
              ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder ?? "Search country"}
              className="w-full rounded-[var(--radius-sm)] bg-[var(--color-panel)] px-3 py-2 text-sm outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {list.map((c) => (
              <li key={`${c.iso}${c.dial}`}>
                <button
                  type="button" role="option" aria-selected={c.iso === country.iso}
                  onClick={() => { onCountryChange(c); setOpen(false); setQ(""); }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                    c.iso === country.iso ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]" : "hover:bg-[var(--color-panel)]"
                  }`}
                >
                  <span className={`fi fi-${c.iso.toLowerCase()} shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(10,22,40,.08)]`} style={{ width: 20, height: 15 }} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-[var(--color-mute)]">{c.dial}</span>
                </button>
              </li>
            ))}
            {!list.length && <li className="px-3 py-4 text-center text-sm text-[var(--color-mute)]">No match</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export { DEFAULT_COUNTRY };
