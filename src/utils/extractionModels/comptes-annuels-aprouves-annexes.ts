import type { FinancierLotAutres } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionCAAA {
  charges_N_1_quote_part_bp_appelee: FinancierLotAutres["charges"]["N_1"]["bp_appelee"]; // format: number, bp signifie budget prévisionnel
  charges_N_1_quote_part_bp_reelle: FinancierLotAutres["charges"]["N_1"]["bp_reelle"]; // format: number, bp signifie budget prévisionnel
  charges_N_1_quote_part_hb_appelee: FinancierLotAutres["charges"]["N_1"]["hb_appelee"]; // format: number, hb signifie hors budget prévisionnel
  charges_N_1_quote_part_hb_reelle: FinancierLotAutres["charges"]["N_1"]["hb_reelle"]; // format: number, hb signifie hors budget prévisionnel
  charges_N_2_quote_part_bp_appelee: FinancierLotAutres["charges"]["N_2"]["bp_appelee"]; // format: number, bp signifie budget prévisionnel
  charges_N_2_quote_part_bp_reelle: FinancierLotAutres["charges"]["N_2"]["bp_reelle"]; // format: number, bp signifie budget prévisionnel
  charges_N_2_quote_part_hb_appelee: FinancierLotAutres["charges"]["N_2"]["hb_appelee"]; // format: number, hb signifie hors budget prévisionnel
  charges_N_2_quote_part_hb_reelle: FinancierLotAutres["charges"]["N_2"]["hb_reelle"]; // format: number, hb signifie hors budget prévisionnel
}

export const TS_TYPE_ExtractionCAAA = `
{
  charges_N_1_quote_part_bp_appelee: FinancierLotAutres["charges"]["N_1"]["bp_appelee"]; // format: number, bp signifie budget prévisionnel
  charges_N_1_quote_part_bp_reelle: FinancierLotAutres["charges"]["N_1"]["bp_reelle"]; // format: number, bp signifie budget prévisionnel
  charges_N_1_quote_part_hb_appelee: FinancierLotAutres["charges"]["N_1"]["hb_appelee"]; // format: number, hb signifie hors budget prévisionnel
  charges_N_1_quote_part_hb_reelle: FinancierLotAutres["charges"]["N_1"]["hb_reelle"]; // format: number, hb signifie hors budget prévisionnel
  charges_N_2_quote_part_bp_appelee: FinancierLotAutres["charges"]["N_2"]["bp_appelee"]; // format: number, bp signifie budget prévisionnel
  charges_N_2_quote_part_bp_reelle: FinancierLotAutres["charges"]["N_2"]["bp_reelle"]; // format: number, bp signifie budget prévisionnel
  charges_N_2_quote_part_hb_appelee: FinancierLotAutres["charges"]["N_2"]["hb_appelee"]; // format: number, hb signifie hors budget prévisionnel
  charges_N_2_quote_part_hb_reelle: FinancierLotAutres["charges"]["N_2"]["hb_reelle"]; // format: number, hb signifie hors budget prévisionnel
};`.trim();
