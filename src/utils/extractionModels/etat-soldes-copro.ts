import type { FinancierLot } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionFicheSynthétiqueCopropriété {
  solde_crediteur_exercice_anterieur?: FinancierLot["solde_crediteur_exercice_anterieur"]; //format: integer, solde créditeur de l’exercice antérieur pour le copropriétaire vendeur (nom dans les indices)
}

export const TS_TYPE_EtatDesSoldesCopropriétaires = `
{
 solde_crediteur_exercice_anterieur?: FinancierLot["solde_crediteur_exercice_anterieur"]; //format: integer, solde créditeur de l’exercice antérieur pour le copropriétaire vendeur (nom dans les indices)
};`.trim();
