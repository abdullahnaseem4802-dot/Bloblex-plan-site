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
 *  Three attempts at this block, and the shape that works is the plain one.
 *
 *  It began as a 48rem column on a 136px top pad, which filled the whole first
 *  screen with three sentences and left the right half of it empty. Putting the
 *  lead in that empty half fixed the height but read as two unrelated columns.
 *
 *  What it wanted all along was simply to be allowed to use the width: the
 *  headline runs the full row and wraps onto a second one only when it truly
 *  needs to, then the lead runs its own rows underneath. Nothing is beside
 *  anything, nothing is boxed into a third of the page, and the headline gets
 *  short enough on its own that the block stays about as tight as the
 *  side-by-side version was. */
export function PageHero({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <section className="relative grid-bg overflow-hidden border-b border-[var(--color-line)] pt-[116px] pb-12 md:pb-14">
      <div className="container">
        <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5 text-[0.82rem] font-semibold tracking-wide text-[var(--color-brand-700)] shadow-[var(--shadow-soft)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)]" />
          {kicker}
        </p>
        <h1 className="text-[2.4rem] leading-[1.06] sm:text-[2.9rem] lg:text-[3.15rem] font-semibold tracking-[-0.035em] text-[var(--color-ink)] text-pretty">
          {title}
        </h1>
        <p className="mt-5 max-w-[86ch] text-lg leading-relaxed text-[var(--color-slate)]">{lead}</p>
      </div>
    </section>
  );
}
