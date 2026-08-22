import PageShell, { PageHero } from "../PageShell";
import Reveal from "../Reveal";
import { WhatWeBuild, Process } from "../Sections";
import AutomationPicker from "../AutomationPicker";
import SectorSwitcher from "../SectorSwitcher";
import SystemComparison from "../SystemComparison";
import CostRace from "../CostRace";
import Uncomparable from "../Uncomparable";
import WhyCustom from "../WhyCustom";
import Assurances from "../Assurances";
import Audience from "../Audience";
import Positioning from "../Positioning";
import Contact from "../Contact";
import { Breadcrumbs } from "@/lib/seo";
import { SITE, type Locale } from "@/content/site";
import { SECTORS } from "@/content/sectors";
import { PAGE_HERO } from "@/content/pages";
import { PAGES, pagePath, industryPath, path, type PageKey } from "@/content/routes";

function alt(key: PageKey) { return { en: pagePath("en", key), fr: pagePath("fr", key) }; }
function crumbs(locale: Locale, key: PageKey) {
  const isEn = locale === "en";
  return [
    { name: isEn ? "Home" : "Accueil", href: path(locale) },
    { name: PAGES[key].nav[locale], href: pagePath(locale, key) },
  ];
}
/* There used to be a "Tell us what slows you down. / Start a project" band at
   the foot of What we build, Industries, Process and Pricing. The same header
   sits pinned to the top of every one of those pages with the same button in
   it, so the band was the fourth or fifth time a visitor had been shown the
   same call on the same screen. The Contact page is where that sentence
   belongs, and it is still the headline there. */
export function WhatWeBuildPage({ locale }: { locale: Locale }) {
  const h = PAGE_HERO.whatWeBuild[locale];
  return (
    <PageShell locale={locale} alt={alt("whatWeBuild")}>
      <Breadcrumbs items={crumbs(locale, "whatWeBuild")} />
      <PageHero {...h} />
      <WhatWeBuild locale={locale} bare />
      <SystemComparison locale={locale} />
      <WhyCustom locale={locale} />
      <AutomationPicker locale={locale} />
    </PageShell>
  );
}

export function IndustriesPage({ locale }: { locale: Locale }) {
  const h = PAGE_HERO.industries[locale];
  return (
    <PageShell locale={locale} alt={alt("industries")}>
      <Breadcrumbs items={crumbs(locale, "industries")} />
      <PageHero {...h} />
      <section className="py-20 md:py-24">
        <div className="container">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTORS.map((s, i) => (
              <li key={s.id}>
                <Reveal delay={(i % 3) * 70}>
                  <a
                    href={industryPath(locale, s.id)}
                    className="group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand-200)] hover:shadow-[var(--shadow-card)]"
                  >
                    <span className="font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{s.name[locale]}</span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] transition-all duration-300 group-hover:bg-[var(--color-brand-500)] group-hover:text-white">
                      →
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <SectorSwitcher locale={locale} bare />
    </PageShell>
  );
}

export function ProcessPage({ locale }: { locale: Locale }) {
  const h = PAGE_HERO.process[locale];
  return (
    <PageShell locale={locale} alt={alt("process")}>
      <Breadcrumbs items={crumbs(locale, "process")} />
      <PageHero {...h} />
      <Process locale={locale} bare />
    </PageShell>
  );
}

export function PricingPage({ locale }: { locale: Locale }) {
  const h = PAGE_HERO.pricing[locale];
  return (
    <PageShell locale={locale} alt={alt("pricing")}>
      <Breadcrumbs items={crumbs(locale, "pricing")} />
      <PageHero {...h} />
      <CostRace locale={locale} />
      <Assurances locale={locale} />
      <Uncomparable locale={locale} />
    </PageShell>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale} alt={alt("contact")}>
      <Breadcrumbs items={crumbs(locale, "contact")} />
      <Contact locale={locale} standalone />
    </PageShell>
  );
}

export function AboutPage({ locale }: { locale: Locale }) {
  const h = PAGE_HERO.about[locale];
  const isEn = locale === "en";
  const feelings = isEn
    ? ["Recognition: this is exactly what slows us down.", "Ambition: we could handle much more with the right system.", "Relief: our team would stop doing this manually.", "Control: the system would finally fit our business.", "Trust: the price, ownership and responsibilities are clear."]
    : ["Reconnaissance : c'est exactement ce qui nous ralentit.", "Ambition : on pourrait en gérer bien plus avec le bon système.", "Soulagement : notre équipe arrêterait de le faire à la main.", "Contrôle : le système collerait enfin à notre entreprise.", "Confiance : le prix, la propriété et les responsabilités sont clairs."];
  return (
    <PageShell locale={locale} alt={alt("about")}>
      <Breadcrumbs items={crumbs(locale, "about")} />
      <PageHero {...h} />
      <Positioning locale={locale} />
      <Audience locale={locale} />
      <Assurances locale={locale} />
      <section className="py-12">
        <div className="container grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold">{isEn ? "What the visitor should feel" : "Ce que le visiteur doit ressentir"}</h2>
              <ul className="mt-5 space-y-3">
                {feelings.map((f) => (
                  <li key={f} className="flex gap-3 text-[var(--color-slate)]"><span className="mt-1 text-[var(--color-brand-500)]">✓</span>{f}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-panel)] border border-[var(--color-line)] p-8">
              <h2 className="text-xl font-semibold">{isEn ? "Contact" : "Coordonnées"}</h2>
              <div className="mt-5 space-y-2 text-[var(--color-ink)] font-medium">
                <p>{SITE.location.city}, {SITE.location.region}, {SITE.location.country}</p>
                <p><a href={`mailto:${SITE.email}`} className="text-[var(--color-brand-600)] hover:underline">{SITE.email}</a></p>
              </div>
              <a href={pagePath(locale, "contact")} className="btn-primary mt-6">{isEn ? "Start a project" : "Démarrer un projet"}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
