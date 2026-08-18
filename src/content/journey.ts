/* =================================================================
   ONE REQUEST, FROM THE FIRST CALL TO THE INVOICE
   Client direction (Aug 2026): a twelve-step simulator with two modes.
     - by hand      every step is a human gesture, time piles up  -> 8 h 05
     - your system  most steps run themselves, you approve three  -> 46 min
   French is the client's own wording (informal "tu").
   ================================================================= */
import type { Locale } from "./site";

export type Step = {
  /** step name */
  label: Record<Locale, string>;
  /** doing it by hand */
  manual: { minutes: number; note: Record<Locale, string> };
  /** the same step inside the system. `you` marks the ones that wait for a decision */
  system: { minutes: number; note: Record<Locale, string>; you?: Record<Locale, string> };
};

export const STEPS: Step[] = [
  {
    label: { en: "The request comes in", fr: "La demande entre" },
    manual: { minutes: 8, note: { en: "ANSWER, WRITE IT DOWN", fr: "RÉPONDRE, NOTER" } },
    system: { minutes: 0, note: { en: "THE AI ANSWERS", fr: "L'IA RÉPOND" } },
  },
  {
    label: { en: "Qualify the client", fr: "Qualifier le client" },
    manual: { minutes: 15, note: { en: "CALL BACK, ASK AROUND", fr: "RAPPELER, QUESTIONNER" } },
    system: { minutes: 2, note: { en: "SUMMARY READY", fr: "RÉSUMÉ PRÊT" } },
  },
  {
    label: { en: "Open the file", fr: "Ouvrir le dossier" },
    manual: { minutes: 12, note: { en: "RE-TYPE EVERYWHERE", fr: "RETAPER PARTOUT" } },
    system: { minutes: 0, note: { en: "CREATED ON ITS OWN", fr: "CRÉÉ TOUT SEUL" } },
  },
  {
    label: { en: "Chase plans and photos", fr: "Chercher plans et photos" },
    manual: { minutes: 45, note: { en: "FOLLOW-UPS", fr: "RELANCES" } },
    system: { minutes: 3, note: { en: "SECURE LINK", fr: "LIEN SÉCURISÉ" } },
  },
  {
    label: { en: "Read the plan", fr: "Lire le plan" },
    manual: { minutes: 60, note: { en: "BY HAND", fr: "À LA MAIN" } },
    system: {
      minutes: 6,
      note: { en: "SYMBOLS PLACED", fr: "SYMBOLES PLACÉS" },
      you: { en: "You approve the plan the AI read", fr: "Tu valides le plan lu par l'IA" },
    },
  },
  {
    label: { en: "Count the symbols", fr: "Compter les symboles" },
    manual: { minutes: 90, note: { en: "ONE BY ONE", fr: "UN PAR UN" } },
    system: { minutes: 8, note: { en: "COUNTED", fr: "COMPTÉS" } },
  },
  {
    label: { en: "Build the estimate", fr: "Monter l'estimation" },
    manual: { minutes: 75, note: { en: "SPREADSHEET", fr: "CHIFFRIER" } },
    system: {
      minutes: 15,
      note: { en: "DRAFT READY", fr: "BROUILLON PRÊT" },
      you: { en: "You adjust the estimate", fr: "Tu ajustes l'estimation" },
    },
  },
  {
    label: { en: "Lay out the quote", fr: "Mettre en page la soumission" },
    manual: { minutes: 40, note: { en: "COPY-PASTE", fr: "COPIER-COLLER" } },
    system: { minutes: 0, note: { en: "GENERATED", fr: "GÉNÉRÉE" } },
  },
  {
    label: { en: "Send and follow up", fr: "Envoyer et relancer" },
    manual: { minutes: 30, note: { en: "REMINDERS BY HAND", fr: "RELANCES À LA MAIN" } },
    system: {
      minutes: 2,
      note: { en: "AUTO FOLLOW-UP", fr: "SUIVI AUTO" },
      you: { en: "You approve sending it to the client", fr: "Tu approuves l'envoi au client" },
    },
  },
  {
    label: { en: "Schedule the job", fr: "Planifier le chantier" },
    manual: { minutes: 35, note: { en: "CALLS AND A WHITEBOARD", fr: "APPELS ET TABLEAU" } },
    system: { minutes: 4, note: { en: "DRAG AND DROP", fr: "GLISSER-DÉPOSER" } },
  },
  {
    label: { en: "Work order and hours", fr: "Bon de travail et heures" },
    manual: { minutes: 40, note: { en: "PAPER, THEN RE-TYPED", fr: "PAPIER, PUIS RETAPÉ" } },
    system: { minutes: 3, note: { en: "ON THE TABLET", fr: "TABLETTE" } },
  },
  {
    label: { en: "Invoicing and report", fr: "Facturation et rapport" },
    manual: { minutes: 35, note: { en: "REBUILT FROM SCRATCH", fr: "REFAIT AU COMPLET" } },
    system: { minutes: 3, note: { en: "READY TO EXPORT", fr: "PRÊT À EXPORTER" } },
  },
];

export const MANUAL_TOTAL = STEPS.reduce((a, s) => a + s.manual.minutes, 0); // 485 = 8 h 05
export const SYSTEM_TOTAL = STEPS.reduce((a, s) => a + s.system.minutes, 0); // 46 min
export const DECISION_COUNT = STEPS.filter((s) => s.system.you).length;      // 3

export const JOURNEY_UI: Record<Locale, {
  kicker: string;
  heading: string;
  title: string;
  subManual: string;
  subSystem: string;
  ofYourTime: string;
  modeManual: string;
  modeSystem: string;
  restart: string;
  byHand: string;
  yourSystem: string;
  stepOf: (n: number, total: number) => string;
  manualIntro: string;
  manualHint: string;
  manualNext: string;
  manualDone: string;
  systemIntro: string;
  systemPlay: string;
  systemRunning: string;
  systemWaiting: string;
  systemWaitHint: string;
  systemDone: (mins: string, decisions: number) => string;
  todo: string;
  closing: string;
}> = {
  en: {
    kicker: "See it for yourself",
    heading: "One request, from the first call to the invoice.",
    title: "One request, from the first call to the invoice",
    subManual: "Every box is a human gesture, and it has to happen in order.",
    subSystem: "Green is the system. Blue is you.",
    ofYourTime: "OF YOUR TIME, FOR THIS ONE REQUEST",
    modeManual: "By hand · today",
    modeSystem: "With your system",
    restart: "Restart",
    byHand: "By hand",
    yourSystem: "Your system",
    stepOf: (n, total) => `Step ${n} of ${total}.`,
    manualIntro: "Someone on your team does every one of these.",
    manualHint: "Someone on your team does it.",
    manualNext: "Next step",
    manualDone: "That is one request. Now multiply it by everything you quote this month.",
    systemIntro: "Press it, and watch how far it gets on its own.",
    systemPlay: "A request comes in",
    systemRunning: "Running…",
    systemWaiting: "The system is waiting on you. That is the only kind of stop left.",
    systemWaitHint: "WAITING ON YOU",
    systemDone: (mins, decisions) => `Quote sent. ${decisions} decisions from you, ${mins} of your time.`,
    todo: "TO DO",
    closing: "Twelve boxes. Eight hours of human time for one request, or forty-six minutes. That is what decides how many you can answer.",
  },
  fr: {
    kicker: "Voyez par vous-même",
    heading: "Une demande, du premier appel jusqu'à la facture.",
    title: "Une demande, du premier appel jusqu'à la facture",
    subManual: "Chaque case, c'est un geste humain, et il faut le faire dans l'ordre.",
    subSystem: "Vert = le système. Bleu = toi.",
    ofYourTime: "DE TON TEMPS, POUR CETTE DEMANDE",
    modeManual: "À la main · aujourd'hui",
    modeSystem: "Avec ton système",
    restart: "Recommencer",
    byHand: "À la main",
    yourSystem: "Ton système",
    stepOf: (n, total) => `Étape ${n} sur ${total}.`,
    manualIntro: "C'est quelqu'un de ton monde qui fait chacune de ces cases.",
    manualHint: "C'est quelqu'un de ton monde qui la fait.",
    manualNext: "Étape suivante",
    manualDone: "Ça, c'est une demande. Multiplie-la par tout ce que tu soumissionnes ce mois-ci.",
    systemIntro: "Appuie, et regarde jusqu'où ça se rend tout seul.",
    systemPlay: "Une demande rentre",
    systemRunning: "En cours…",
    systemWaiting: "Le système attend après toi. C'est le seul genre d'arrêt qui reste.",
    systemWaitHint: "EN ATTENTE DE TOI",
    systemDone: (mins, decisions) => `Soumission envoyée. ${decisions} décisions de ta part, ${mins} de ton temps.`,
    todo: "À FAIRE",
    closing: "Douze cases. Huit heures de temps humain pour une demande, ou quarante-six minutes. C'est ce qui décide combien tu peux en répondre.",
  },
};

export function fmt(mins: number, locale: Locale): string {
  if (mins === 0) return "0";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return locale === "fr" ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h ${String(m).padStart(2, "0")}`;
  if (h) return `${h} h`;
  return `${m} min`;
}
