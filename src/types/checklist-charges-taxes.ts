export type TypeBienCharges = "Appartement" | "Maison";

export type TypeChauffage =
  | "Pompe Çÿ chaleur"
  | "Gaz"
  | "Fioul"
  | "Bois"
  | "Ç%lectrique"
  | "Autre";

export type ModeAssainissement = "Collectif" | "Individuel";

export type SituationOccupationFiscale =
  | "RÇ¸sidence principale"
  | "RÇ¸sidence secondaire"
  | "Bien vacant";

export type PretImmobilierEnCours = "Oui" | "Non";

export type RoleBeneficiaire =
  | "PropriÇ¸taire du bien (personne physique ou morale)"
  | "Banque prÇ¦teuse (si prÇ¦t sur le bien)"
  | "Mandataire (agence, etc)"
  | "Syndic (si impayÇ¸s en copropriÇ¸tÇ¸)"
  | "Autre";

export interface BeneficiaireCoordonneesBancaires {
  role_beneficiaire?: RoleBeneficiaire;
  beneficiaire_percoit_commission?: "Oui" | "Non";
  montant_commission?: string;
}

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
  pret_immobilier_en_cours?: PretImmobilierEnCours;
  nom_banque?: string;
  numero_pret?: string;
  date_derniere_echeance?: string;
  coordonnees_bancaires_beneficiaires?: BeneficiaireCoordonneesBancaires[];
}
