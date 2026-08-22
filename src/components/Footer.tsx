import BrandLogo from "./BrandLogo";
import { CONTENT, SITE, type Locale } from "@/content/site";
import { NAV_ORDER, PAGES, pagePath } from "@/content/routes";

/** One heading treatment for every footer column, so the three of them read as
 *  a set: small caps over a short brand rule, all on the same baseline. */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/40">
      {children}
      <span aria-hidden className="mt-2 block h-px w-8 bg-[var(--color-brand-400)]/50" />
    </h2>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  const t = CONTENT[locale].footer;
  const isEn = locale === "en";

  return (
    <footer className="bx-footer relative overflow-hidden text-white/70">
      {/* drifting aura + oversized wordmark watermark */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(41,171,226,.30),transparent_65%)] bx-footer-aura" />
      <div className="pointer-events-none absolute -left-24 bottom-[-6rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(127,212,245,.18),transparent_65%)] bx-footer-aura2" />
      {/* The wordmark was set at 26vw, which put a 370px-tall ghost behind
          three short columns and made the whole block look like it was hiding
          something. It sits under the base line now, at a size that reads as a
          watermark rather than as content. */}
      <span aria-hidden className="bx-watermark pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-[family-name:var(--font-display)] text-[13vw] font-bold leading-none">
        BLOBEX
      </span>

      {/* Five page names one under the other ran the footer to nearly 400px for
          about six lines of actual content. The links pair up into two columns,
          the three headings sit on one baseline over a hairline rule, and the
          padding comes down with them. */}
      <div className="container relative grid gap-10 py-12 md:grid-cols-[1.5fr_1.15fr_1fr] md:gap-12 md:py-14">
        <div className="max-w-sm">
          <BrandLogo dark size={36} />
          <p className="mt-4 text-[0.95rem] leading-relaxed text-white/55">{t.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <FooterHeading>{isEn ? "Explore" : "Explorer"}</FooterHeading>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {NAV_ORDER.map((key) => (
              <li key={key}>
                <a href={pagePath(locale, key)} className="bx-flink relative text-[0.95rem] text-white/70 transition-colors hover:text-white">
                  {PAGES[key].nav[locale]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterHeading>{isEn ? "Contact" : "Coordonnées"}</FooterHeading>
          <address className="space-y-2 text-[0.95rem] not-italic">
            <p className="text-white/70">
              {SITE.location.city}, {SITE.location.region}, {SITE.location.country}
            </p>
            <p>
              <a href={`mailto:${SITE.email}`} className="bx-flink relative text-[var(--color-brand-300)] transition-colors hover:text-white">
                {SITE.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container flex flex-col gap-1.5 py-5 text-[0.82rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.legalName} {t.rights}</p>
          <p>{isEn ? "Built in Granby, Quebec." : "Conçu à Granby, au Québec."}</p>
        </div>
      </div>
    </footer>
  );
}
