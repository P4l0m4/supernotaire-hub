import type {
  FinancierLotSommesDuesCedant,
  Copropriete,
} from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionEtatDettesCreances {
  sommes_exigibles_dues_par_cedant_a_des_tiers_emprunts_geres_par_syndic?: FinancierLotSommesDuesCedant["a_des_tiers_emprunts_geres_par_syndic"]; // format: number
  pret_quote_part_vendeur?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["pret_quote_part_vendeur"]; // format: number
  condamnations?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["condamnations"]; // format: number
  cedant_autres_sommes_exigibles_pret_quote_part_vendeur?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["pret_quote_part_vendeur"]; // format: number
  cedant_autres_sommes_exigibles_condamnations?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["condamnations"]; // format: number
  copropriete_dettes_syndic_fournisseurs: Copropriete["dettes_syndic_fournisseurs"]; // format: number, Dettes vis-à-vis des fournisseurs à la dernière clôture
  copropriete_emprunts: Copropriete["emprunts"]; // format: { objet: string; capital_restant_du: number }[]
}

export const TS_TYPE_ExtractionEtatDettesCreances = `
{
 sommes_exigibles_dues_par_cedant_a_des_tiers_emprunts_geres_par_syndic?: FinancierLotSommesDuesCedant["a_des_tiers_emprunts_geres_par_syndic"]; // format: number
  pret_quote_part_vendeur?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["pret_quote_part_vendeur"]; // format: number
  condamnations?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["condamnations"]; // format: number
  cedant_autres_sommes_exigibles_pret_quote_part_vendeur?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["pret_quote_part_vendeur"]; // format: number
  cedant_autres_sommes_exigibles_condamnations?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["condamnations"]; // format: number
  copropriete_dettes_syndic_fournisseurs: Copropriete["dettes_syndic_fournisseurs"]; // format: number, Dettes vis-à-vis des fournisseurs à la dernière clôture
  copropriete_emprunts: Copropriete["emprunts"]; // format: { objet: string; capital_restant_du: number }[]
};`.trim();
