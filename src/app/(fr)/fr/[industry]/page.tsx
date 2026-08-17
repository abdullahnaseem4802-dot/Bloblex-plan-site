import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryPage from "@/components/pages/IndustryPage";
import { buildIndustryMetadata } from "@/lib/seo";
import { allIndustrySlugs, industryIdFromSlug } from "@/content/routes";

export function generateStaticParams() {
  return allIndustrySlugs("fr").map((industry) => ({ industry }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry } = await params;
  const id = industryIdFromSlug("fr", industry);
  return id ? buildIndustryMetadata("fr", id) : {};
}

export default async function Page({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const id = industryIdFromSlug("fr", industry);
  if (!id) notFound();
  return <IndustryPage locale="fr" id={id} />;
}
