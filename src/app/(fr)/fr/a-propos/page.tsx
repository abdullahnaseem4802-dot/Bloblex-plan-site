import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/StandardPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("fr", "about");

export default function Page() {
  return <AboutPage locale="fr" />;
}
