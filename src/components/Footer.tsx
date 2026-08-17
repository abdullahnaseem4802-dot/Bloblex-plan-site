import BrandLogo from "./BrandLogo";
import { CONTENT, SITE, type Locale } from "@/content/site";
import { NAV_ORDER, PAGES, pagePath } from "@/content/routes";

export default function Footer({ locale }: { locale: Locale }) {
  const t = CONTENT[locale].footer;
  const isEn = locale === "en";

  return (
    <footer className="relative overflow-hidden bg-[var(--color-ink)] text-white/70">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.22),transparent_65%)]" />

      <div className="container relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <BrandLogo dark size={38} />
          <p className="mt-5 leading-relaxed text-white/55">{t.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-white/40">
            {isEn ? "Explore" : "Explorer"}
          </h2>
          <ul className="space-y-3">
            {NAV_ORDER.map((key) => (
              <li key={key}>
                <a href={pagePath(locale, key)} className="text-white/70 transition-colors hover:text-white">
                  {PAGES[key].nav[locale]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-white/40">
            {isEn ? "Contact" : "Coordonnées"}
          </h2>
          <address className="space-y-3 not-italic">
            <p className="text-white/70">
              {SITE.location.city}, {SITE.location.region}
              <br />
              {SITE.location.country}
            </p>
            <p>
              <a href={`mailto:${SITE.email}`} className="text-[var(--color-brand-300)] transition-colors hover:text-white">
                {SITE.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.legalName}. {t.rights}</p>
          <p>{isEn ? "Built in Granby, Quebec." : "Conçu à Granby, au Québec."}</p>
        </div>
      </div>
    </footer>
  );
}
