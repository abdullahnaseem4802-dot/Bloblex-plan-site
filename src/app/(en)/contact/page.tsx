import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/StandardPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("en", "contact");

export default function Page() {
  return <ContactPage locale="en" />;
}
