/* =================================================================
   SECTOR SWITCHER DATA  (whiteboard folder 3, "Choisissez un secteur")
   Each PDF industry maps to a themed blob accessory + the connected
   system modules that industry would run on. EN + FR.
   ================================================================= */
import type { Locale } from "./site";

export type AccessoryKey =
  | "helmet" | "stethoscope" | "glasses" | "handshake"
  | "truck" | "bags" | "building" | "bell" | "computer";

export type Sector = {
  id: string;
  accessory: AccessoryKey;
  name: Record<Locale, string>;
  modules: Record<Locale, string[]>;
};

export const SECTORS: Sector[] = [
  {
    id: "construction", accessory: "helmet",
    name: { en: "Construction", fr: "Construction" },
    modules: {
      en: ["Integrated communication", "CRM & leads", "Client portal", "Project management", "AI estimating engine", "Invoicing"],
      fr: ["Communication intégrée", "CRM & prospects", "Portail client", "Gestion de projet", "Moteur d'estimation IA", "Facturation"],
    },
  },
  {
    id: "manufacturing", accessory: "glasses",
    name: { en: "Manufacturing", fr: "Manufacturier" },
    modules: {
      en: ["Orders & quoting", "Inventory & BOM", "Production scheduling", "Quality tracking", "Client portal", "Invoicing"],
      fr: ["Commandes & soumissions", "Inventaire & nomenclature", "Ordonnancement", "Suivi qualité", "Portail client", "Facturation"],
    },
  },
  {
    id: "healthcare", accessory: "stethoscope",
    name: { en: "Healthcare", fr: "Santé" },
    modules: {
      en: ["Patient intake", "Scheduling", "Records & files", "Secure messaging", "Follow-up automation", "Billing"],
      fr: ["Accueil patient", "Prise de rendez-vous", "Dossiers & fichiers", "Messagerie sécurisée", "Suivi automatisé", "Facturation"],
    },
  },
  {
    id: "professional-services", accessory: "handshake",
    name: { en: "Professional services", fr: "Services professionnels" },
    modules: {
      en: ["Lead capture", "CRM & pipeline", "Proposals & e-sign", "Project & time", "Client portal", "Invoicing"],
      fr: ["Captation de prospects", "CRM & pipeline", "Propositions & signature", "Projets & temps", "Portail client", "Facturation"],
    },
  },
  {
    id: "logistics", accessory: "truck",
    name: { en: "Logistics", fr: "Logistique" },
    modules: {
      en: ["Order intake", "Dispatch & routing", "Fleet tracking", "Client portal", "Proof of delivery", "Invoicing"],
      fr: ["Réception des commandes", "Répartition & routage", "Suivi de flotte", "Portail client", "Preuve de livraison", "Facturation"],
    },
  },
  {
    id: "distribution", accessory: "bags",
    name: { en: "Distribution", fr: "Distribution" },
    modules: {
      en: ["B2B ordering", "Inventory & warehouse", "Pricing & catalog", "CRM", "Client portal", "Invoicing"],
      fr: ["Commandes B2B", "Inventaire & entrepôt", "Prix & catalogue", "CRM", "Portail client", "Facturation"],
    },
  },
  {
    id: "real-estate", accessory: "building",
    name: { en: "Real estate", fr: "Immobilier" },
    modules: {
      en: ["Lead capture", "Listings & CRM", "Document & e-sign", "Client portal", "Visit scheduling", "Commission & billing"],
      fr: ["Captation de prospects", "Inscriptions & CRM", "Documents & signature", "Portail client", "Prise de visites", "Commissions & facturation"],
    },
  },
  {
    id: "hospitality", accessory: "bell",
    name: { en: "Hospitality", fr: "Hôtellerie" },
    modules: {
      en: ["Reservations", "Guest CRM", "Ordering & POS link", "Staff scheduling", "Reviews & follow-up", "Billing"],
      fr: ["Réservations", "CRM clients", "Commandes & lien POS", "Horaires du personnel", "Avis & suivi", "Facturation"],
    },
  },
  {
    id: "technology", accessory: "computer",
    name: { en: "Technology products", fr: "Produits technologiques" },
    modules: {
      en: ["Lead capture", "CRM & pipeline", "Onboarding flows", "Usage & analytics", "Client portal", "Billing & subscriptions"],
      fr: ["Captation de prospects", "CRM & pipeline", "Parcours d'intégration", "Usage & analytique", "Portail client", "Facturation & abonnements"],
    },
  },
];

export const SECTOR_UI: Record<Locale, { picker: string; connected: string; hint: string; switchLabel: string; prev: string; next: string }> = {
  en: { picker: "Choose a sector", connected: "The connected system", hint: "Switch the sector, the blob adapts, and so does the system.", switchLabel: "Switch sector", prev: "Previous sector", next: "Next sector" },
  fr: { picker: "Choisissez un secteur", connected: "Le système connecté", hint: "Changez de secteur, le blob s'adapte, et le système aussi.", switchLabel: "Changer de secteur", prev: "Secteur précédent", next: "Secteur suivant" },
};
