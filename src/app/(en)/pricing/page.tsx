import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/StandardPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("en", "pricing");

export default function Page() {
  return <PricingPage locale="en" />;
}
