# Blobex — Website

Marketing website for **Blobex Inc.** (Granby, Quebec, Canada): custom software,
internal platforms, automation and client portals.

White, premium design built around the Blobex blob mascot, engineered for
**technical SEO** and **lead conversion**. English at `/`, French at `/fr`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · flag-icons

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

## Environment variables

Copy `.env.example` to `.env.local`. Everything is optional for local work.

| Variable | Purpose |
| --- | --- |
| `LEAD_API_URL` | Where contact-form submissions are POSTed (the client's admin API). Until set, leads append to `data/leads.jsonl`. |
| `LEAD_API_KEY` | Optional bearer token for that API. |
| `RESEND_API_KEY`, `LEAD_FROM_EMAIL`, `LEAD_TEAM_EMAIL` | Optional: let the site send the confirmation + team email itself. If unset, email is skipped. |

## Project structure

```
src/
├─ app/
│  ├─ (en)/                  # English site at "/"   (<html lang="en">)
│  ├─ (fr)/fr/               # French site at "/fr"  (<html lang="fr">)
│  ├─ [industry]/            # industry pages, clean URLs (/construction-software)
│  ├─ api/lead/route.ts      # contact form -> client's admin API (file fallback)
│  ├─ sitemap.ts, robots.ts  # generated SEO files
│  └─ globals.css            # design tokens, hero surface, splash
├─ components/               # Header, Hero, interactive demos, Contact, Footer…
├─ content/                  # ★ all copy + SEO text (EN/FR), routes, sectors
└─ lib/seo.tsx               # metadata builders, JSON-LD, breadcrumbs
```

### Editing content and SEO

Headlines, body copy, nav labels, **page titles, meta descriptions and URL slugs**
all live in `src/content/` (`site.ts`, `pages.ts`, `routes.ts`, `sectors.ts`,
`extras.ts`), keyed by locale. No component edits needed to change wording.

## SEO

Per-page unique titles and meta descriptions · canonical tags · EN/FR `hreflang`
alternates · Schema.org (Organization, ProfessionalService, LocalBusiness,
BreadcrumbList, WebSite) · generated `sitemap.xml` and `robots.txt` · semantic
heading hierarchy · clean descriptive URLs · optimized images · accessible
navigation, forms and alt text.

## Deploying to Vercel

Import this repository on Vercel. The framework is auto-detected (Next.js) and no
build settings need changing. Add the environment variables above under
**Settings → Environment Variables** when the client's lead API is ready.

Before launch: set the real phone number, contact email and production domain in
`src/content/site.ts`, and have a native speaker review the French copy.
