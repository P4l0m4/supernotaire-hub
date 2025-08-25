import type { Bien } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionAttestationDePropriete {
  bien_lots: Bien["lots"]; //format : { bien_lots_numero: string (ex: 13); bien_lots_usage: "Habitation" | "Commercial" | "Exploitation agricole et forestière" | "Intérêt collectif et services publics" | "Autre"; bien_lots_tantiemes: string (ex: 200/10000); bien_lots_tantiemes_speciaux_ascenseur?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_chauffage?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_eau?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_gardiennage?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_espaces_verts?: string (ex: 200/10000); }[]
}

export const TS_TYPE_AttestationDePropriété = `
{
 bien_lots: Bien["lots"]; //format : { bien_lots_numero: string (ex: 13); bien_lots_usage: "Habitation" | "Commercial" | "Exploitation agricole et forestière" | "Intérêt collectif et services publics" | "Autre"; bien_lots_tantiemes: string (ex: 200/10000); bien_lots_tantiemes_speciaux_ascenseur?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_chauffage?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_eau?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_gardiennage?: string (ex: 200/10000); bien_lots_tantiemes_speciaux_espaces_verts?: string (ex: 200/10000); }[]
};`.trim();
