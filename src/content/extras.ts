/* =================================================================
   EXTRA WHITEBOARD SECTIONS (folder 3)
   - Automation picker game ("Jeux interactif")
   - Competition: hourly vs fixed
   - "The Uncomparable" price-match
   EN + FR.
   ================================================================= */
import type { Locale } from "./site";

/* ---- Automation picker ---- */
export const AUTOMATION_TASKS: { id: string; label: Record<Locale, string>; hoursPerWeek: number }[] = [
  { id: "invoicing", label: { en: "Invoicing", fr: "Facturation" }, hoursPerWeek: 3 },
  { id: "quotes", label: { en: "Quotes & estimates", fr: "Soumissions & estimations" }, hoursPerWeek: 4 },
  { id: "followup", label: { en: "Lead follow-up", fr: "Relance des prospects" }, hoursPerWeek: 3 },
  { id: "dataentry", label: { en: "Data entry between tools", fr: "Saisie entre les outils" }, hoursPerWeek: 4 },
  { id: "scheduling", label: { en: "Scheduling", fr: "Prise de rendez-vous" }, hoursPerWeek: 2 },
  { id: "reporting", label: { en: "Reporting", fr: "Rapports" }, hoursPerWeek: 2 },
  { id: "updates", label: { en: "Client updates", fr: "Suivis clients" }, hoursPerWeek: 2 },
  { id: "reminders", label: { en: "Reminders", fr: "Rappels" }, hoursPerWeek: 1 },
];

export const AUTOMATION_UI: Record<Locale, {
  kicker: string; title: string; lead: string;
  savedLabel: string; perWeek: string; perYear: string; automated: string; hint: string; cta: string;
}> = {
  en: {
    kicker: "Interactive, see it for yourself",
    title: "Pick what you'd automate. Watch the time come back.",
    lead: "Select the work you do by hand today. This is the time a connected Blobex system gives back to your team.",
    savedLabel: "Time saved", perWeek: "/ week", perYear: "≈ per year", automated: "automated", hint: "Rough estimates for illustration, your real numbers come from the discovery call.",
    cta: "Get my time back",
  },
  fr: {
    kicker: "Interactif, voyez par vous-même",
    title: "Choisissez ce que vous automatiseriez. Regardez le temps revenir.",
    lead: "Sélectionnez le travail que vous faites à la main aujourd'hui. Voilà le temps qu'un système Blobex connecté redonne à votre équipe.",
    savedLabel: "Temps récupéré", perWeek: "/ semaine", perYear: "≈ par année", automated: "automatisé", hint: "Estimations approximatives à titre indicatif, vos vrais chiffres viennent de l'appel découverte.",
    cta: "Récupérer mon temps",
  },
};

/* ---- Scale graphs (whiteboard folder 1, "Second Page") ---- */
export const SCALE_UI: Record<Locale, {
  kicker: string; title: string; lead: string;
  panelA: string; panelB: string; work: string; time: string; capacity: string; xAxis: string; yAxis: string; note: string;
  workShort: string; timeShort: string; capacityShort: string;
}> = {
  en: {
    kicker: "Scale without the chaos",
    title: "More clients shouldn't mean more chaos.",
    lead: "Without a connected system, every new client piles on administrative work and eats your time. With a Blobex system, the work stays flat while your capacity keeps climbing.",
    panelA: "Without a connected system",
    panelB: "With a Blobex system",
    work: "Admin work", time: "Your free time", capacity: "Your capacity",
    workShort: "Admin", timeShort: "Free time", capacityShort: "Capacity",
    xAxis: "Number of clients →", yAxis: "Workload / time",
    note: "Same growth, a completely different curve.",
  },
  fr: {
    kicker: "Grandir sans le chaos",
    title: "Plus de clients ne devrait pas rimer avec plus de chaos.",
    lead: "Sans système connecté, chaque nouveau client ajoute du travail administratif et gruge votre temps. Avec un système Blobex, le travail reste stable pendant que votre capacité continue de grimper.",
    panelA: "Sans système connecté",
    panelB: "Avec un système Blobex",
    work: "Travail administratif", time: "Votre temps libre", capacity: "Votre capacité",
    workShort: "Admin", timeShort: "Temps libre", capacityShort: "Capacité",
    xAxis: "Nombre de clients →", yAxis: "Charge / temps",
    note: "Même croissance, une courbe complètement différente.",
  },
};

/* ---- Competition graph ---- */
export const COMPETITION_UI: Record<Locale, {
  kicker: string; title: string; lead: string;
  themLabel: string; usLabel: string; xAxis: string; yAxis: string; note: string;
}> = {
  en: {
    kicker: "Why the way you're billed matters",
    title: "Hourly agencies profit when the project is slow.",
    lead: "Bill by the hour and there's no reason to move fast. The longer it takes, the more they earn. Blobex commits to a fixed scope, timeline and price. Your cost stays flat; only the progress goes up.",
    themLabel: "Agencies, billed by the hour", usLabel: "Blobex, fixed price & timeline",
    xAxis: "Project progress", yAxis: "Your cost", note: "Fixed price, fixed timeline. It rises with how productive we are, not with the clock.",
  },
  fr: {
    kicker: "Pourquoi le mode de facturation compte",
    title: "Les agences à l'heure profitent quand le projet traîne.",
    lead: "Facturé à l'heure, personne n'a intérêt à aller vite. Plus ça traîne, plus elles gagnent. Blobex s'engage sur une portée, un échéancier et un prix fixes. Votre coût reste stable ; seule la progression monte.",
    themLabel: "Agences, facturées à l'heure", usLabel: "Blobex, prix & échéancier fixes",
    xAxis: "Avancement du projet", yAxis: "Votre coût", note: "Prix fixe, échéancier fixe. Ça monte avec notre productivité, pas avec l'horloge.",
  },
};

/* ---- Audience + qualifying problems (PDF p2) ---- */
export const AUDIENCE_UI: Record<Locale, {
  kicker: string; title: string; attractTitle: string; problemsTitle: string; attract: string[]; problems: string[];
}> = {
  en: {
    kicker: "Who Blobex is for",
    title: "Built for ambitious owners, not casual software shoppers.",
    attractTitle: "Who we work with",
    problemsTitle: "The problems we solve",
    attract: [
      "Owners who no longer have enough time to manage everything manually.",
      "Companies that want to grow without adding the same amount of administrative staff.",
      "Managers who want more profit, lower operating costs or better capacity.",
      "Businesses using disconnected tools that don't fit their operations.",
      "Companies that need a custom estimating tool, client portal, internal system, automation or technology product.",
    ],
    problems: [
      "Repetitive work, duplicate data entry and manual follow-ups.",
      "Important information spread across email, spreadsheets and multiple subscriptions.",
      "Growth creates more complexity, more hiring and more errors.",
      "Existing software forces the business to adapt to the tool.",
      "A valuable technology idea, but no internal team to build it.",
    ],
  },
  fr: {
    kicker: "À qui s'adresse Blobex",
    title: "Pour les propriétaires ambitieux, pas les acheteurs de logiciels occasionnels.",
    attractTitle: "Avec qui on travaille",
    problemsTitle: "Les problèmes qu'on règle",
    attract: [
      "Des propriétaires qui n'ont plus le temps de tout gérer à la main.",
      "Des entreprises qui veulent grandir sans ajouter autant de personnel administratif.",
      "Des gestionnaires qui veulent plus de profit, moins de coûts ou plus de capacité.",
      "Des entreprises avec des outils déconnectés qui ne collent pas à leurs opérations.",
      "Des entreprises qui ont besoin d'un outil d'estimation, d'un portail client, d'un système interne, d'automatisation ou d'un produit techno sur mesure.",
    ],
    problems: [
      "Travail répétitif, saisie en double et relances manuelles.",
      "Information importante éparpillée entre courriels, chiffriers et abonnements.",
      "La croissance ajoute de la complexité, des embauches et des erreurs.",
      "Le logiciel existant force l'entreprise à s'adapter à l'outil.",
      "Une bonne idée technologique, mais pas d'équipe interne pour la bâtir.",
    ],
  },
};

/* ---- Core positioning + why the investment matters (PDF p3) ---- */
export const POSITIONING_UI: Record<Locale, {
  kicker: string; title: string; lead: string; coreTitle: string; whyTitle: string; core: string[]; why: string[];
}> = {
  en: {
    kicker: "Positioning & value",
    title: "Blobex builds the client's system, not a generic product.",
    lead: "Blobex is not selling programming hours. Blobex is building operational leverage.",
    coreTitle: "Core positioning",
    whyTitle: "Why the investment matters",
    core: [
      "Blobex studies how your business actually operates.",
      "We create custom software, platforms and specialized tools around your rules, data and workflow.",
      "We go beyond a basic CRM: estimating, design, inventory, production, operations, billing, portals, AI and industry-specific tools.",
    ],
    why: [
      "Save owner and employee time.",
      "Increase the number of clients or projects you can handle.",
      "Reduce operating costs, mistakes and dependency on manual work.",
      "Create better visibility, control and consistency.",
      "Build a long-term technology asset that supports growth.",
    ],
  },
  fr: {
    kicker: "Positionnement & valeur",
    title: "Blobex bâtit le système du client, pas un produit générique.",
    lead: "Blobex ne vend pas des heures de programmation. Blobex bâtit un levier opérationnel.",
    coreTitle: "Positionnement de base",
    whyTitle: "Pourquoi l'investissement compte",
    core: [
      "Blobex étudie le fonctionnement réel de votre entreprise.",
      "Nous créons des logiciels, plateformes et outils spécialisés autour de vos règles, vos données et votre flux.",
      "Nous allons au-delà d'un simple CRM : estimation, conception, inventaire, production, opérations, facturation, portails, IA et outils sectoriels.",
    ],
    why: [
      "Faire gagner du temps au propriétaire et aux employés.",
      "Augmenter le nombre de clients ou de projets que vous pouvez gérer.",
      "Réduire les coûts, les erreurs et la dépendance au travail manuel.",
      "Créer une meilleure visibilité, un meilleur contrôle et de la constance.",
      "Bâtir un actif technologique durable qui soutient la croissance.",
    ],
  },
};

/* ---- Fragility / resilience (whiteboard Page 5: "une ligne casse, tout casse") ---- */
export const RESILIENCE_UI: Record<Locale, {
  kicker: string; title: string; lead: string;
  panelA: string; panelB: string; instruction: string;
  core: string; operational: string; down: string;
  brokeNote: string; healNote: string; reset: string; swapping: string; swapped: string;
  tools: string[];
}> = {
  en: {
    kicker: "The hidden risk of disconnected tools",
    title: "One line breaks, everything breaks.",
    lead: "Most businesses run on separate tools stitched together: website, CRM, estimating, communication, files, invoicing. Disconnect one and the whole thing falls over. A Blobex system is built to survive it. Click a tool to see what happens.",
    panelA: "Disconnected tools",
    panelB: "A Blobex system",
    instruction: "Click a tool to disconnect it.",
    core: "Your business", operational: "Operational", down: "System down",
    brokeNote: "One line breaks, everything breaks.",
    healNote: "One fails, we swap it. Everything keeps running.",
    reset: "Reset", swapping: "Swapping…", swapped: "Swapped",
    tools: ["Website", "CRM", "Estimating", "Communication", "Files", "Invoicing"],
  },
  fr: {
    kicker: "Le risque caché des outils déconnectés",
    title: "Une ligne casse, tout casse.",
    lead: "La plupart des entreprises roulent sur des outils séparés reliés à la va-vite : site web, CRM, estimation, communication, fichiers, facturation. Débranchez-en un et tout s'effondre. Un système Blobex est bâti pour y survivre. Cliquez sur un outil pour voir.",
    panelA: "Outils déconnectés",
    panelB: "Un système Blobex",
    instruction: "Cliquez sur un outil pour le déconnecter.",
    core: "Votre entreprise", operational: "Fonctionnel", down: "Système en panne",
    brokeNote: "Une ligne casse, tout casse.",
    healNote: "Un outil lâche, on le remplace. Tout continue de rouler.",
    reset: "Réinitialiser", swapping: "Remplacement…", swapped: "Remplacé",
    tools: ["Site web", "CRM", "Estimation", "Communication", "Fichiers", "Facturation"],
  },
};

/* ---- Generic software vs custom system (PDF p4) ---- */
export const WHYCUSTOM_UI: Record<Locale, {
  kicker: string; title: string; genericLabel: string; customLabel: string;
  generic: string[]; custom: string[];
}> = {
  en: {
    kicker: "Generic software vs a system built around you",
    title: "Stop bending your business to fit the software.",
    genericLabel: "Generic software",
    customLabel: "A Blobex system",
    generic: ["You adapt your business to the tool", "Pay per seat, forever", "Features you'll never use, and gaps you can't fill", "Data spread across separate subscriptions", "You never really own it"],
    custom: ["Built around your exact workflow", "A one-time build you own", "Only the tools you need, connected", "One system, one source of truth", "A long-term asset that grows with you"],
  },
  fr: {
    kicker: "Logiciel générique vs système bâti pour vous",
    title: "Arrêtez de plier votre entreprise au logiciel.",
    genericLabel: "Logiciel générique",
    customLabel: "Un système Blobex",
    generic: ["Vous adaptez votre entreprise à l'outil", "Payer par utilisateur, pour toujours", "Des fonctions inutiles, et des manques impossibles à combler", "Des données éparpillées entre les abonnements", "Vous ne le possédez jamais vraiment"],
    custom: ["Bâti autour de votre flux de travail exact", "Un développement unique que vous possédez", "Seulement les outils dont vous avez besoin, connectés", "Un seul système, une seule source de vérité", "Un actif durable qui grandit avec vous"],
  },
};

/* ---- Ownership / confidentiality / security / maintenance (PDF p4) ---- */
export const ASSURANCES_UI: Record<Locale, {
  kicker: string; title: string; items: { title: string; body: string }[];
}> = {
  en: {
    kicker: "What you can count on",
    title: "Ownership, security and support, clear from the start.",
    items: [
      { title: "Ownership", body: "You own the system we build, the code, the data, all of it." },
      { title: "Confidentiality", body: "Your data and processes stay private, covered by a clear agreement." },
      { title: "Security", body: "HTTPS, secure forms and sensible protections built in from day one." },
      { title: "Documentation", body: "Clear documentation so your team is never locked out." },
      { title: "External dependencies", body: "We keep outside dependencies to a minimum, and if one breaks, it's swappable." },
      { title: "Maintenance", body: "Defined maintenance and support responsibilities, agreed up front." },
    ],
  },
  fr: {
    kicker: "Ce sur quoi vous pouvez compter",
    title: "Propriété, sécurité et soutien, clairs dès le départ.",
    items: [
      { title: "Propriété", body: "Vous possédez le système qu'on bâtit, le code, les données, tout." },
      { title: "Confidentialité", body: "Vos données et vos processus restent privés, encadrés par une entente claire." },
      { title: "Sécurité", body: "HTTPS, formulaires sécurisés et protections sensées, dès le premier jour." },
      { title: "Documentation", body: "Une documentation claire pour que votre équipe ne soit jamais coincée." },
      { title: "Dépendances externes", body: "On limite les dépendances externes, et si l'une brise, elle est remplaçable." },
      { title: "Maintenance", body: "Des responsabilités de maintenance et de soutien définies d'avance." },
    ],
  },
};

/* ---- The Uncomparable ---- */
export const UNCOMPARABLE_UI: Record<Locale, {
  kicker: string; title: string; lead: string;
  placeholder: string; button: string; done: string; points: string[]; cta: string;
}> = {
  en: {
    kicker: "The Uncomparable",
    title: "Bring us a quote. We'll beat it.",
    lead: "Already have a proposal from another agency? Send it over. We'll come back with a better scope, a better price and a better timeline, or we'll tell you honestly if we're not the right fit.",
    placeholder: "Your current quote (optional)",
    button: "Beat my quote",
    done: "Perfect, send it through the form below and we'll come back with a stronger offer.",
    points: ["Lower cost", "Higher quality", "Better timeline"],
    cta: "Send my quote",
  },
  fr: {
    kicker: "L'Incomparable",
    title: "Apportez-nous une soumission. On la bat.",
    lead: "Vous avez déjà une proposition d'une autre agence ? Envoyez-la. On revient avec une meilleure portée, un meilleur prix et un meilleur échéancier, ou on vous dit honnêtement si on n'est pas le bon choix.",
    placeholder: "Votre soumission actuelle (optionnel)",
    button: "Battre ma soumission",
    done: "Parfait, envoyez-la via le formulaire ci-dessous et on revient avec une offre plus forte.",
    points: ["Coût plus bas", "Qualité supérieure", "Meilleur échéancier"],
    cta: "Envoyer ma soumission",
  },
};
