import type { Bien } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionPVAG {
  adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
  dates_echeances_a_venir: String[]; // format: jj-mm-aaaa [], pour le DERNIER Budget prévisionnel voté. Si une échéance est déjà passée, ne pas la prendre en compte.
  montant_dernier_bp_vote: number; // number, pour le DERNIER Budget prévisionnel voté.
}

export const TS_TYPE_ExtractionPVAG = `
{
  adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
   dates_echeances_a_venir: String[]; // format: jj-mm-aaaa [], pour le DERNIER Budget prévisionnel voté. Si une échéance est déjà passée, ne pas la prendre en compte.
montant_dernier_bp_vote: number; // number, pour le DERNIER Budget prévisionnel voté.
   };`.trim();
