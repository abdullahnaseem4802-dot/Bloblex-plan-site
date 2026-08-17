import type { Metadata } from "next";
import { SITE, CONTENT, type Locale } from "@/content/site";
import { PAGES, INDUSTRY_SLUGS, path, type PageKey } from "@/content/routes";
import { PAGE_META, industryMeta } from "@/content/pages";

/** Generic metadata builder for any page, with canonical + hreflang alternates. */
function metaFor(opts: { locale: Locale; title: string; description: string; enPath: string; frPath: string }): Metadata {
  const { locale, title, description, enPath, frPath } = opts;
  const enUrl = `${SITE.domain}${path("en", enPath)}`.replace(/\/$/, "") || SITE.domain;
  const frUrl = `${SITE.domain}${path("fr", frPath)}`;
  const url = locale === "en" ? enUrl : frUrl;
  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: title }, description,
    alternates: { canonical: url, languages: { en: enUrl, fr: frUrl, "x-default": enUrl } },
    openGraph: {
      type: "website", siteName: SITE.name, title, description, url,
      locale: locale === "en" ? "en_CA" : "fr_CA",
      alternateLocale: locale === "en" ? "fr_CA" : "en_CA",
      images: [{ url: "/img/og.png", width: 1200, height: 630, alt: "Blobex" }],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
    icons: { icon: "/img/favicon-src.png", apple: "/img/favicon-src.png" },
  };
}

/** Metadata for a standalone page (What we build, Process, etc.). */
export function buildPageMetadata(locale: Locale, key: PageKey): Metadata {
  const m = PAGE_META[key][locale];
  return metaFor({ locale, title: m.title, description: m.description, enPath: PAGES[key].slug.en, frPath: PAGES[key].slug.fr });
}

/** Metadata for an industry detail page. */
export function buildIndustryMetadata(locale: Locale, id: string): Metadata {
  const m = industryMeta(id, locale);
  return metaFor({ locale, title: m.title, description: m.description, enPath: INDUSTRY_SLUGS[id].en, frPath: INDUSTRY_SLUGS[id].fr });
}

/** BreadcrumbList structured data (PDF p.6). items: [{name, url}] absolute or path. */
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem", position: i + 1, name: it.name,
      item: it.href.startsWith("http") ? it.href : `${SITE.domain}${it.href}`,
    })),
  };
  // Structured data only, the visual trail is intentionally not rendered.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/** Build page metadata with canonical + EN/FR hreflang alternates (PDF p.6). */
export function buildMetadata(locale: Locale): Metadata {
  const c = CONTENT[locale].meta;
  const path = locale === "en" ? "/" : "/fr";
  const url = `${SITE.domain}${path}`;
  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: c.title },
    description: c.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE.domain}/`,
        fr: `${SITE.domain}/fr`,
        "x-default": `${SITE.domain}/`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: c.ogTitle,
      description: c.ogDescription,
      url,
      locale: locale === "en" ? "en_CA" : "fr_CA",
      alternateLocale: locale === "en" ? "fr_CA" : "en_CA",
      images: [{ url: "/img/og.png", width: 1200, height: 630, alt: "Blobex" }],
    },
    twitter: { card: "summary_large_image", title: c.ogTitle, description: c.ogDescription },
    robots: { index: true, follow: true },
    icons: { icon: "/img/favicon-src.png", apple: "/img/favicon-src.png" },
  };
}

/** Organization + ProfessionalService + LocalBusiness + WebSite structured data (PDF p.6). */
export function JsonLd({ locale }: { locale: Locale }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
        "@id": `${SITE.domain}/#org`,
        name: SITE.legalName,
        url: SITE.domain,
        logo: `${SITE.domain}/img/og.png`,
        image: `${SITE.domain}/img/og.png`,
        email: SITE.email,
        telephone: SITE.phone,
        description: CONTENT[locale].meta.description,
        areaServed: SITE.location.countryCode,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.location.city,
          addressRegion: SITE.location.region,
          addressCountry: SITE.location.countryCode,
        },
        knowsAbout: ["Custom software", "Business automation", "Client portals", "AI estimating", "Internal platforms"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.domain}/#website`,
        url: SITE.domain,
        name: SITE.name,
        inLanguage: locale === "en" ? "en-CA" : "fr-CA",
        publisher: { "@id": `${SITE.domain}/#org` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // structured data must be raw JSON in the DOM
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
