import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { ASSURANCES_UI } from "@/content/extras";

/** Ownership, confidentiality, security, documentation, dependencies, maintenance (PDF p4). */
export default function Assurances({ locale }: { locale: Locale }) {
  const t = ASSURANCES_UI[locale];
  return (
    <section id="assurances" className="py-20 md:py-28 band-panel border-y border-[var(--color-line)]">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{t.title}</h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 3) * 80}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <div className="mb-3 h-9 w-9 rounded-[var(--radius)] bg-[var(--color-brand-50)] flex items-center justify-center text-[var(--color-brand-600)] font-bold">✓</div>
                <h3 className="font-semibold text-[var(--color-ink)]">{it.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
