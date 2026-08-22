"use client";
import { useState } from "react";
import { motion } from "motion/react";
import PhoneField from "./PhoneField";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "@/content/countries";
import { CONTENT, type Locale } from "@/content/site";

type Status = "idle" | "sending" | "ok" | "error";
type Field = "name" | "email" | "phone" | "message";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const digits = (s: string) => s.replace(/\D/g, "");

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[0.82rem] font-semibold tracking-wide text-[var(--color-ink)]">
      {children}
    </label>
  );
}

function Err({ show, msg }: { show: boolean; msg: string }) {
  if (!show) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm font-medium text-red-600">
      {msg}
    </motion.p>
  );
}

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = CONTENT[locale].contact;
  const [status, setStatus] = useState<Status>("idle");
  const [reason, setReason] = useState(t.reasons[0]);
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.iso === DEFAULT_COUNTRY) ?? COUNTRIES[0]
  );
  const [v, setV] = useState({ name: "", email: "", phone: "", message: "" });
  const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, email: false, phone: false, message: false });

  const errors: Record<Field, string> = {
    name: v.name.trim().length < 2 ? t.errName : "",
    email: EMAIL_RE.test(v.email.trim()) ? "" : t.errEmail,
    phone: digits(v.phone).length >= 6 && digits(v.phone).length <= 15 ? "" : t.errPhone,
    message: v.message.trim().length < 10 ? t.errMessage : "",
  };
  const isValid = !Object.values(errors).some(Boolean);
  const set = (k: Field, val: string) => setV((p) => ({ ...p, [k]: val }));
  const blur = (k: Field) => setTouched((p) => ({ ...p, [k]: true }));
  const show = (k: Field) => touched[k] && !!errors[k];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    if (!isValid) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v.name.trim(),
          email: v.email.trim(),
          phone: `${country.dial} ${v.phone.trim()}`,
          phoneCountry: country.iso,
          message: v.message.trim(),
          reason,
          locale,
          source: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
          page: typeof location !== "undefined" ? location.pathname : "/",
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("ok");
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push?.({ event: "lead_submitted", locale });
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-10 text-center"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-500)] text-2xl text-white shadow-[var(--shadow-glow)]">✓</div>
        <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">{t.okTitle}</p>
        <p className="mt-2 text-[var(--color-slate)]">{t.ok}</p>
      </motion.div>
    );
  }

  const inputCls = (bad: boolean) =>
    `w-full rounded-[var(--radius)] border bg-white px-4 py-2.5 text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-mute)] ${
      bad
        ? "border-red-400 ring-4 ring-red-100"
        : "border-[var(--color-line)] focus:border-[var(--color-brand-400)] focus:ring-4 focus:ring-[rgba(41,171,226,.12)]"
    }`;

  return (
    /* Four rows: who you are, how to call you, what it is about, and the ask.
       Name and email share the first row - they are the two fields nobody has
       to think about, and stacking them one per row was what pushed the Send
       button below the fold on a laptop. The subject moved from the top to the
       third row for the same reason it is not first on any email client: it is
       the easiest field to answer once you know what you are writing. */
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{t.name}</Label>
          <input
            id="name" name="name" autoComplete="name" placeholder={t.namePlaceholder}
            value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")}
            aria-invalid={show("name")} className={inputCls(show("name"))}
          />
          <Err show={show("name")} msg={errors.name} />
        </div>

        <div>
          <Label htmlFor="email">{t.emailL}</Label>
          <input
            id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder={t.emailPlaceholder}
            value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")}
            aria-invalid={show("email")} className={inputCls(show("email"))}
          />
          <Err show={show("email")} msg={errors.email} />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">{t.phoneL}</Label>
        <PhoneField
          id="phone" value={v.phone} onChange={(val) => set("phone", val)} onBlur={() => blur("phone")}
          country={country} onCountryChange={setCountry}
          invalid={show("phone")} placeholder={t.phonePlaceholder} searchPlaceholder={t.searchCountry}
        />
        <Err show={show("phone")} msg={errors.phone} />
      </div>

      <div>
        <Label htmlFor="reason">{t.reasonLabel}</Label>
        <select
          id="reason" value={reason} onChange={(e) => setReason(e.target.value)}
          className={`${inputCls(false)} cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%238a94a8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
        >
          {t.reasons.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div>
        <Label htmlFor="message">{t.message}</Label>
        <textarea
          id="message" name="message" rows={3} placeholder={t.messagePlaceholder}
          value={v.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")}
          aria-invalid={show("message")} className={`${inputCls(show("message"))} resize-y leading-relaxed`}
        />
        <Err show={show("message")} msg={errors.message} />
      </div>

      <button type="submit" disabled={status === "sending"} className="btn-primary mt-1 w-full justify-center py-3 text-base disabled:opacity-60">
        {status === "sending" ? t.sending : t.send}
      </button>

      {status === "error" && (
        <p className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{t.err}</p>
      )}
      <p className="text-center text-sm text-[var(--color-mute)]">{t.hint}</p>
    </form>
  );
}
