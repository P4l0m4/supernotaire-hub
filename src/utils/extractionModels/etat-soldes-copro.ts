import type {
  FinancierLot,
  FinancierLotSommesDuesCedant,
} from "@/types/pre-etat-date-complet.ts";

export interface ExtractionFicheSynthétiqueCopropriété {
  date_arret_soldes_coproprietaires: FinancierLot["arrete_au"]; // format: date (jj-mm-aaaa), date de l'état des soldes
  solde_crediteur_exercice_anterieur: FinancierLot["solde_crediteur_exercice_anterieur"]; //format: number, solde créditeur de l’exercice antérieur pour le copropriétaire (nom du copropriétaire dans les indices)
  solde_compte: FinancierLot["solde_compte"]; //format: number, solde créditeur net après imputation des charges en attente pour le copropriétaire (nom du copropriétaire dans les indices)
  charges_impayees_anterieures_dues_par_le_cedant: FinancierLotSommesDuesCedant["charges_impayees_anterieures"]; //format: number, Solde débiteur du copropriétaire (mettre 0 si solde créditeur > 0) (nom du copropriétaire dans les indices)
}

export const TS_TYPE_EtatDesSoldesCopropriétaires = `
{
  date_arret_soldes_coproprietaires: FinancierLot["arrete_au"]; // format: date (jj-mm-aaaa), date de l'état des soldes
  solde_crediteur_exercice_anterieur: FinancierLot["solde_crediteur_exercice_anterieur"]; //format: number, solde créditeur de l’exercice antérieur pour le copropriétaire (nom du copropriétaire dans les indices)
  solde_compte: FinancierLot["solde_compte"]; //format: number, solde créditeur net après imputation des charges en attente pour le copropriétaire (nom du copropriétaire dans les indices)
  charges_impayees_anterieures_dues_par_le_cedant: FinancierLotSommesDuesCedant["charges_impayees_anterieures"]; //format: number, Solde débiteur du copropriétaire (mettre 0 si solde créditeur > 0) (nom du copropriétaire dans les indices)
};`.trim();
