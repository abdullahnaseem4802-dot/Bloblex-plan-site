import Header from "./Header";
import Footer from "./Footer";
import type { Locale } from "@/content/site";

/** Standard shell for every non-home page: Header (with per-page language
    alternates) + main + Footer. */
export default function PageShell({
  locale, alt, children,
}: { locale: Locale; alt: { en: string; fr: string }; children: React.ReactNode }) {
  return (
    <>
      <Header locale={locale} alt={alt} />
      <main>{children}</main>
      <Footer locale={locale} />
    </>
  );
}

/** Premium page masthead: soft brand wash, eyebrow chip, oversized headline. */
export function PageHero({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <section className="relative grid-bg overflow-hidden border-b border-[var(--color-line)] pt-[136px] pb-16 md:pb-20">
      <div className="container">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5 text-[0.82rem] font-semibold tracking-wide text-[var(--color-brand-700)] shadow-[var(--shadow-soft)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />
            {kicker}
          </p>
          <h1 className="text-[2.6rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem] font-semibold tracking-[-0.035em] text-[var(--color-ink)]">
            {title}
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-[var(--color-slate)]">{lead}</p>
        </div>
      </div>
    </section>
  );
}
