import type { Metadata } from "next";
import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { SITE } from "@/content/site";
import AmbientBackground from "@/components/AmbientBackground";
import ScrollProgress from "@/components/ScrollProgress";
import PointerFlourish from "@/components/PointerFlourish";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    // the splash script stamps data-splash on <html> before hydration
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <script dangerouslySetInnerHTML={{ __html: "if('scrollRestoration' in history){history.scrollRestoration='manual';}" }} />
      </head>
      <body>
        <AmbientBackground />
        <ScrollProgress />
        <PointerFlourish />
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
