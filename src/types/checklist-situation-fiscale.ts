import type { Adresse } from "@/types/adresse";

export interface ChecklistSituationFiscale {
  situation_fiscale: {
    type_proprietaire?: "Personne physique" | "Personne morale";
    proprietaire_impose?: "Oui" | "Non";
    assujetti_ifi?: "Oui" | "Non";
    residence_fiscale_personne_physique?: {
      statut?: "En France" | "A l’étranger";
      pays_etranger?: string;
      nif_etranger?: number;
    };
    avis_impot_revenu_disponible?: "Oui" | "Non";
    type_entite?: "Société : SARL, SAS, SCI, etc." | "Association";
    entite_imposee_en_france?: "Oui" | "Non" | "Partiellement";
    bien_inscrit_actif_entite?: "Oui" | "Non";
    regime_imposition_entite?:
      | "Impôt sur les sociétés (IS)"
      | "Impôt sur le revenu (IR)"
      | "Régime étranger";
    regime_imposition_association?:
      | "Non lucrative (hors IS)"
      | "Lucrative ou fiscalisée partiellement"
      | "Soumise à l’impôt sur les sociétés (IS)";
    numero_fiscal_francais?: "Oui" | "Non";
    numero_fiscal?: string;
    lieu_imposition?:
      | "En France"
      | "A l’étranger"
      | "En France et à l’étranger";
    adresse_lieu_imposition?: Adresse;
    residence_fiscale?: {
      pays?: string;
      nif_etranger?: string;
    };
  };
}
