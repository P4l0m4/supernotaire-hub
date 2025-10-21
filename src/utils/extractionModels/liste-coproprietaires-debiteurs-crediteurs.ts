import type { FinancierLotSommesDuesCedant } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionFicheSynthétiqueCopropriété {
  avances_exigibles_reserve_dues_par_le_cedant: FinancierLotSommesDuesCedant["avances_exigibles_reserve"]; //format: number, tu dois trouver le montant débiteur pour un copropriétaire spécifique (nom du copropriétaire dans les indices). Si le copropriétaire n'a pas de dette, mettre 0.
}

export const TS_TYPE_Liste_Coproprietaires_Debiteurs_Crediteurs = `
{
  avances_exigibles_reserve_dues_par_le_cedant: FinancierLotSommesDuesCedant["avances_exigibles_reserve"]; //format: number, tu dois trouver le montant débiteur pour un copropriétaire spécifique (nom du copropriétaire dans les indices). Si le copropriétaire n'a pas de dette, mettre 0.
};`.trim();
