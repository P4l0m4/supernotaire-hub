import type {
  Syndic,
  Bien,
  Copropriete,
} from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionFicheSynthétiqueCopropriété {
  nom_du_syndic: Syndic["nom"];
  email_du_syndic: Syndic["contact"]["email"]; //format: string, email valide
  telephone_du_syndic: Syndic["contact"]["telephone"]; //format: string, sans espaces ni séparateurs
  copropriete_nombre_lots_principaux: Copropriete["nombre_lots_principaux"]; //format: integer
  copropriete_montant_du_fonds_travaux: Copropriete["fonds_travaux"]["montant"]; //format: integer
  copropriete_date_arret_fonds_travaux: Copropriete["fonds_travaux"]["date_arret"]; //format: 20-11-2023
  copropriete_impayes_total: Copropriete["impayes"]["total"]; //format: integer
}

export const TS_TYPE_FicheSynthétiqueCopropriété = `
{
 adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
  nom_du_syndic: Syndic["nom"];
  email_du_syndic: Syndic["contact"]["email"]; //format: string, email valide
  telephone_du_syndic: Syndic["contact"]["telephone"]; //format: string, sans espaces ni séparateurs
  copropriete_nombre_lots_principaux: Copropriete["nombre_lots_principaux"]; //format: integer
  copropriete_montant_du_fonds_travaux: Copropriete["fonds_travaux"]["montant"]; //format: integer
  copropriete_date_arret_fonds_travaux: Copropriete["fonds_travaux"]["date_arret"]; //format: 20-11-2023
  copropriete_impayes_total: Copropriete["impayes"]["total"]; //format: integer
};`.trim();
