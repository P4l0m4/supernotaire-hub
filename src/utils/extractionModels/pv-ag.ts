import type { AG, Syndic, Bien } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionPVAG {
  adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
  date_derniere_ag: AG["derniere_ag"]["date"]; //format: 20-11-2023
  travaux_votes_derniere_ag: AG["derniere_ag"]["travaux_votes"]; //format : { derniere_ag_travaux_votes_objet: string; derniere_ag_travaux_votes_budget: number; derniere_ag_travaux_votes_etat: "non soldé" | "soldé" | "en cours" }[]
  date_fin_du_mandat_syndic: Syndic["fin_du_mandat"]; //format: 20-11-2023
  date_designation_ag_syndic: Syndic["date_designation_ag"]; //format: 20-11-2023
}

export const TS_TYPE_ExtractionPVAG = `
{
   adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
  date_derniere_ag: AG["derniere_ag"]["date"]; //format: 20-11-2023
  travaux_votes_derniere_ag: AG["derniere_ag"]["travaux_votes"]; //format : { derniere_ag_travaux_votes_objet: string; derniere_ag_travaux_votes_budget: number; derniere_ag_travaux_votes_etat: "non soldé" | "soldé" | "en cours" }[]
  date_fin_du_mandat_syndic: Syndic["fin_du_mandat"]; //format: 20-11-2023
  date_designation_ag_syndic: Syndic["date_designation_ag"]; //format: 20-11-2023
};`.trim();
