import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { PAGES, INDUSTRY_SLUGS, path } from "@/content/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (enPath: string, frPath: string, priority: number): MetadataRoute.Sitemap[number] => {
    const en = `${SITE.domain}${path("en", enPath)}`.replace(/\/$/, "") || SITE.domain;
    const fr = `${SITE.domain}${path("fr", frPath)}`;
    return { url: en, lastModified: now, changeFrequency: "monthly", priority, alternates: { languages: { en, fr } } };
  };

  const out: MetadataRoute.Sitemap = [entry("", "", 1)];
  for (const key of Object.keys(PAGES) as (keyof typeof PAGES)[]) {
    out.push(entry(PAGES[key].slug.en, PAGES[key].slug.fr, 0.8));
  }
  for (const id of Object.keys(INDUSTRY_SLUGS)) {
    out.push(entry(INDUSTRY_SLUGS[id].en, INDUSTRY_SLUGS[id].fr, 0.7));
  }
  return out;
}
