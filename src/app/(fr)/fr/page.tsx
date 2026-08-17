import type { Metadata } from "next";
import Page from "@/components/Page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("fr");

export default function HomeFr() {
  return <Page locale="fr" />;
}
