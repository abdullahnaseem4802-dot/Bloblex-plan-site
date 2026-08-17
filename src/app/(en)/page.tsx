import type { Metadata } from "next";
import Page from "@/components/Page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("en");

export default function Home() {
  return <Page locale="en" />;
}
