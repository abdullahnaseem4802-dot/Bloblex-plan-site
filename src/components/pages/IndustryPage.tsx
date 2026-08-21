import PageShell from "../PageShell";
import BlobWithAccessory from "../BlobWithAccessory";
import Reveal from "../Reveal";
import { Breadcrumbs } from "@/lib/seo";
import type { Locale } from "@/content/site";
import { SECTORS } from "@/content/sectors";
import { INDUSTRY_PAGES, industryMeta } from "@/content/pages";
import { industryPath, pagePath, path } from "@/content/routes";

export default function IndustryPage({ locale, id }: { locale: Locale; id: string }) {
  const sector = SECTORS.find((s) => s.id === id)!;
  const copy = INDUSTRY_PAGES[id][locale];
  const meta = industryMeta(id, locale);
  const alt = { en: industryPath("en", id), fr: industryPath("fr", id) };
  const isEn = locale === "en";

  return (
    <PageShell locale={locale} alt={alt}>
      <Breadcrumbs items={[
        { name: isEn ? "Home" : "Accueil", href: path(locale) },
        { name: isEn ? "Industries" : "Secteurs", href: pagePath(locale, "industries") },
        { name: sector.name[locale], href: industryPath(locale, id) },
      ]} />

      {/* Hero */}
      <section className="grid-bg border-b border-[var(--color-line)] pt-[136px] pb-14">
        <div className="container grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5 text-[0.82rem] font-semibold tracking-wide text-[var(--color-brand-700)] shadow-[var(--shadow-soft)] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />
              {isEn ? "Custom software for your industry" : "Logiciel sur mesure pour votre secteur"}
            </p>
            <h1 className="text-4xl md:text-[3.2rem] font-semibold leading-[1.06] tracking-[-0.035em] first-letter:uppercase">{meta.h1}</h1>
            <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-[var(--color-slate)]">{copy.hook}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={pagePath(locale, "contact")} className="btn-primary">{isEn ? "Start a project" : "Démarrer un projet"}</a>
              <a href={pagePath(locale, "process")} className="btn-ghost">{isEn ? "How we work" : "Notre processus"} →</a>
            </div>
          </div>
          <div className="mx-auto w-[260px] h-[220px]">
            <BlobWithAccessory accessory={sector.accessory} />
          </div>
        </div>
      </section>

      {/* Pains vs outcomes */}
      <section className="py-16 band-panel border-y border-[var(--color-line)]">
        <div className="container grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-7">
              <h2 className="text-xl font-semibold">{isEn ? "What slows you down today" : "Ce qui vous ralentit aujourd'hui"}</h2>
              <ul className="mt-5 space-y-3">
                {copy.pains.map((p) => (
                  <li key={p} className="flex gap-3 text-[var(--color-slate)]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-[var(--radius-lg)] border-2 border-[var(--color-brand-300)] bg-[var(--color-brand-50)]/40 p-7">
              <h2 className="text-xl font-semibold text-[var(--color-brand-800)]">{isEn ? "What a Blobex system gives you" : "Ce qu'un système Blobex vous donne"}</h2>
              <ul className="mt-5 space-y-3">
                {copy.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-[var(--color-ink-soft)]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)] shrink-0" />{o}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Connected system */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-brand-600)]">{isEn ? "The connected system" : "Le système connecté"}</p>
            <h2 className="text-3xl md:text-[2.4rem] font-semibold">
              {isEn ? `Everything a ${sector.name.en.toLowerCase()} business runs on, connected.` : `Tout ce qui fait rouler une entreprise du secteur ${sector.name.fr.toLowerCase()}, connecté.`}
            </h2>
          </Reveal>
          <ul className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sector.modules[locale].map((m) => (
              <li key={m} className="flex items-center gap-2.5 rounded-[var(--radius)] border border-[var(--color-line)] bg-white px-4 py-3.5 font-semibold text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />{m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container">
          <div className="rounded-[var(--radius-xl)] bg-[var(--color-ink)] text-white px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">{isEn ? "Let's map your system." : "Cartographions votre système."}</h2>
              <p className="mt-2 text-white/70">{isEn ? "A short conversation, fixed scope, timeline and price before we build." : "Une courte conversation, portée, échéancier et prix fixes avant de bâtir."}</p>
            </div>
            <a href={pagePath(locale, "contact")} className="btn-primary shrink-0">{isEn ? "Start a project" : "Démarrer un projet"}</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
