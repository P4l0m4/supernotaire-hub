export type TypeBienCharges = "Appartement" | "Maison";

export type TypeChauffage =
  | "Pompe à chaleur"
  | "Gaz"
  | "Fioul"
  | "Bois"
  | "Électrique"
  | "Autre";

export type ModeAssainissement = "Collectif" | "Individuel";

export type SituationOccupationFiscale =
  | "Résidence principale"
  | "Résidence secondaire"
  | "Bien vacant";

export type OuiNon = "Oui" | "Non";

export type PretImmobilierEnCours = OuiNon;

export type RoleBeneficiaire =
  | "Propriétaire du bien (personne physique ou morale)"
  | "Banque prêteuse (si prêt sur le bien)"
  | "Mandataire (agence, etc)"
  | "Syndic (si impayés en copropriété)"
  | "Autre";

export interface BeneficiaireCoordonneesBancaires {
  role_beneficiaire?: RoleBeneficiaire;
  beneficiaire_percoit_commission?: OuiNon;
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
  montant_taxe_fonciere?: number | null;
  presence_teom?: OuiNon;
  bien_soumis_taxe_habitation?: OuiNon;
  montant_derniere_taxe_habitation?: string;
  pret_immobilier_en_cours?: PretImmobilierEnCours;
  nom_banque?: string;
  numero_pret?: string;
  date_derniere_echeance?: string;
  coordonnees_bancaires_beneficiaires?: BeneficiaireCoordonneesBancaires[];
}
