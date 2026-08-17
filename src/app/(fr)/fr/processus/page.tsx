import type { Metadata } from "next";
import { ProcessPage } from "@/components/pages/StandardPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("fr", "process");

export default function Page() {
  return <ProcessPage locale="fr" />;
}
