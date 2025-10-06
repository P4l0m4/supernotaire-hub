import type { FinancierLot } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionFicheSynthétiqueCopropriété {
  date_arret_soldes_coproprietaires: FinancierLot["arrete_au"]; // format: date (jj-mm-aaaa), date de l'état des soldes
  solde_crediteur_exercice_anterieur: FinancierLot["solde_crediteur_exercice_anterieur"]; //format: number, solde créditeur de l’exercice antérieur pour le copropriétaire (nom dans les indices)
  solde_compte: FinancierLot["solde_compte"]; //format: number, solde créditeur net après imputation des charges en attente pour le copropriétaire (nom dans les indices)
}

export const TS_TYPE_EtatDesSoldesCopropriétaires = `
{
  date_arret_soldes_coproprietaires: FinancierLot["arrete_au"]; // format: date (jj-mm-aaaa), date de l'état des soldes
  solde_crediteur_exercice_anterieur: FinancierLot["solde_crediteur_exercice_anterieur"]; //format: number, solde créditeur de l’exercice antérieur pour le copropriétaire (nom dans les indices)
  solde_compte: FinancierLot["solde_compte"]; //format: number, solde créditeur net après imputation des charges en attente pour le copropriétaire (nom dans les indices)
};`.trim();
