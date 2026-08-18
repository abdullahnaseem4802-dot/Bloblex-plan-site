/* =================================================================
   COST RACE: the competitor vs us, as two systems running side by side
   Client direction (Aug 2026): "we see the cost going up as the project
   is progressing, then it goes slowly but the price keeps rising, and you
   see blobex that has constant progression. Then it goes away and we see
   text in big: 'they make their profit the longer it takes' (fades)
   'we make profit the more efficient we are'."
   ================================================================= */
import type { Locale } from "./site";

/** segments in each ring */
export const RING = 16;

/** the quoted job, and where the hourly agency actually lands */
export const FIXED_PRICE = 12000;
export const RIVAL_END = 15750;

/** how far each side gets through the work, 0..1 */
export const RIVAL_PROGRESS = 0.55;
export const OURS_PROGRESS = 1;

export const COST_UI: Record<Locale, {
  kicker: string; title: string; lead: string;
  rival: string; rivalSub: string;
  ours: string; oursSub: string;
  progressLabel: string; costLabel: string;
  play: string; again: string;
  punchA: string; punchB: string;
  footnote: string;
}> = {
  en: {
    kicker: "Why the way you are billed matters",
    title: "Same job. Two ways of being charged for it.",
    lead: "Watch both projects run. One meter keeps climbing while the work crawls. The other was agreed before a line of code was written.",
    rival: "Others", rivalSub: "billed by the hour",
    ours: "Blobex", oursSub: "fixed price, fixed timeline",
    progressLabel: "Project progress", costLabel: "Your cost",
    play: "Run both projects", again: "Run it again",
    punchA: "They make their profit the longer it takes.",
    punchB: "We make profit the more efficient we are.",
    footnote: "Illustrative figures. Yours come from the discovery call, before anything is built.",
  },
  fr: {
    kicker: "Pourquoi le mode de facturation compte",
    title: "Le même mandat. Deux façons de te le facturer.",
    lead: "Regarde les deux projets rouler. Un compteur qui monte pendant que le travail traîne. L'autre était convenu avant la première ligne de code.",
    rival: "Les autres", rivalSub: "facturés à l'heure",
    ours: "Blobex", oursSub: "prix fixe, échéancier fixe",
    progressLabel: "Avancement du projet", costLabel: "Ton coût",
    play: "Lancer les deux projets", again: "Rejouer",
    punchA: "Eux font leur profit plus ça traîne.",
    punchB: "Nous, on fait du profit plus on est efficaces.",
    footnote: "Chiffres à titre indicatif. Les tiens viennent de l'appel découverte, avant que rien ne soit bâti.",
  },
};

export function money(n: number, locale: Locale): string {
  return locale === "fr"
    ? `${Math.round(n).toLocaleString("fr-CA")} $`
    : `$${Math.round(n).toLocaleString("en-CA")}`;
}
