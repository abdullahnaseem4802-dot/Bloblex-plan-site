import type { Metadata } from "next";
import { IndustriesPage } from "@/components/pages/StandardPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("en", "industries");

export default function Page() {
  return <IndustriesPage locale="en" />;
}
