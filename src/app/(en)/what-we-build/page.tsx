import type { Metadata } from "next";
import { WhatWeBuildPage } from "@/components/pages/StandardPages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("en", "whatWeBuild");

export default function Page() {
  return <WhatWeBuildPage locale="en" />;
}
