import type {
  FinancierLotSommesDuesCedant,
  FinancierLotSommesALaChargeAcquereurPostVente,
  FinancierLotSommesDebiteurSyndic,
} from "@/types/pre-etat-date-complet.ts";

export interface ExtractionTableauTravauxFinancements {
  cedant_provisions_hb_exigibles: FinancierLotSommesDuesCedant["provisions_exigibles"]["hors_budget"]; // format: number
  provisions_non_encore_exigibles_hors_budget: FinancierLotSommesALaChargeAcquereurPostVente["provisions_non_encore_exigibles"]["hors_budget"]; // format: { date: 20-11-2000; montant: number }[]
  avances_provisions_travaux: FinancierLotSommesDebiteurSyndic["avances_provisions"]["travaux"]; // format: number
}

export const TS_TYPE_ExtractionTableauTravauxFinancements = `
{
  cedant_provisions_hb_exigibles: FinancierLotSommesDuesCedant["provisions_exigibles"]["hors_budget"]; // format: number
  provisions_non_encore_exigibles_hors_budget: FinancierLotSommesALaChargeAcquereurPostVente["provisions_non_encore_exigibles"]["hors_budget"]; // format: { date: 20-11-2000; montant: number }[]
  avances_provisions_travaux: FinancierLotSommesDebiteurSyndic["avances_provisions"]["travaux"]; // format: number
};`.trim();
