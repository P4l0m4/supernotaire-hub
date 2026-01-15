import type { Syndic, Copropriete } from "@/types/pre-etat-date-complet.ts";

export interface ExtractionFicheSynthétiqueCopropriété {
  nom_du_syndic: Syndic["nom"];
  email_du_syndic: Syndic["contact"]["email"]; //format: string, email valide
  copropriete_arrete_au: Copropriete["arrete_au"]; //format: 20-11-2023, date de clôture de l’exercice comptable
  copropriete_montant_du_fonds_travaux: Copropriete["fonds_travaux"]["montant"]; //format: number
  copropriete_impayes_total: Copropriete["impayes"]["total"]; //format: number, montant des sommes restant dues par les copropriétaires
  copropriete_dettes_syndic_fournisseurs: Copropriete["dettes_syndic_fournisseurs"]; //format: number, dettes fournisseurs, rémunérations et autres
}

export const TS_TYPE_FicheSynthétiqueCopropriété = `
{
 nom_du_syndic: Syndic["nom"];
  email_du_syndic: Syndic["contact"]["email"]; //format: string, email valide
  copropriete_arrete_au: Copropriete["arrete_au"]; //format: 20-11-2023, date de clôture de l’exercice comptable
  copropriete_montant_du_fonds_travaux: Copropriete["fonds_travaux"]["montant"]; //format: integer
  copropriete_impayes_total: Copropriete["impayes"]["total"]; //format: integer, montant des sommes restant dues par les copropriétaires
  copropriete_dettes_syndic_fournisseurs: Copropriete["dettes_syndic_fournisseurs"]; //format: integer, dettes fournisseurs, rémunérations et autres
};`.trim();
