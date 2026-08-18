# Blobex — Website

Marketing website for **Blobex Inc.** (Granby, Quebec, Canada) — custom software,
internal platforms, automation, AI and client portals.

Fully bilingual: **English at `/`, French at `/fr`**, with `hreflang` alternates and
localised URL slugs on every page.

---

## About the site

Blobex does not sell a subscription product. It builds one system that runs a
company's actual operations. The site is written and structured around that
distinction, for an audience of **ambitious business owners** — people who feel the
cost of manual work and disconnected tools, not people shopping for software
features.

Three ideas drive every page:

1. **Show the cost of the current way of working.** Duplicate entry, chasing
   information, quotes that go out late — quantified rather than described.
2. **Position custom software as operational leverage,** not as programming hours,
   and not as "a better CRM".
3. **Make it scannable.** Owners skim. The heavy arguments are carried by
   interactive demonstrations they can watch in a few seconds, with the text as
   support rather than the other way round.

Everything is presented on a white, premium surface, with a single dark cinematic
hero, and the Blobex blob mascot used throughout as the narrator of each idea.

---

## Features

### Interactive sections

These are the core of the site — each one makes a single argument by demonstration.

| Section | What it does |
| --- | --- |
| **Hero** | The mascot reaches out, pulls in scattered tool bubbles (CRM, invoicing, estimating, client portal) and produces **One System**. |
| **Request journey** | A single customer request walked through 12 steps, side by side: by hand vs. with the system. Live receipts, running timers, and a system chatter track (`sync`, `connected`, `23 ms`, `AI thinking`, `verify`, `completed`). Ends at 8 h 05 vs. 46 min. |
| **System comparison** | Three-state diagram — disconnected tools, a generic platform, and a Blobex system — animated between states. |
| **A day, proven** | A live operations feed showing which work the system handled and which three items actually needed a person. |
| **Speed race** | Two contractors receive the same request; whoever answers first books the job. |
| **Cost race** | Fixed project price against an open-ended hourly meter that keeps climbing. |
| **Scale graph** | Work, time and capacity curves as the business grows, with and without a system. |
| **Sector switcher** | The mascot changes accessory per industry (hard hat, stethoscope, truck…) with the modules that sector actually needs. |

All animation respects `prefers-reduced-motion`, and every section is readable and
complete with animation disabled.

### Pages

- Home
- What we build · Industries · Process · Pricing · About · Contact
- Nine industry pages on clean keyword URLs:
  `/construction-software`, `/manufacturing-software`, `/healthcare-software`,
  `/professional-services-software`, `/logistics-software`, `/distribution-software`,
  `/real-estate-software`, `/hospitality-software`, `/technology-software`
  (and the French equivalents, e.g. `/fr/logiciel-construction`)

### Lead form

Short and low-friction by design: **full name, email, phone, short description.**

- Inline validation with clear error messages, in the visitor's language
- Searchable country dial-code picker with real SVG flags
- On submit: the lead is POSTed to the client's admin API, the team is notified,
  the visitor gets a confirmation, and the conversion is tracked
- If the API is not yet configured, submissions are recorded locally so nothing is
  lost during setup

### SEO

- Unique title and meta description per page, per language
- Clean descriptive URLs, localised per language
- Canonical tags and EN/FR `hreflang` alternates
- Schema.org: Organization, ProfessionalService, LocalBusiness, BreadcrumbList, WebSite
- Generated `sitemap.xml` and `robots.txt`
- Semantic heading hierarchy — one `H1` per page, ordered `H2`/`H3`
- Core Web Vitals: static rendering, optimised images, system-adjacent font loading,
  no layout shift on hero or animation mount

### Accessibility and quality

Keyboard-navigable throughout · skip-to-content link · labelled forms and controls ·
descriptive alt text · reduced-motion support · verified against forced dark mode ·
responsive from 320 px upward with no horizontal overflow.

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · flag-icons

---

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
`extras.ts`), keyed by locale. No component edits are needed to change wording,
a title tag, a meta description or a URL.

## Deploying to Vercel

Import this repository on Vercel. The framework is auto-detected (Next.js) and no
build settings need changing. Add the environment variables above under
**Settings → Environment Variables** when the client's lead API is ready.

## Before launch

- Real phone number and contact email in `src/content/site.ts`
- Production domain in `SITE.domain` (drives canonicals, `hreflang` and the sitemap)
- `LEAD_API_URL` (and key) pointing at the client's existing admin panel
- Native-speaker review of the French copy
