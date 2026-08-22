import Reveal from "./Reveal";
import ContactForm from "./ContactForm";
import { CONTENT, SITE, type Locale } from "@/content/site";

/** `standalone` = used as the /contact page body (adds masthead spacing). */
export default function Contact({ locale, standalone = false }: { locale: Locale; standalone?: boolean }) {
  const t = CONTENT[locale].contact;
  const isEn = locale === "en";

  return (
    <section
      id="contact"
      className={`bg-[var(--color-panel)] border-t border-[var(--color-line)] ${standalone ? "grid-bg pt-[116px] pb-16" : "py-20 md:py-28"}`}
    >
      <div className="container grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5 text-[0.82rem] font-semibold tracking-wide text-[var(--color-brand-700)] shadow-[var(--shadow-soft)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />
            {t.kicker}
          </p>
          {standalone ? (
            <h1 className="text-[2.4rem] leading-[1.06] sm:text-[2.9rem] lg:text-[3.1rem] font-semibold tracking-[-0.035em]">{t.title}</h1>
          ) : (
            <h2 className="text-3xl md:text-[2.6rem] leading-[1.1] font-semibold tracking-[-0.03em]">{t.title}</h2>
          )}
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-slate)]">{t.lead}</p>

          <dl className="mt-8 space-y-4 border-t border-[var(--color-line)] pt-6">
            <div>
              <dt className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[var(--color-mute)]">
                {isEn ? "Office" : "Bureau"}
              </dt>
              <dd className="mt-1.5 font-medium text-[var(--color-ink)]">
                {SITE.location.city}, {SITE.location.region}, {SITE.location.country}
              </dd>
            </div>
            <div>
              <dt className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[var(--color-mute)]">
                {isEn ? "Email" : "Courriel"}
              </dt>
              <dd className="mt-1.5">
                <a href={`mailto:${SITE.email}`} className="font-medium text-[var(--color-brand-600)] transition-colors hover:text-[var(--color-brand-700)]">
                  {SITE.email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-card)] md:p-7">
            <ContactForm locale={locale} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
