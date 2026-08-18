/* =================================================================
   TWO SECTIONS FROM THE CLIENT'S SKETCHES
     1. What gets ticked off without you  - a day replayed, sixteen
        things happen, three need your signature
     2. The fast eat the big              - the same request lands with
        two contractors; whoever answers first books the job
   French is the client's own wording (informal "tu").
   ================================================================= */
import type { Locale } from "./site";

/* ---------------- 1. the day feed ---------------- */
export type FeedItem = {
  at: string;                       // clock time, shown as-is
  by: "system" | "you";
  text: Record<Locale, string>;
};

export const DAY_FEED: FeedItem[] = [
  { at: "06 h 58", by: "system", text: {
    en: "The AI answers, qualifies and creates the client record",
    fr: "L'IA répond, qualifie et crée la fiche client" } },
  { at: "07 h 01", by: "system", text: {
    en: "Secure link texted out for the plans and the photos",
    fr: "Lien sécurisé envoyé par texto pour les plans et les photos" } },
  { at: "07 h 14", by: "system", text: {
    en: "Plans received · read, symbols placed, 212 items counted",
    fr: "Plans reçus · lus, symboles placés, 212 items comptés" } },
  { at: "07 h 16", by: "system", text: {
    en: "Estimate draft built from your own recipes",
    fr: "Brouillon d'estimation monté à partir de tes recettes" } },
  { at: "07 h 40", by: "you", text: {
    en: "You approve the plan and adjust the estimate",
    fr: "Tu valides le plan et tu ajustes l'estimation" } },
  { at: "07 h 44", by: "system", text: {
    en: "Quote laid out, explainer video generated",
    fr: "Soumission mise en page, vidéo d'explication générée" } },
  { at: "07 h 45", by: "you", text: {
    en: "You approve the sending",
    fr: "Tu approuves l'envoi" } },
  { at: "07 h 45", by: "system", text: {
    en: "Quote sent · open tracking switched on",
    fr: "Soumission envoyée · suivi d'ouverture activé" } },
  { at: "08 h 02", by: "system", text: {
    en: "Client opened the quote twice · follow-up scheduled",
    fr: "Client a ouvert la soumission 2 fois · relance programmée" } },
  { at: "09 h 30", by: "system", text: {
    en: "Supplier pricing received by email · extracted, pending",
    fr: "Prix fournisseur reçu par courriel · extrait, en attente" } },
  { at: "09 h 31", by: "you", text: {
    en: "You approve the new price list",
    fr: "Tu approuves la nouvelle liste de prix" } },
  { at: "11 h 12", by: "system", text: {
    en: "Quote signed · project queued for scheduling",
    fr: "Soumission signée · projet entré dans la file de planification" } },
  { at: "11 h 12", by: "system", text: {
    en: "Work order generated and pushed to the crew's tablet",
    fr: "Bon de travail généré et envoyé sur la tablette de l'équipe" } },
  { at: "12 h 05", by: "system", text: {
    en: "Deposit invoice generated and sent",
    fr: "Facture d'acompte générée et envoyée" } },
  { at: "16 h 40", by: "system", text: {
    en: "Hours, photos and job-site materials synced",
    fr: "Heures, photos et matériel du chantier synchronisés" } },
  { at: "17 h 02", by: "system", text: {
    en: "Day report ready · margin up to date",
    fr: "Rapport de journée prêt · marge à jour" } },
];

export const FEED_TOTAL = DAY_FEED.length;                               // 16
export const FEED_YOURS = DAY_FEED.filter((i) => i.by === "you").length; // 3

export const FEED_UI: Record<Locale, {
  kicker: string; titleA: string; titleB: string;
  pause: string; play: string; oneLine: string; restart: string;
  doneLabel: string; yoursLabel: string;
  system: string; you: string;
  closingA: string; closingB: string; closingC: string;
}> = {
  en: {
    kicker: "A day, replayed",
    titleA: "What gets ticked off",
    titleB: "without you",
    pause: "Pause", play: "Play", oneLine: "One line", restart: "Restart",
    doneLabel: "tasks done", yoursLabel: "from you",
    system: "THE SYSTEM", you: "YOU",
    closingA: "Sixteen things happen in the day.",
    closingB: "Three need your signature.",
    closingC: "The rest happened while you were on a job site, on the phone, or having supper.",
  },
  fr: {
    kicker: "Une journée, rejouée",
    titleA: "Ce qui se coche",
    titleB: "sans toi",
    pause: "Pause", play: "Jouer", oneLine: "Une ligne", restart: "Recommencer",
    doneLabel: "tâches faites", yoursLabel: "de ta part",
    system: "LE SYSTÈME", you: "TOI",
    closingA: "Seize choses arrivent dans la journée.",
    closingB: "Trois demandent ta signature.",
    closingC: "Le reste s'est fait pendant que tu étais sur un chantier, au téléphone, ou en train de souper.",
  },
};

/* ---------------- 2. the speed race ---------------- */
export const RACE_UI: Record<Locale, {
  kicker: string; titleA: string; titleFast: string; titleB: string; titleBig: string;
  attribution: string; punch: string;
  cardTitle: string;
  yours: string; yoursSub: string;
  rival: string; rivalSub: string;
  clientBadge: string; clientBadgeSub: string;
  booked: string;
  play: string; again: string;
  footnote: string;
}> = {
  en: {
    kicker: "The real reason to do this",
    titleA: "The", titleFast: "fast", titleB: "eat the", titleBig: "big",
    attribution: "That line is not mine, it is Eric's. And it is the truest sentence in this whole presentation:",
    punch: "it is no longer the biggest who wins the contract, it is the first who answers.",
    cardTitle: "The same client, two contractors",
    yours: "Your system", yoursSub: "answers in 12 seconds",
    rival: "The competitor", rivalSub: "calls back in 4 hours",
    clientBadge: "THE CLIENT", clientBadgeSub: "is talking to your system",
    booked: "Appointment booked",
    play: "A request lands with both at the same time", again: "Run it again",
    footnote: "Same request, same minute. One of you was already in the conversation.",
  },
  fr: {
    kicker: "La vraie raison de faire ça",
    titleA: "Les", titleFast: "vites", titleB: "mangent les", titleBig: "gros",
    attribution: "Ce n'est pas de moi, c'est d'Eric. Et c'est la phrase la plus vraie de toute cette présentation :",
    punch: "ce n'est plus le plus gros qui gagne le contrat, c'est le premier qui répond.",
    cardTitle: "Le même client, deux entrepreneurs",
    yours: "Ton système", yoursSub: "répond en 12 secondes",
    rival: "Le concurrent", rivalSub: "rappelle dans 4 heures",
    clientBadge: "LE CLIENT", clientBadgeSub: "parle à ton système",
    booked: "Rendez-vous pris",
    play: "Une demande rentre chez les deux en même temps", again: "Rejouer",
    footnote: "Même demande, même minute. Un des deux était déjà dans la conversation.",
  },
};
