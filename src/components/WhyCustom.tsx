import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { WHYCUSTOM_UI } from "@/content/extras";

/** Generic software vs a custom Blobex system (PDF p4). */
export default function WhyCustom({ locale }: { locale: Locale }) {
  const t = WHYCUSTOM_UI[locale];
  return (
    <section id="why-custom" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{t.title}</h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-7">
              <h3 className="text-lg font-semibold text-[var(--color-mute)]">{t.genericLabel}</h3>
              <ul className="mt-5 space-y-3">
                {t.generic.map((g) => (
                  <li key={g} className="flex gap-3 text-[var(--color-slate)]"><span className="mt-0.5 text-red-400">✕</span>{g}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-[var(--radius-lg)] border-2 border-[var(--color-brand-300)] bg-[var(--color-brand-50)]/40 p-7">
              <h3 className="text-lg font-semibold text-[var(--color-brand-700)]">{t.customLabel}</h3>
              <ul className="mt-5 space-y-3">
                {t.custom.map((c) => (
                  <li key={c} className="flex gap-3 text-[var(--color-ink-soft)] font-medium"><span className="mt-0.5 text-[var(--color-brand-500)]">✓</span>{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
