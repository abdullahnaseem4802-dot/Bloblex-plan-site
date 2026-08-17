/* =================================================================
   ROUTING MAP, clean URLs, EN at "/", FR under "/fr" (PDF p.6).
   Single source of truth for slugs, nav labels and hreflang.
   ================================================================= */
import type { Locale } from "./site";
import { SITE } from "./site";

/** Standalone pages (besides Home). key -> localized slug + nav label. */
export const PAGES = {
  whatWeBuild: {
    slug: { en: "what-we-build", fr: "ce-quon-batit" },
    nav: { en: "What we build", fr: "Ce qu'on bâtit" },
  },
  industries: {
    slug: { en: "industries", fr: "secteurs" },
    nav: { en: "Industries", fr: "Secteurs" },
  },
  process: {
    slug: { en: "process", fr: "processus" },
    nav: { en: "Process", fr: "Processus" },
  },
  pricing: {
    slug: { en: "pricing", fr: "tarification" },
    nav: { en: "Pricing", fr: "Tarification" },
  },
  contact: {
    slug: { en: "contact", fr: "contact" },
    nav: { en: "Contact", fr: "Contact" },
  },
  about: {
    slug: { en: "about", fr: "a-propos" },
    nav: { en: "About", fr: "À propos" },
  },
} as const;

export type PageKey = keyof typeof PAGES;

/** Industry detail pages, keyed by the SECTORS id. */
export const INDUSTRY_SLUGS: Record<string, { en: string; fr: string }> = {
  construction: { en: "construction-software", fr: "logiciel-construction" },
  manufacturing: { en: "manufacturing-software", fr: "logiciel-manufacturier" },
  healthcare: { en: "healthcare-software", fr: "logiciel-sante" },
  "professional-services": { en: "professional-services-software", fr: "logiciel-services-professionnels" },
  logistics: { en: "logistics-software", fr: "logiciel-logistique" },
  distribution: { en: "distribution-software", fr: "logiciel-distribution" },
  "real-estate": { en: "real-estate-software", fr: "logiciel-immobilier" },
  hospitality: { en: "hospitality-software", fr: "logiciel-hotellerie" },
  technology: { en: "technology-software", fr: "logiciel-technologie" },
};

/** The header/footer navigation order. */
export const NAV_ORDER: PageKey[] = ["whatWeBuild", "industries", "process", "pricing", "contact"];

/** Build a path for a locale + slug ("" = home). */
export function path(locale: Locale, slug = ""): string {
  const s = slug ? `/${slug}` : "";
  return locale === "en" ? (s || "/") : `/fr${s}`;
}

export function pagePath(locale: Locale, key: PageKey): string {
  return path(locale, PAGES[key].slug[locale]);
}

export function industryPath(locale: Locale, id: string): string {
  return path(locale, INDUSTRY_SLUGS[id][locale]);
}

export function allIndustrySlugs(locale: Locale): string[] {
  return Object.values(INDUSTRY_SLUGS).map((s) => s[locale]);
}

export function industryIdFromSlug(locale: Locale, slug: string): string | undefined {
  return Object.keys(INDUSTRY_SLUGS).find((id) => INDUSTRY_SLUGS[id][locale] === slug);
}

/** hreflang alternates map for a given EN/FR slug pair (for metadata + sitemap). */
export function alternates(enSlug = "", frSlug = "") {
  return {
    en: `${SITE.domain}${path("en", enSlug)}`.replace(/\/$/, "") || SITE.domain,
    fr: `${SITE.domain}${path("fr", frSlug)}`,
  };
}
