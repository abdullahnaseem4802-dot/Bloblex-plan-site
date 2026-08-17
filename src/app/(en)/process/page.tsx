import type { Metadata } from "next";
import { ProcessPage } from "@/components/pages/StandardPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("en", "process");

export default function Page() {
  return <ProcessPage locale="en" />;
}
