"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";
import LanguageMenu from "./LanguageMenu";
import { CONTENT, type Locale } from "@/content/site";
import { NAV_ORDER, PAGES, pagePath, path, industryIdFromSlug } from "@/content/routes";

/** alt = the equivalent URL of the current page in each locale (for language switch). */
export default function Header({ locale, alt }: { locale: Locale; alt?: { en: string; fr: string } }) {
  const t = CONTENT[locale].nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const alts = alt ?? { en: path("en"), fr: path("fr") };

  // work out which nav item is active from the current path
  const pathname = usePathname() || "/";
  const norm = pathname.replace(/\/$/, "") || "/";
  const slug = (locale === "en" ? norm : norm.replace(/^\/fr/, "")).replace(/^\//, ""); // "" on home
  const onIndustry = !!industryIdFromSlug(locale, slug);
  const activeKey =
    slug === "" ? "home" :
    (NAV_ORDER.find((k) => PAGES[k].slug[locale] === slug) ?? (onIndustry ? "industries" : ""));

  // only the home page has the dark cinematic hero, so only there does the
  // header invert while sitting at the top of the page
  const overDark = !scrolled && slug === "";

  const links = [
    { key: "home", href: path(locale), label: locale === "en" ? "Home" : "Accueil" },
    ...NAV_ORDER.map((key) => ({ key, href: pagePath(locale, key), label: PAGES[key].nav[locale] })),
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 backdrop-blur-xl ${
        overDark
          ? "bg-[#0a1628]/45 border-white/10"
          : "bg-white/92 border-[var(--color-line)] shadow-[0_8px_30px_-12px_rgba(10,22,40,.14)]"
      }`}
    >
      <div className="container flex items-center justify-between h-[76px]">
        <a href={path(locale)} aria-label="Blobex">
          <BrandLogo size={40} dark={overDark} />
        </a>

        <nav className={`hidden lg:flex items-center gap-1 rounded-full border p-1.5 text-[0.92rem] font-medium transition-colors ${overDark ? "border-white/15 bg-white/10" : "border-[var(--color-line)] bg-[var(--color-panel)]/70"}`} aria-label="Primary">
          {links.map((l) => {
            const on = l.key === activeKey;
            return (
              <a
                key={l.href} href={l.href} aria-current={on ? "page" : undefined}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  on
                    ? "bg-white text-[var(--color-ink)] font-semibold shadow-[var(--shadow-soft)]"
                    : overDark
                      ? "text-white/80 hover:bg-white/15 hover:text-white"
                      : "text-[var(--color-slate)] hover:bg-white/70 hover:text-[var(--color-ink)]"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <LanguageMenu locale={locale} alt={alts} dark={overDark} />
          <a href={pagePath(locale, "contact")} className="btn-primary">{t.cta}</a>
        </div>

        <button
          className="lg:hidden flex flex-col gap-[5px] p-2"
          aria-label="Menu" aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-0.5 w-6 ${overDark ? "bg-white" : "bg-[var(--color-ink)]"} transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 ${overDark ? "bg-white" : "bg-[var(--color-ink)]"} transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 ${overDark ? "bg-white" : "bg-[var(--color-ink)]"} transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* mobile drawer */}
      <div className={`lg:hidden overflow-hidden bg-white border-b border-[var(--color-line)] transition-[max-height] duration-300 ${open ? "max-h-[420px]" : "max-h-0"}`}>
        <nav className="container flex flex-col py-4 gap-1" aria-label="Mobile">
          {links.map((l) => {
            const on = l.key === activeKey;
            return (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={on ? "page" : undefined}
                className={`py-2.5 font-medium ${on ? "text-[var(--color-brand-700)]" : "text-[var(--color-ink)]"}`}>
                {on && <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-brand-500)] align-middle" />}
                {l.label}
              </a>
            );
          })}
          <a href={pagePath(locale, "contact")} onClick={() => setOpen(false)} className="btn-primary mt-2 text-center">{t.cta}</a>
          <div className="mt-2 flex gap-2 border-t border-[var(--color-line)] pt-3">
            <a href={alts.en} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${locale === "en" ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]" : "text-[var(--color-mute)]"}`}>English</a>
            <a href={alts.fr} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${locale === "fr" ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]" : "text-[var(--color-mute)]"}`}>Français</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
