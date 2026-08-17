/* =================================================================
   TIME-LOSS GAME  (whiteboard folder 2)
   Left: advance a lead through disconnected tools by hand, time piles
   up. Right: the same lead through an automated Blobex flow in minutes,
   with a single "Confirm the estimation" click.
   ================================================================= */
import type { Locale } from "./site";

/** Manual hand-offs and their real-world time cost (minutes), from the video. */
export const MANUAL_STEPS: { label: Record<Locale, string>; minutes: number }[] = [
  { label: { en: "New lead → CRM", fr: "Nouveau prospect → CRM" }, minutes: 10 },
  { label: { en: "CRM → Client page", fr: "CRM → Fiche client" }, minutes: 20 },
  { label: { en: "Client → Estimating software", fr: "Client → Logiciel d'estimation" }, minutes: 180 },
  { label: { en: "Estimate → Invoicing", fr: "Estimation → Facturation" }, minutes: 60 },
];

export const STAGES: Record<Locale, string[]> = {
  en: ["New lead", "CRM", "Client page", "Estimation", "Invoice sent"],
  fr: ["Nouveau prospect", "CRM", "Fiche client", "Estimation", "Facture envoyée"],
};

export const TIMEGAME_UI: Record<Locale, {
  manualTitle: string; manualSub: string; manualBtn: string; manualDoneBtn: string;
  autoTitle: string; autoSub: string; autoBtn: string; confirmBtn: string; running: string;
  totalLabel: string; reset: string; manualDone: string; autoDone: string; autoTotal: string;
}> = {
  en: {
    manualTitle: "Without a connected system",
    manualSub: "Move the lead yourself, one hand-off at a time.",
    manualBtn: "Do the next step by hand",
    manualDoneBtn: "All done, the hard way",
    autoTitle: "With a Blobex system",
    autoSub: "The same lead, connected. One click from you.",
    autoBtn: "Run the automated flow",
    confirmBtn: "Confirm the estimation",
    running: "Running…",
    totalLabel: "Time spent",
    reset: "Reset",
    manualDone: "That's the time lost on a single lead, every single time.",
    autoDone: "Invoice sent. The rest happened automatically.",
    autoTotal: "≈ 5 min",
  },
  fr: {
    manualTitle: "Sans système connecté",
    manualSub: "Déplacez le prospect vous-même, un transfert à la fois.",
    manualBtn: "Faire l'étape suivante à la main",
    manualDoneBtn: "Terminé, à la dure",
    autoTitle: "Avec un système Blobex",
    autoSub: "Le même prospect, connecté. Un seul clic de votre part.",
    autoBtn: "Lancer le flux automatisé",
    confirmBtn: "Confirmer l'estimation",
    running: "En cours…",
    totalLabel: "Temps passé",
    reset: "Réinitialiser",
    manualDone: "Voilà le temps perdu sur un seul prospect, à chaque fois.",
    autoDone: "Facture envoyée. Le reste s'est fait automatiquement.",
    autoTotal: "≈ 5 min",
  },
};

export function formatMinutes(total: number, locale: Locale): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return locale === "fr" ? `${h} h ${m}` : `${h}h ${m}m`;
  if (h) return locale === "fr" ? `${h} h` : `${h}h`;
  return locale === "fr" ? `${m} min` : `${m} min`;
}
