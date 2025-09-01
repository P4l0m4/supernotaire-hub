import type { Bien } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionPVAG {
  adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
}

export const TS_TYPE_ExtractionPVAG = `
{
  adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
};`.trim();
