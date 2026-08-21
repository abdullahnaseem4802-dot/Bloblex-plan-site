/* =================================================================
   TWO SECTIONS FROM THE CLIENT'S SKETCHES
     1. What gets ticked off without you  - a day replayed, sixteen
        things happen, three need your signature
     2. The fast eat the big              - the same request lands with
        two contractors; whoever answers first books the job
   French is the client's own wording (informal "tu").
   ================================================================= */
import type { Locale } from "./site";

/* ---------------- 1. the day, at a glance ----------------
   Not a log. Sixteen familiar jobs from a normal day, laid out as tiles.
   Three of them are dark because they are the only three the owner touches.
   The point has to land in two seconds, without reading a sentence.
   ------------------------------------------------------- */
export type DayJob = {
  at: string;                       // clock time, tiny, for the arc of a day
  by: "system" | "you";
  icon: IconKey;
  label: Record<Locale, string>;    // two or three familiar words, never a sentence
};

export type IconKey =
  | "phone" | "photo" | "ruler" | "calc" | "check" | "doc" | "send"
  | "eye" | "tag" | "pen" | "clip" | "receipt" | "clock" | "chart";

export const DAY_JOBS: DayJob[] = [
  { at: "06 h 58", by: "system", icon: "phone",   label: { en: "Call answered",     fr: "Appel répondu" } },
  { at: "07 h 01", by: "system", icon: "photo",   label: { en: "Plans and photos",  fr: "Plans et photos" } },
  { at: "07 h 14", by: "system", icon: "ruler",   label: { en: "Quantities counted",fr: "Quantités comptées" } },
  { at: "07 h 16", by: "system", icon: "calc",    label: { en: "Estimate drafted",  fr: "Estimation montée" } },
  { at: "07 h 40", by: "you",    icon: "check",   label: { en: "You check it",      fr: "Tu la vérifies" } },
  { at: "07 h 44", by: "system", icon: "doc",     label: { en: "Quote built",       fr: "Soumission montée" } },
  { at: "07 h 45", by: "you",    icon: "pen",     label: { en: "You send it",       fr: "Tu l'envoies" } },
  { at: "07 h 45", by: "system", icon: "send",    label: { en: "Quote delivered",   fr: "Soumission livrée" } },
  { at: "08 h 02", by: "system", icon: "eye",     label: { en: "Client opened it",  fr: "Client l'a ouverte" } },
  { at: "09 h 30", by: "system", icon: "tag",     label: { en: "Supplier prices",   fr: "Prix fournisseurs" } },
  { at: "09 h 31", by: "you",    icon: "check",   label: { en: "You approve prices",fr: "Tu approuves les prix" } },
  { at: "11 h 12", by: "system", icon: "pen",     label: { en: "Contract signed",   fr: "Contrat signé" } },
  { at: "11 h 12", by: "system", icon: "clip",    label: { en: "Work order sent",   fr: "Bon de travail envoyé" } },
  { at: "12 h 05", by: "system", icon: "receipt", label: { en: "Deposit invoiced",  fr: "Acompte facturé" } },
  { at: "16 h 40", by: "system", icon: "clock",   label: { en: "Hours and photos",  fr: "Heures et photos" } },
  { at: "17 h 02", by: "system", icon: "chart",   label: { en: "Margin up to date", fr: "Marge à jour" } },
];

export const JOBS_TOTAL = DAY_JOBS.length;                                // 16
export const JOBS_YOURS = DAY_JOBS.filter((j) => j.by === "you").length;  // 3
export const JOBS_AUTO = JOBS_TOTAL - JOBS_YOURS;                         // 13

export const DAY_UI: Record<Locale, {
  kicker: string;
  titleA: string; titleB: string;
  autoLabel: string; yoursLabel: string;
  system: string; you: string;
  dayStart: string; dayEnd: string;
  yoursHeading: string; autoHeading: string;
  closing: string;
}> = {
  en: {
    kicker: "A normal day",
    titleA: "16 jobs a day.", titleB: "You touch 3.",
    autoLabel: "run themselves", yoursLabel: "need your OK",
    system: "DONE", you: "YOU",
    dayStart: "06 h", dayEnd: "17 h",
    yoursHeading: "The 3 that need you",
    autoHeading: "Everything else, handled",
    closing: "The other 13 happened while you were on a job site, on the phone, or having supper.",
  },
  fr: {
    kicker: "Une journée normale",
    titleA: "16 jobs par jour.", titleB: "T'en touches 3.",
    autoLabel: "se font tout seules", yoursLabel: "demandent ton OK",
    system: "FAIT", you: "TOI",
    dayStart: "06 h", dayEnd: "17 h",
    yoursHeading: "Les 3 qui ont besoin de toi",
    autoHeading: "Tout le reste, géré",
    closing: "Les 13 autres se sont faites pendant que t'étais sur un chantier, au téléphone, ou en train de souper.",
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
