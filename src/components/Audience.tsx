import Reveal from "./Reveal";
import { type Locale } from "@/content/site";
import { AUDIENCE_UI } from "@/content/extras";

/** Who we want to attract + strong qualifying problems (PDF p2). */
export default function Audience({ locale }: { locale: Locale }) {
  const t = AUDIENCE_UI[locale];
  return (
    <section id="audience" className="py-20 md:py-28">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{t.kicker}</p>
          <h2 className="text-3xl md:text-[2.7rem] font-semibold">{t.title}</h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-7 shadow-[var(--shadow-soft)]">
              <h3 className="text-lg font-semibold">{t.attractTitle}</h3>
              <ul className="mt-5 space-y-3">
                {t.attract.map((a) => (
                  <li key={a} className="flex gap-3 text-[var(--color-slate)]"><span className="mt-0.5 text-[var(--color-brand-500)]">✓</span>{a}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-panel)] p-7">
              <h3 className="text-lg font-semibold">{t.problemsTitle}</h3>
              <ul className="mt-5 space-y-3">
                {t.problems.map((p) => (
                  <li key={p} className="flex gap-3 text-[var(--color-slate)]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-mute)] shrink-0" />{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
