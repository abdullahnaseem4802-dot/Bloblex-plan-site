import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { POSITIONING_UI } from "@/content/extras";

/** Core positioning + why the investment matters (PDF p3). */
export default function Positioning({ locale }: { locale: Locale }) {
  const t = POSITIONING_UI[locale];
  return (
    <section id="positioning" className="py-20 md:py-28 bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{t.title}</h2>
          <p className="mt-5 text-lg font-medium text-[var(--color-brand-800)]">{t.lead}</p>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-7 shadow-[var(--shadow-soft)]">
              <h3 className="text-lg font-semibold">{t.coreTitle}</h3>
              <ul className="mt-5 space-y-3">
                {t.core.map((c) => (
                  <li key={c} className="flex gap-3 text-[var(--color-slate)]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)] shrink-0" />{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-[var(--radius-lg)] border-2 border-[var(--color-brand-300)] bg-[var(--color-brand-50)]/40 p-7">
              <h3 className="text-lg font-semibold text-[var(--color-brand-800)]">{t.whyTitle}</h3>
              <ul className="mt-5 space-y-3">
                {t.why.map((w) => (
                  <li key={w} className="flex gap-3 text-[var(--color-ink-soft)] font-medium"><span className="mt-0.5 text-[var(--color-brand-500)]">✓</span>{w}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
