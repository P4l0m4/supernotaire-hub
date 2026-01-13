export type TypeBienCharges = "Appartement" | "Maison";

export type TypeChauffage =
  | "Pompe à chaleur"
  | "Gaz"
  | "Fioul"
  | "Bois"
  | "Electrique"
  | "Autre";

export type ModeAssainissement = "Collectif" | "Individuel";

export type SituationOccupationFiscale =
  | "Résidence principale"
  | "Résidence secondaire"
  | "Bien vacant";

export interface ChecklistChargesTaxes {
  type_bien?: TypeBienCharges;
  type_chauffage?: TypeChauffage;
  type_chauffage_autre?: string;
  date_entretien_chauffage?: string;
  date_ramonage?: string;
  mode_assainissement?: ModeAssainissement;
  situation_fiscale?: SituationOccupationFiscale;
  montant_taxe_fonciere?: string;
  montant_derniere_taxe_habitation?: string;
  presence_teom?: boolean;
  bien_soumis_taxe_habitation?: boolean;
}
