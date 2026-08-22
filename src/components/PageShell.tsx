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

/** Premium page masthead: soft brand wash, eyebrow chip, oversized headline.
 *
 *  This used to be one 48rem-wide column stacked kicker / headline / lead, on a
 *  136px top pad. On a laptop that filled the whole first screen with three
 *  sentences and left the right half of it blank - the visitor opened the page,
 *  saw a title, and had to scroll before there was anything to actually look at.
 *
 *  The headline and the lead now sit side by side from lg up, so the empty half
 *  carries the lead instead of nothing, the headline stays on two lines, and the
 *  block as a whole is roughly 150px shorter. The first cards clear the fold. */
export function PageHero({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <section className="relative grid-bg overflow-hidden border-b border-[var(--color-line)] pt-[116px] pb-12 md:pb-14">
      <div className="container">
        <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5 text-[0.82rem] font-semibold tracking-wide text-[var(--color-brand-700)] shadow-[var(--shadow-soft)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />
          {kicker}
        </p>
        <div className="grid gap-x-12 gap-y-5 lg:grid-cols-[minmax(0,1.72fr)_minmax(0,1fr)] lg:items-end">
          <h1 className="max-w-3xl text-[2.4rem] leading-[1.06] sm:text-[2.9rem] lg:max-w-none lg:text-[2.95rem] font-semibold tracking-[-0.035em] text-[var(--color-ink)]">
            {title}
          </h1>
          <p className="max-w-[58ch] text-lg leading-relaxed text-[var(--color-slate)] lg:pb-1.5">{lead}</p>
        </div>
      </div>
    </section>
  );
}
