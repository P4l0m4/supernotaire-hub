import type { Adresse } from "@/types/adresse";

export type OuiNon = "Oui" | "Non";

export type TypeProprietaire = "Personne physique" | "Personne morale";

export type TypeEntite = "Société : SARL, SAS, SCI, etc." | "Association";

export type EntiteImposee = OuiNon | "Partiellement";

export type RegimeImpositionEntite =
  | "Impôt sur les sociétés (IS)"
  | "Impôt sur le revenu (IR)"
  | "Régime étranger";

export type RegimeImpositionAssociation =
  | "Non lucrative (hors IS)"
  | "Lucrative ou fiscalisée partiellement"
  | "Soumise à l'impôt sur les sociétés (IS)";

export type LieuImposition =
  | "En France"
  | "A l'étranger"
  | "En France et à l'étranger";

export interface ChecklistSituationFiscale {
  situation_fiscale: {
    type_proprietaire?: TypeProprietaire;
    type_entite?: TypeEntite;
    proprietaire_impose?: OuiNon;
    assujetti_ifi?: OuiNon;
    avis_impot_revenu_disponible?: OuiNon;
    entite_imposee_en_france?: EntiteImposee;
    bien_inscrit_actif_entite?: OuiNon;
    regime_imposition_entite?: RegimeImpositionEntite;
    regime_imposition_association?: RegimeImpositionAssociation;
    numero_fiscal_francais?: OuiNon;
    numero_fiscal?: string;
    lieu_imposition?: LieuImposition;
    adresse_lieu_imposition?: Adresse;
    residence_fiscale_personne_physique?: {
      statut?: "En France" | "A l'étranger";
      pays_etranger?: string;
      nif_etranger?: number | null;
    };
    residence_fiscale?: {
      pays?: string;
    };
  };
}
