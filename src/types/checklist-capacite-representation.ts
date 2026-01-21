export type StatutPartie = "Personne physique" | "Personne morale";

export type OuiNon = "Oui" | "Non";

export type TypeProtectionPhysique =
  | "Curatelle"
  | "Tutelle"
  | "Mandat de protection future ou autre";

export type TypeRepresentationPhysique =
  | "Mandat simple (procuration sous seing privé)"
  | "Représentation d’un majeur protégé";

export type TypeProtectionRepresentation =
  | "Tutelle"
  | "Curatelle"
  | "Mandataire spécial"
  | "Habilitation familiale";

export type TypeEntitePersonneMorale =
  | "Société (SARL, SAS, SCI, etc.)"
  | "Association";

export interface ChecklistCapaciteRepresentation {
  statut_partie?: StatutPartie;

  // Personne physique - vente en nom propre
  bien_vendu_en_nom_propre?: OuiNon;
  sous_protection_personne_physique?: OuiNon;
  type_protection_personne_physique?: TypeProtectionPhysique;

  // Personne physique - representation (hors nom propre)
  type_representation_personne_physique?: TypeRepresentationPhysique;
  type_protection_representation?: TypeProtectionRepresentation;

  // Personne morale
  type_entite_personne_morale?: TypeEntitePersonneMorale;
  entite_representee_par_mandataire?: OuiNon;
}
