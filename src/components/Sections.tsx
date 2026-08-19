import Reveal from "./Reveal";
import { CONTENT, type Locale } from "@/content/site";

/** Section heading. Pass `bare` when the page masthead already states the title. */
export function SectionHead({
  kicker, title, lead, bare = false, invert = false,
}: { kicker: string; title: string; lead?: string; bare?: boolean; invert?: boolean }) {
  if (bare) return null;
  return (
    <Reveal className="max-w-3xl">
      <p className={`mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] ${invert ? "text-[var(--color-brand-300)]" : "text-[var(--color-brand-600)]"}`}>
        {kicker}
      </p>
      <h2 className={`text-3xl md:text-[2.6rem] font-semibold tracking-[-0.03em] leading-[1.1] ${invert ? "text-white" : ""}`}>
        {title}
      </h2>
      {lead && <p className={`mt-5 max-w-[58ch] text-lg leading-relaxed ${invert ? "text-white/75" : "text-[var(--color-slate)]"}`}>{lead}</p>}
    </Reveal>
  );
}

type Props = { locale: Locale; bare?: boolean };

export function WhatWeBuild({ locale, bare }: Props) {
  const t = CONTENT[locale].what;
  return (
    <section id="what" className={bare ? "pt-16 pb-20 md:pt-20 md:pb-28" : "py-20 md:py-28"}>
      <div className="container">
        <SectionHead kicker={t.kicker} title={t.title} lead={t.lead} bare={bare} />
        <div className={`grid md:grid-cols-3 gap-6 ${bare ? "" : "mt-14"}`}>
          {t.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <article className="group h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-8 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-[var(--color-brand-50)] font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-brand-600)] transition-colors group-hover:bg-[var(--color-brand-500)] group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--color-slate)]">{c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* The process section lives in ProcessSpine, which scroll-draws it. */
export { default as Process } from "./ProcessSpine";

export function Pricing({ locale, bare }: Props) {
  const t = CONTENT[locale].pricing;
  return (
    <section id="pricing" className={bare ? "pt-16 pb-20 md:pt-20 md:pb-24" : "py-20 md:py-28"}>
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-ink)] px-8 py-16 text-white md:px-16 md:py-20">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.38),transparent_65%)]" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.18),transparent_65%)]" />
            <div className="relative max-w-2xl">
              {!bare && (
                <>
                  <p className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-300)]">{t.kicker}</p>
                  <h2 className="text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">{t.title}</h2>
                </>
              )}
              <p className={`text-lg leading-relaxed text-white/75 ${bare ? "md:text-xl" : "mt-6"}`}>{t.lead}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
