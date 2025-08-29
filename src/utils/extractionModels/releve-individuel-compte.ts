import type { FinancierLot } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionRIC {
  solde_compte: FinancierLot["solde_compte"]; // format: number
  solde_crediteur_exercice_anterieur?: FinancierLot["solde_crediteur_exercice_anterieur"]; // format: number
  appels_echus_non_payes: FinancierLot["appels_echus_non_payes"]; // format: number
  echeances_a_venir?: FinancierLot["echeances_a_venir"]; // format: { date: 20-11-2023; montant: number }[]
}

export const TS_TYPE_ExtractionRIC = `
{
  solde_compte: FinancierLot["solde_compte"]; // format: number
  solde_crediteur_exercice_anterieur?: FinancierLot["solde_crediteur_exercice_anterieur"]; // format: number
  appels_echus_non_payes: FinancierLot["appels_echus_non_payes"]; // format: number
  echeances_a_venir?: FinancierLot["echeances_a_venir"]; // format: { date: 20-11-2023; montant: number }[]
};`.trim();
