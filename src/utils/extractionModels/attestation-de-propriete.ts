import type { Bien } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionAttestationDePropriete {
  bien_lots: Bien["lots"]; //format : { bien_lots_designation: string (ex: "cave 754"); bien_lots_numero: string (ex: "13"); bien_lots_usage: "Habitation" | "Commercial" | "Exploitation agricole et forestière" | "Intérêt collectif et services publics" | "Autre";}[]
}

export const TS_TYPE_AttestationDePropriété = `
{
   bien_lots: Bien["lots"]; //format : { bien_lots_designation: string (ex: "cave 754"); bien_lots_numero: string (ex: "13"); bien_lots_usage: "Habitation" | "Commercial" | "Exploitation agricole et forestière" | "Intérêt collectif et services publics" | "Autre";}[]
};`.trim();
