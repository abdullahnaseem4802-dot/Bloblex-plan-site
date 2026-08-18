/* =================================================================
   PAGE CONTENT, industry pages + standalone pages (EN/FR).
   Meta titles/descriptions are unique per page for SEO (PDF p.6).
   ================================================================= */
import type { Locale } from "./site";
import { SECTORS } from "./sectors";

/* ---------- Industry detail pages ---------- */
type IndustryCopy = { hook: string; pains: string[]; outcomes: string[] };

export const INDUSTRY_PAGES: Record<string, Record<Locale, IndustryCopy>> = {
  construction: {
    en: {
      hook: "From the first lead to the final invoice, construction runs on estimates, change orders and site updates that rarely live in one place. We connect them.",
      pains: ["Estimates rebuilt by hand in spreadsheets", "Site, office and accounting on different tools", "Change orders and margins lost between steps"],
      outcomes: ["AI-assisted estimating in minutes, not hours", "One source of truth from bid to billing", "Clear margins and fewer costly mistakes"],
    },
    fr: {
      hook: "Du premier prospect à la facture finale, la construction roule sur des estimations, des avenants et des suivis de chantier rarement réunis au même endroit. On les connecte.",
      pains: ["Estimations refaites à la main dans des chiffriers", "Chantier, bureau et comptabilité sur des outils différents", "Avenants et marges perdus entre les étapes"],
      outcomes: ["Estimation assistée par IA en minutes, pas en heures", "Une seule source de vérité, de la soumission à la facturation", "Des marges claires et moins d'erreurs coûteuses"],
    },
  },
  manufacturing: {
    en: {
      hook: "Manufacturing lives or dies on the link between orders, inventory and the shop floor. We build the system that keeps them in sync.",
      pains: ["Quotes disconnected from real BOM costs", "Production schedules kept in someone's head", "No live view of inventory or capacity"],
      outcomes: ["Quote-to-production in one connected flow", "Scheduling and inventory that update themselves", "Fewer stockouts, less overtime, tighter margins"],
    },
    fr: {
      hook: "Le manufacturier vit du lien entre les commandes, l'inventaire et le plancher de production. On bâtit le système qui les garde synchronisés.",
      pains: ["Soumissions déconnectées des coûts réels de nomenclature", "Ordonnancement gardé dans la tête de quelqu'un", "Aucune vue en temps réel de l'inventaire ou de la capacité"],
      outcomes: ["De la soumission à la production en un seul flux connecté", "Ordonnancement et inventaire qui se mettent à jour seuls", "Moins de ruptures, moins de temps supplémentaire, meilleures marges"],
    },
  },
  healthcare: {
    en: {
      hook: "Clinics and health services juggle intake, scheduling, records and follow-ups across tools that don't talk. We connect them, securely.",
      pains: ["Patient intake and records in separate systems", "Manual scheduling and reminder calls", "Follow-ups that slip through the cracks"],
      outcomes: ["Secure, connected intake-to-billing flow", "Automated scheduling and reminders", "Reliable follow-up and better patient experience"],
    },
    fr: {
      hook: "Cliniques et services de santé jonglent avec l'accueil, les rendez-vous, les dossiers et les suivis sur des outils qui ne se parlent pas. On les connecte, en toute sécurité.",
      pains: ["Accueil patient et dossiers dans des systèmes séparés", "Prise de rendez-vous et rappels manuels", "Des suivis qui passent entre les mailles"],
      outcomes: ["Flux sécurisé et connecté, de l'accueil à la facturation", "Rendez-vous et rappels automatisés", "Un suivi fiable et une meilleure expérience patient"],
    },
  },
  "professional-services": {
    en: {
      hook: "For services firms, time is the product. We connect leads, proposals, delivery and billing so none of it leaks.",
      pains: ["Proposals and follow-ups done manually", "Time and project data scattered", "Slow, error-prone invoicing"],
      outcomes: ["Lead-to-invoice in one pipeline", "Proposals, e-sign and delivery connected", "Faster billing and clearer profitability"],
    },
    fr: {
      hook: "Pour les firmes de services, le temps est le produit. On connecte prospects, propositions, livraison et facturation pour que rien ne se perde.",
      pains: ["Propositions et relances faites à la main", "Données de temps et de projet éparpillées", "Facturation lente et sujette aux erreurs"],
      outcomes: ["Du prospect à la facture dans un seul pipeline", "Propositions, signature et livraison connectées", "Facturation plus rapide et rentabilité plus claire"],
    },
  },
  logistics: {
    en: {
      hook: "Logistics is a race against time. We connect orders, dispatch, tracking and proof of delivery into one live system.",
      pains: ["Dispatch and tracking on separate tools", "Manual proof-of-delivery and billing", "No real-time view for clients"],
      outcomes: ["Order-to-delivery in one connected flow", "Automated proof of delivery and invoicing", "Live visibility for you and your clients"],
    },
    fr: {
      hook: "La logistique est une course contre la montre. On connecte commandes, répartition, suivi et preuve de livraison en un seul système en temps réel.",
      pains: ["Répartition et suivi sur des outils séparés", "Preuve de livraison et facturation manuelles", "Aucune vue en temps réel pour les clients"],
      outcomes: ["De la commande à la livraison en un flux connecté", "Preuve de livraison et facturation automatisées", "Visibilité en temps réel pour vous et vos clients"],
    },
  },
  distribution: {
    en: {
      hook: "Distributors move fast on thin margins. We connect B2B ordering, warehouse and billing so nothing slows you down.",
      pains: ["B2B orders re-keyed by hand", "Pricing and catalog out of sync", "Warehouse and accounting disconnected"],
      outcomes: ["Self-serve B2B ordering portal", "Live inventory, pricing and catalog", "Order-to-cash in one system"],
    },
    fr: {
      hook: "Les distributeurs avancent vite sur de faibles marges. On connecte commandes B2B, entrepôt et facturation pour que rien ne vous ralentisse.",
      pains: ["Commandes B2B ressaisies à la main", "Prix et catalogue désynchronisés", "Entrepôt et comptabilité déconnectés"],
      outcomes: ["Portail de commande B2B en libre-service", "Inventaire, prix et catalogue en temps réel", "De la commande à l'encaissement dans un seul système"],
    },
  },
  "real-estate": {
    en: {
      hook: "Real estate runs on leads, listings, documents and timing. We connect them so no opportunity goes cold.",
      pains: ["Leads spread across inboxes", "Documents and e-sign done manually", "Visit scheduling and commissions tracked by hand"],
      outcomes: ["Lead-to-close in one CRM", "Documents and e-sign connected", "Automated scheduling and commission tracking"],
    },
    fr: {
      hook: "L'immobilier roule sur les prospects, les inscriptions, les documents et le timing. On les connecte pour qu'aucune occasion ne refroidisse.",
      pains: ["Prospects éparpillés dans les boîtes courriel", "Documents et signature faits à la main", "Visites et commissions suivies manuellement"],
      outcomes: ["Du prospect à la conclusion dans un seul CRM", "Documents et signature connectés", "Visites et commissions suivies automatiquement"],
    },
  },
  hospitality: {
    en: {
      hook: "Hospitality is experience at scale. We connect reservations, guests, ordering and staff so every touchpoint is smooth.",
      pains: ["Reservations and guest data siloed", "Manual staff scheduling", "Reviews and follow-up left to chance"],
      outcomes: ["Reservation-to-billing in one flow", "Automated scheduling and guest follow-up", "A consistent, higher-rated guest experience"],
    },
    fr: {
      hook: "L'hôtellerie, c'est l'expérience à grande échelle. On connecte réservations, clients, commandes et personnel pour que chaque point de contact soit fluide.",
      pains: ["Réservations et données clients en silos", "Horaires du personnel gérés à la main", "Avis et suivis laissés au hasard"],
      outcomes: ["De la réservation à la facturation en un flux", "Horaires et suivis clients automatisés", "Une expérience client constante et mieux notée"],
    },
  },
  technology: {
    en: {
      hook: "Tech products scale on clean data and automation. We connect acquisition, onboarding, usage and billing into one engine.",
      pains: ["Onboarding and billing stitched together manually", "Usage data trapped in silos", "Growth adds complexity, not clarity"],
      outcomes: ["Signup-to-revenue in one connected flow", "Automated onboarding and subscription billing", "Clear analytics that scale with you"],
    },
    fr: {
      hook: "Les produits techno grandissent grâce à des données propres et à l'automatisation. On connecte acquisition, intégration, usage et facturation en un seul moteur.",
      pains: ["Intégration et facturation reliées à la main", "Données d'usage prisonnières de silos", "La croissance ajoute de la complexité, pas de la clarté"],
      outcomes: ["De l'inscription au revenu en un flux connecté", "Intégration et facturation d'abonnement automatisées", "Une analytique claire qui grandit avec vous"],
    },
  },
};

export function industryName(id: string, locale: Locale): string {
  return SECTORS.find((s) => s.id === id)?.name[locale] ?? id;
}

export function industryMeta(id: string, locale: Locale) {
  const name = industryName(id, locale);
  return locale === "en"
    ? {
        title: `${name} Software. Custom Systems Built Around Your Operations | Blobex`,
        description: `Blobex builds custom ${name.toLowerCase()} software: automation, client portals, AI estimating and the connected tools your ${name.toLowerCase()} business runs on. Granby, Quebec.`,
        h1: `Custom software for ${name.toLowerCase()}.`,
      }
    : {
        title: `Logiciel ${name}. Systèmes sur mesure bâtis autour de vos opérations | Blobex`,
        description: `Blobex conçoit des logiciels sur mesure pour le secteur ${name.toLowerCase()} : automatisation, portails clients, estimation IA et les outils connectés dont votre entreprise a besoin. Granby, Québec.`,
        h1: `Logiciel sur mesure pour le secteur ${name.toLowerCase()}.`,
      };
}

/* ---------- Standalone page meta + hero copy ---------- */
type Hero = { kicker: string; title: string; lead: string };
type Meta = { title: string; description: string };

export const PAGE_META: Record<string, Record<Locale, Meta>> = {
  whatWeBuild: {
    en: { title: "What We Build. Custom Software, Platforms & Automation | Blobex", description: "Custom software, internal platforms, automation, client portals and AI tools built around how your business actually works. See what Blobex builds." },
    fr: { title: "Ce qu'on bâtit. Logiciels, plateformes et automatisation sur mesure | Blobex", description: "Logiciels sur mesure, plateformes internes, automatisation, portails clients et outils IA bâtis autour du fonctionnement réel de votre entreprise." },
  },
  industries: {
    en: { title: "Industries. Custom Systems for Your Field | Blobex", description: "Construction, manufacturing, healthcare, logistics and more. See the connected system Blobex can build for your industry." },
    fr: { title: "Secteurs. Des systèmes sur mesure pour votre domaine | Blobex", description: "Construction, manufacturier, santé, logistique et plus. Découvrez le système connecté que Blobex peut bâtir pour votre secteur." },
  },
  process: {
    en: { title: "Our Process. Understand, Design, Build, Improve | Blobex", description: "A clear process with a fixed scope, timeline and price defined before development. See how Blobex works." },
    fr: { title: "Notre processus. Comprendre, concevoir, bâtir, améliorer | Blobex", description: "Un processus clair, avec une portée, un échéancier et un prix fixes définis avant le développement. Découvrez comment Blobex travaille." },
  },
  pricing: {
    en: { title: "Pricing. Fixed Scope, Fixed Price | Blobex", description: "Project-based pricing: scope, deliverables and price are defined before development. No hourly meter running." },
    fr: { title: "Tarification. Portée fixe, prix fixe | Blobex", description: "Tarification par projet : la portée, les livrables et le prix sont définis avant le développement. Pas de compteur à l'heure." },
  },
  contact: {
    en: { title: "Contact Blobex. Start a Project | Granby, Quebec", description: "Tell us what slows you down. Short, low-friction contact form, the start of a useful business conversation." },
    fr: { title: "Contacter Blobex. Démarrer un projet | Granby, Québec", description: "Dites-nous ce qui vous ralentit. Formulaire court et sans friction, le début d'une vraie conversation d'affaires." },
  },
  about: {
    en: { title: "About Blobex. Custom Software in Granby, Quebec", description: "We study how your business operates and build the custom software around it. Learn about our approach, ownership and process." },
    fr: { title: "À propos de Blobex. Logiciels sur mesure à Granby, Québec", description: "On étudie le fonctionnement de votre entreprise et on bâtit le logiciel sur mesure autour. Découvrez notre approche, la propriété et le processus." },
  },
};

export const PAGE_HERO: Record<string, Record<Locale, Hero>> = {
  whatWeBuild: {
    en: { kicker: "What Blobex builds", title: "The system your business actually runs on.", lead: "Custom software, platforms and specialized tools around your rules, data and workflow: estimating, operations, billing, portals, AI and industry-specific tools." },
    fr: { kicker: "Ce que Blobex bâtit", title: "Le système sur lequel votre entreprise roule vraiment.", lead: "Logiciels, plateformes et outils spécialisés autour de vos règles, vos données et votre flux : estimation, opérations, facturation, portails, IA et outils propres à votre secteur." },
  },
  industries: {
    en: { kicker: "Built for your industry", title: "Pick your sector. See the system you could have.", lead: "Same idea, your operations. Choose an industry to see the connected system Blobex can build." },
    fr: { kicker: "Conçu pour votre secteur", title: "Choisissez votre secteur. Voyez le système que vous pourriez avoir.", lead: "Même idée, vos opérations. Choisissez un secteur pour voir le système connecté que Blobex peut bâtir." },
  },
  process: {
    en: { kicker: "How we work", title: "A clear process, with the price defined before we build.", lead: "Understand, measure, design, build, deploy, improve, with a fixed scope, timeline and price agreed up front." },
    fr: { kicker: "Notre façon de travailler", title: "Un processus clair, avec le prix défini avant de bâtir.", lead: "Comprendre, mesurer, concevoir, bâtir, déployer, améliorer, avec une portée, un échéancier et un prix fixes convenus d'avance." },
  },
  pricing: {
    en: { kicker: "Pricing that protects you", title: "The price is agreed before we build, not after.", lead: "Project-based pricing defined before development. Additions are approved separately, so you always know what you're paying for." },
    fr: { kicker: "Une tarification qui vous protège", title: "Le prix est convenu avant de bâtir, pas après.", lead: "Tarification par projet définie avant le développement. Les ajouts sont approuvés séparément, vous savez toujours ce que vous payez." },
  },
  contact: {
    en: { kicker: "Start a conversation", title: "Tell us what slows you down.", lead: "The start of a useful business conversation, not a long questionnaire." },
    fr: { kicker: "Amorçons la conversation", title: "Dites-nous ce qui vous ralentit.", lead: "Le début d'une vraie conversation d'affaires, pas un long questionnaire." },
  },
  about: {
    en: { kicker: "About Blobex", title: "We build the client's system, not a generic product.", lead: "We study how your business actually operates, then build custom software around your rules, data and workflow. Based in Granby, Quebec." },
    fr: { kicker: "À propos de Blobex", title: "On bâtit le système du client, pas un produit générique.", lead: "On étudie le fonctionnement réel de votre entreprise, puis on bâtit le logiciel sur mesure autour de vos règles, vos données et votre flux. Basé à Granby, au Québec." },
  },
};
