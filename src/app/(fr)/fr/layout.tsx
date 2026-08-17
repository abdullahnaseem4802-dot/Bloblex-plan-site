import type { Metadata } from "next";
import "../../globals.css";
import { fontVars } from "@/lib/fonts";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
};

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    // the splash script stamps data-splash on <html> before hydration
    <html lang="fr" className={fontVars} suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link">Aller au contenu</a>
        {children}
      </body>
    </html>
  );
}
