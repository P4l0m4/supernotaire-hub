export type StatutPartie = "Personne physique" | "Personne morale" | "Indivision";

export type TypeProtectionPhysique =
  | "Curatelle"
  | "Tutelle"
  | "Mandat de protection future ou autre";

export type TypeRepresentationPhysique =
  | "Mandat simple (procuration sous seing prive)"
  | "Representation d’un majeur protege"
  | "Mandataire special (procuration ponctuelle ou generale)"
  | "Habilitation familiale";

export type TypeProtectionRepresentation =
  | "Tutelle"
  | "Curatelle"
  | "Mandataire special"
  | "Habilitation familiale";

export type TypeEntitePersonneMorale = "Societe" | "Association";

export interface ChecklistCapaciteRepresentation {
  statut_partie?: StatutPartie;

  // Personne physique - vente en nom propre
  bien_vendu_en_nom_propre?: boolean;
  sous_protection_personne_physique?: boolean;
  type_protection_personne_physique?: TypeProtectionPhysique;

  // Personne physique - representation (hors nom propre)
  type_representation_personne_physique?: TypeRepresentationPhysique;
  type_protection_representation?: TypeProtectionRepresentation;

  // Personne morale
  type_entite_personne_morale?: TypeEntitePersonneMorale;
  entite_representee_par_mandataire?: boolean;
}
