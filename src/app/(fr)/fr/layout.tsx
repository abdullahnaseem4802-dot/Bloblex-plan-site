import type { Metadata } from "next";
import "../../globals.css";
import { fontVars } from "@/lib/fonts";
import { SITE } from "@/content/site";
import AmbientBackground from "@/components/AmbientBackground";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
};

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    // the splash script stamps data-splash on <html> before hydration
    <html lang="fr" className={fontVars} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <script dangerouslySetInnerHTML={{ __html: "if('scrollRestoration' in history){history.scrollRestoration='manual';}" }} />
        {/* The hero intro plays when the site is opened or reloaded, and
            stays still when the visitor lands on home from another page.
            Stamped before paint, so neither opening ever flashes. */}
        <script dangerouslySetInnerHTML={{ __html: "try{var n=performance.getEntriesByType('navigation')[0];var r=document.referrer;var internal=!!r&&new URL(r).origin===location.origin;if((n&&n.type==='reload')||!internal){document.documentElement.setAttribute('data-intro','');}}catch(e){}" }} />
        <noscript><style>{".bx-tw-ch{opacity:1 !important}"}</style></noscript>
      </head>
      <body>
        <AmbientBackground />
        <ScrollProgress />
        <a href="#main" className="skip-link">Aller au contenu</a>
        {children}
      </body>
    </html>
  );
}
