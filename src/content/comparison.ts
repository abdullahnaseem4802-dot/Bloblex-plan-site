/* =================================================================
   THREE-STATE SYSTEM COMPARISON
   Client direction (Aug 2026): show three states side by side.
     1. Today            - nothing talks, everything is re-typed
     2. Their solution   - integrators wire tool to tool: spaghetti,
                           one subscription and one breaking point per thread
     3. What we propose  - every piece REBUILT inside one owned system
   French copy is the client's own wording, kept verbatim (informal "tu").
   ================================================================= */
import type { Locale } from "./site";

/** Shared node layout, in % of the stage. Positions never change between
    states: only the wiring does, which is the whole argument. */
export const NODES: { x: number; y: number }[] = [
  { x: 29, y: 14 }, { x: 50, y: 11 }, { x: 71, y: 14 },
  { x: 18, y: 29 }, { x: 82, y: 29 },
  { x: 9,  y: 46 }, { x: 91, y: 46 },
  { x: 18, y: 63 }, { x: 82, y: 63 },
  { x: 29, y: 79 }, { x: 50, y: 84 }, { x: 71, y: 79 },
];

export type ComparisonState = {
  headline: string;
  body: string;
  note: string;
  punch?: string;
  pros?: string[];
  cons?: string[];
};

export type ComparisonCopy = {
  kicker: string;
  title: string;
  lead: string;
  tabs: [string, string, string];
  /** generic tool names, used for states 1 and 2 */
  tools: string[];
  /** the same tools, rebuilt and owned, used for state 3 */
  owned: string[];
  /** advantage / drawback lists, per the client's own bullet points */
  prosLabel: string;
  consLabel: string;
  states: [
    ComparisonState,
    ComparisonState,
    ComparisonState,
  ];
  centerTitle: string;
  centerSub: string;
  badge: string;
};

export const COMPARISON: Record<Locale, ComparisonCopy> = {
  fr: {
    kicker: "Trois façons de régler le problème",
    title: "On ne branche pas ton système. On te le bâtit.",
    lead: "Trois états, les mêmes outils. Seul le câblage change, et c'est là que tout se joue.",
    tabs: ["1 · Aujourd'hui", "2 · Leur solution", "3 · Ce que je propose"],
    prosLabel: "Avantage",
    consLabel: "Inconvénients",
    tools: ["Inventaire", "Teams", "CRM", "Horaires", "Estimation", "Courriel", "Comptabilité", "Documents", "Paie", "Achats", "Soumissions", "Chantiers"],
    owned: ["Ton inventaire", "Ta messagerie", "Tes clients", "Tes horaires", "Ton estimation", "Ton courriel", "Ta comptabilité", "Tes documents", "Ta paie", "Tes achats", "Tes soumissions", "Tes chantiers"],
    states: [
      {
        headline: "Rien ne se parle.",
        body: "Chaque outil vit dans son coin. La même information est ressaisie trois ou quatre fois, et chaque ressaisie est une occasion de se tromper.",
        note: "chacun de son bord : rien ne circule",
        cons: [
          "La même information tapée trois ou quatre fois",
          "Chaque ressaisie est une occasion de se tromper",
          "Le temps part en copier-coller, pas en travail",
        ],
      },
      {
        headline: "On branche tout sur tout.",
        body: "On ne remplace rien : on branche tout sur tout. Ça marche, et le premier mois c'est même impressionnant. Chaque fil est par contre un abonnement de plus, un point de bris de plus, et une facture qui monte chaque fois que tu engages quelqu'un.",
        note: "chacune : un abonnement, un point de bris, une facture mensuelle",
        pros: ["Tu arrêtes de ressaisir la même information"],
        cons: [
          "Tu dépends de chacun des outils que tu utilises",
          "Une affaire brise, et tout brise",
          "Un abonnement de plus, une facture de plus, par fil",
        ],
        punch: "La ressaisie disparaît. Le travail reste.",
      },
      {
        headline: "On te bâtit ton système.",
        body: "On ne branche pas ton Teams : on te bâtit ton Teams. On ne connecte pas ton logiciel d'estimation : on refait ton processus d'estimation, à ta manière, dans ton système. Chaque morceau est recréé chez toi, donc chaque morceau, on peut le pousser aussi loin qu'on veut.",
        note: "un actif à ton bilan, pas une dépense récurrente",
        pros: [
          "Tu possèdes le système, c'est un actif",
          "Rien à brancher, donc rien à briser",
          "Chaque morceau peut être poussé aussi loin que tu veux",
        ],
        punch: "Un seul système. À toi. Sans limite.",
      },
    ],
    centerTitle: "TON SYSTÈME",
    centerSub: "UN SEUL · À TOI · SANS LIMITE",
    badge: "RECRÉÉ · PAS BRANCHÉ",
  },

  en: {
    kicker: "Three ways to solve the same problem",
    title: "We don't plug your system together. We build it.",
    lead: "Three states, the same tools. Only the wiring changes, and that is where everything is decided.",
    tabs: ["1 · Today", "2 · Their solution", "3 · What we propose"],
    prosLabel: "Advantage",
    consLabel: "Drawbacks",
    tools: ["Inventory", "Teams", "CRM", "Schedules", "Estimating", "Email", "Accounting", "Documents", "Payroll", "Purchasing", "Quotes", "Job sites"],
    owned: ["Your inventory", "Your messaging", "Your clients", "Your schedules", "Your estimating", "Your email", "Your accounting", "Your documents", "Your payroll", "Your purchasing", "Your quotes", "Your job sites"],
    states: [
      {
        headline: "Nothing talks to anything.",
        body: "Every tool lives on its own island. The same information gets re-typed three or four times, and every re-entry is a chance to get it wrong.",
        note: "each on its own: nothing flows",
        cons: [
          "The same information typed three or four times",
          "Every re-entry is a chance to get it wrong",
          "Time goes into copy-paste instead of work",
        ],
      },
      {
        headline: "They wire everything into everything.",
        body: "They replace nothing: they wire everything into everything. It works, and for the first month it is even impressive. But every thread is one more subscription, one more breaking point, and a bill that climbs every time you hire someone.",
        note: "each one: a subscription, a breaking point, a monthly bill",
        pros: ["You stop re-typing the same information"],
        cons: [
          "You depend on every tool you use",
          "One thing breaks, and everything breaks",
          "One more subscription and one more bill per thread",
        ],
        punch: "The re-typing disappears. The work remains.",
      },
      {
        headline: "We build you your system.",
        body: "We don't plug in your Teams: we build you your Teams. We don't connect your estimating software: we rebuild your estimating process, your way, inside your system. Every piece is recreated in-house, so every piece can be pushed as far as you want.",
        note: "an asset on your balance sheet, not a recurring expense",
        pros: [
          "You own the system: it is an asset",
          "Nothing is plugged in, so nothing can come unplugged",
          "Every piece can be pushed as far as you want",
        ],
        punch: "One system. Yours. No limits.",
      },
    ],
    centerTitle: "YOUR SYSTEM",
    centerSub: "ONE · YOURS · NO LIMITS",
    badge: "REBUILT · NOT PLUGGED IN",
  },
};
