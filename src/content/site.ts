/* =================================================================
   BLOBEX. EDITABLE CONTENT LAYER
   -----------------------------------------------------------------
   Every piece of copy, every SEO title/description and every URL
   label lives here so it can be edited without touching components.
   This is the seam a headless CMS (Payload / Sanity) plugs into later
   (PDF p.6: "content, metadata and URLs must be easy to modify").
   ================================================================= */

export type Locale = "en" | "fr";

export const SITE = {
  name: "Blobex",
  legalName: "Blobex Inc.",
  domain: "https://www.blobex.ca",
  email: "equipe@blobex.ca",
  phone: "+1-000-000-0000", // TODO: real number from client
  location: { city: "Granby", region: "Quebec", country: "Canada", countryCode: "CA" },
  brandBlue: "#29abe2",
  ink: "#0a1628",
} as const;

type Dict = {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  nav: { what: string; time: string; sectors: string; process: string; pricing: string; cta: string };
  hero: {
    eyebrow: string; titleLine1: string; titleLine2: string; lead: string;
    ctaPrimary: string; ctaSecondary: string; note: string; chips: string[]; scroll: string; systemLabel: string; trust: string[];
  };
  what: { kicker: string; title: string; lead: string; cards: { title: string; body: string }[] };
  time: { kicker: string; title: string; lead: string; soon: string };
  sectors: { kicker: string; title: string; lead: string; list: string[]; soon: string };
  process: { kicker: string; title: string; lead: string; lockAt: number; lockLabel: string;
    steps: { name: string; what: string; get: string }[] };
  pricing: { kicker: string; title: string; lead: string };
  contact: {
    kicker: string; title: string; lead: string;
    name: string; emailL: string; phoneL: string; message: string;
    send: string; sending: string; hint: string; ok: string; err: string;
    reasons: string[]; reasonLabel: string;
    errName: string; errEmail: string; errPhone: string; errMessage: string;
    searchCountry: string; phonePlaceholder: string; emailPlaceholder: string;
    namePlaceholder: string; messagePlaceholder: string; okTitle: string; required: string;
  };
  footer: { tagline: string; rights: string };
};

export const CONTENT: Record<Locale, Dict> = {
  en: {
    meta: {
      title: "Blobex · Custom Software & Systems That Run Your Business, Granby QC",
      description:
        "We build custom software, internal platforms, automation and client portals designed around how your business actually works. A system that fits your operations, not another software expense.",
      ogTitle: "Blobex: Custom Systems That Run Your Business",
      ogDescription:
        "We build the custom software your business runs on: automation, portals, estimating, AI and industry-specific tools, connected into one system.",
    },
    nav: { what: "What we build", time: "Save time", sectors: "Your industry", process: "Process", pricing: "Pricing", cta: "Start a project" },
    hero: {
      eyebrow: "Custom software · Granby, Quebec",
      titleLine1: "One system that runs",
      titleLine2: "your whole business.",
      lead:
        "We study how your company actually works, then build the custom software around it: automation, AI, estimating, portals and the tools your team needs, all connected. Not another subscription. A system that finally fits your operations.",
      ctaPrimary: "Start a project",
      ctaSecondary: "See how much time you lose",
      note: "An investment in growth, not another software expense.",
      chips: ["Automation", "AI tools", "Client portal", "Estimating", "Invoicing", "CRM"],
      scroll: "Scroll",
      systemLabel: "One System",
      trust: ["Fixed scope & price", "You own the system", "Built around your workflow"],
    },
    what: {
      kicker: "What Blobex builds",
      title: "Beyond a basic CRM: the system your business actually runs on.",
      lead:
        "We create custom software, platforms and specialized tools around your rules, your data and your workflow: estimating, design, inventory, production, operations, billing, portals, AI and industry-specific tools.",
      cards: [
        { title: "Custom software & platforms", body: "Internal systems built around how your team really works, not a template you have to bend to." },
        { title: "Automation & AI", body: "Leads, quotes, estimates and invoices that move themselves, so your people stop doing it by hand." },
        { title: "Client portals", body: "One connected place for your clients and your operations, instead of email, spreadsheets and five subscriptions." },
      ],
    },
    time: {
      kicker: "See it for yourself",
      title: "See exactly where your time goes.",
      lead:
        "Move one lead through a disconnected business by hand, and watch the hours pile up. Then see the same lead run itself on a connected Blobex system.",
      soon: "",
    },
    sectors: {
      kicker: "Built for your industry",
      title: "Pick your sector. See the system you could have.",
      lead: "The connected system changes with your field. Same idea, your operations.",
      list: ["Construction", "Manufacturing", "Healthcare", "Professional services", "Logistics", "Distribution", "Real estate", "Hospitality", "Technology products"],
      soon: "Coming in the next build: the sector switcher where the blob changes its tools (helmet, stethoscope, truck…) and shows the connected system for each industry.",
    },
    process: {
      kicker: "How we work",
      title: "A clear process, with the price defined before we build.",
      lead: "Six steps. You know the scope, the price and the date before a line of code is written.",
      lockAt: 2,
      lockLabel: "Price and timeline locked here — before a line of code",
      steps: [
        { name: "Understand", what: "We sit with your team and watch how the work actually moves, not how it is supposed to.", get: "A written map of your operation" },
        { name: "Measure", what: "We count what the manual steps really cost you in hours, so the decision is numbers and not opinion.", get: "The hours and the dollars at stake" },
        { name: "Design", what: "We draw the system around the way you already work, and we agree on exactly what is being built.", get: "Fixed scope, fixed price, fixed date" },
        { name: "Build", what: "We build in stages you can see and use, instead of disappearing for three months.", get: "Working software every two weeks" },
        { name: "Deploy", what: "We move your people onto it and stay on the floor while it settles into the day.", get: "Your team running on it" },
        { name: "Improve", what: "It is yours, so every piece can be pushed as far as you want, whenever you want.", get: "A system that keeps growing with you" },
      ],
    },
    pricing: {
      kicker: "Pricing that protects you",
      title: "Fixed scope. Fixed price. No meter running.",
      lead:
        "Agencies that bill by the hour have no reason to work fast. The longer it takes, the more they earn. We define the scope, deliverables and price before development. Additions are approved separately.",
    },
    contact: {
      kicker: "Start a conversation",
      title: "Tell us what slows you down.",
      lead: "The start of a useful business conversation, not a long questionnaire.",
      name: "Full name", emailL: "Email", phoneL: "Phone", message: "Briefly, what do you need?",
      send: "Send", sending: "Sending…",
      hint: "We reply from Granby, Quebec, usually within one business day.",
      ok: "Thank you, your request was sent. We'll be in touch shortly.",
      err: "Something went wrong. Please try again or email us directly.",
      reasonLabel: "Subject",
      reasons: ["Request more information", "Launch or discuss a new project", "Analyze an operational or automation opportunity", "Improve or replace an existing system"],
      errName: "Please enter your full name.",
      errEmail: "Please enter a valid email address.",
      errPhone: "Please enter a valid phone number.",
      errMessage: "Please tell us briefly what you need.",
      searchCountry: "Search country",
      phonePlaceholder: "450 555 0123",
      emailPlaceholder: "you@company.com",
      namePlaceholder: "Jane Tremblay",
      messagePlaceholder: "A few lines about your business and what you'd like to improve.",
      okTitle: "Request sent",
      required: "Required",
    },
    footer: { tagline: "Custom software, platforms and automation built around your business.", rights: "All rights reserved." },
  },

  fr: {
    meta: {
      title: "Blobex · Logiciels sur mesure qui font rouler votre entreprise, Granby QC",
      description:
        "On conçoit des logiciels sur mesure, des plateformes internes, de l'automatisation et des portails clients bâtis autour du fonctionnement réel de votre entreprise. Un système qui s'adapte à vos opérations, pas une dépense logicielle de plus.",
      ogTitle: "Blobex : des systèmes sur mesure qui font rouler votre entreprise",
      ogDescription:
        "Nous bâtissons le logiciel sur mesure qui fait rouler votre entreprise : automatisation, portails, estimation, IA et outils propres à votre secteur, connectés en un seul système.",
    },
    nav: { what: "Ce qu'on bâtit", time: "Gagnez du temps", sectors: "Votre secteur", process: "Processus", pricing: "Tarification", cta: "Démarrer un projet" },
    hero: {
      eyebrow: "Logiciels sur mesure · Granby, Québec",
      titleLine1: "Un seul système pour faire rouler",
      titleLine2: "toute votre entreprise.",
      lead:
        "On étudie le fonctionnement réel de votre entreprise, puis on bâtit le logiciel sur mesure autour : automatisation, IA, estimation, portails et les outils dont votre équipe a besoin, tous connectés. Pas un abonnement de plus. Un système qui s'adapte enfin à vos opérations.",
      ctaPrimary: "Démarrer un projet",
      ctaSecondary: "Voyez le temps que vous perdez",
      note: "Un investissement dans la croissance, pas une dépense logicielle de plus.",
      chips: ["Automatisation", "Outils IA", "Portail client", "Estimation", "Facturation", "CRM"],
      scroll: "Défiler",
      systemLabel: "Un seul système",
      trust: ["Portée et prix fixes", "Vous possédez le système", "Bâti autour de votre flux"],
    },
    what: {
      kicker: "Ce que Blobex bâtit",
      title: "Bien au-delà d'un simple CRM : le système sur lequel votre entreprise roule vraiment.",
      lead:
        "Nous créons des logiciels, des plateformes et des outils spécialisés autour de vos règles, vos données et votre flux de travail : estimation, conception, inventaire, production, opérations, facturation, portails, IA et outils propres à votre secteur.",
      cards: [
        { title: "Logiciels et plateformes sur mesure", body: "Des systèmes internes bâtis autour du travail réel de votre équipe, pas un gabarit auquel vous devez vous plier." },
        { title: "Automatisation et IA", body: "Prospects, soumissions, estimations et factures qui avancent tout seuls, votre monde arrête de le faire à la main." },
        { title: "Portails clients", body: "Un seul endroit connecté pour vos clients et vos opérations, au lieu des courriels, des chiffriers et de cinq abonnements." },
      ],
    },
    time: {
      kicker: "Voyez par vous-même",
      title: "Voyez exactement où passe votre temps.",
      lead:
        "Déplacez un seul prospect à la main dans une entreprise déconnectée, et regardez les heures s'accumuler. Puis voyez le même prospect se traiter tout seul avec un système Blobex connecté.",
      soon: "",
    },
    sectors: {
      kicker: "Conçu pour votre secteur",
      title: "Choisissez votre secteur. Voyez le système que vous pourriez avoir.",
      lead: "Le système connecté change selon votre domaine. Même idée, vos opérations.",
      list: ["Construction", "Manufacturier", "Santé", "Services professionnels", "Logistique", "Distribution", "Immobilier", "Hôtellerie", "Produits technologiques"],
      soon: "À venir dans la prochaine version : le sélecteur de secteur où le blob change ses outils (casque, stéthoscope, camion…) et montre le système connecté de chaque secteur.",
    },
    process: {
      kicker: "Notre façon de travailler",
      title: "Un processus clair, avec le prix défini avant de bâtir.",
      lead: "Six étapes. Tu connais la portée, le prix et la date avant la première ligne de code.",
      lockAt: 2,
      lockLabel: "Prix et échéancier bloqués ici — avant la première ligne de code",
      steps: [
        { name: "Comprendre", what: "On s'assoit avec ton monde et on regarde comment la job avance pour vrai, pas comment elle est supposée avancer.", get: "Une carte écrite de ton opération" },
        { name: "Mesurer", what: "On compte ce que les étapes à la main te coûtent en heures. Des chiffres, pas des opinions.", get: "Les heures et les dollars en jeu" },
        { name: "Concevoir", what: "On dessine le système autour de ta façon de travailler, et on s'entend sur exactement ce qui se bâtit.", get: "Portée fixe, prix fixe, date fixe" },
        { name: "Bâtir", what: "On bâtit par étapes que tu vois et que tu utilises, au lieu de disparaître trois mois.", get: "Du logiciel qui roule aux deux semaines" },
        { name: "Déployer", what: "On embarque ton monde dessus et on reste sur le plancher le temps que ça s'installe.", get: "Ton équipe qui roule dessus" },
        { name: "Améliorer", what: "Il est à toi, donc chaque morceau peut être poussé aussi loin que tu veux, quand tu veux.", get: "Un système qui continue de grandir" },
      ],
    },
    pricing: {
      kicker: "Une tarification qui vous protège",
      title: "Portée fixe. Prix fixe. Pas de compteur qui roule.",
      lead:
        "Les agences facturées à l'heure n'ont aucun intérêt à aller vite. Plus ça traîne, plus elles gagnent. On définit la portée, les livrables et le prix avant le développement. Les ajouts sont approuvés séparément.",
    },
    contact: {
      kicker: "Amorçons la conversation",
      title: "Dites-nous ce qui vous ralentit.",
      lead: "Le début d'une vraie conversation d'affaires, pas un long questionnaire.",
      name: "Nom complet", emailL: "Courriel", phoneL: "Téléphone", message: "En bref, de quoi avez-vous besoin ?",
      send: "Envoyer", sending: "Envoi…",
      hint: "Nous répondons depuis Granby, au Québec, généralement en un jour ouvrable.",
      ok: "Merci, votre demande a été envoyée. Nous vous contacterons sous peu.",
      err: "Une erreur est survenue. Réessayez ou écrivez-nous directement.",
      reasonLabel: "Sujet",
      reasons: ["Obtenir plus d'information", "Lancer ou discuter d'un nouveau projet", "Analyser une opportunité d'automatisation", "Améliorer ou remplacer un système existant"],
      errName: "Veuillez entrer votre nom complet.",
      errEmail: "Veuillez entrer une adresse courriel valide.",
      errPhone: "Veuillez entrer un numéro de téléphone valide.",
      errMessage: "Dites-nous brièvement ce dont vous avez besoin.",
      searchCountry: "Rechercher un pays",
      phonePlaceholder: "450 555 0123",
      emailPlaceholder: "vous@entreprise.com",
      namePlaceholder: "Jeanne Tremblay",
      messagePlaceholder: "Quelques lignes sur votre entreprise et ce que vous aimeriez améliorer.",
      okTitle: "Demande envoyée",
      required: "Requis",
    },
    footer: { tagline: "Logiciels, plateformes et automatisation sur mesure, bâtis autour de votre entreprise.", rights: "Tous droits réservés." },
  },
};

/** Locale-aware path helper. English at root, French under /fr (clean URLs, hreflang). */
export function localePath(locale: Locale, path = "/") {
  const clean = path === "/" ? "" : path;
  return locale === "en" ? `/${clean}`.replace("//", "/") : `/fr${clean ? `/${clean}` : ""}`;
}
