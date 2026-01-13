export interface ChecklistCapaciteRepresentation {
  statut_partie?: "Personne physique" | "Personne morale" | "Indivision";
  sous_protection?: boolean;
  type_protection?: "Curatelle" | "Tutelle" | "Habilitation familiale" | "Sauvegarde de justice";
  representant_protection?: "Conjoint" | "Tiers (curateur/tuteur/mandataire)" | "Mandataire judiciaire" | "Représentation familiale";
  signature_par_procuration?: boolean;
  type_procuration?: "Notariée" | "Sous seing privé";
  type_personne_morale?: "SCI" | "SARL" | "SAS / SASU" | "SA" | "Autre";
  societe_unipersonnelle?: boolean;
  signature_par_representant?: boolean;
  representant_societe?: "Dirigeant statutaire" | "Mandataire délégué";
  type_procuration_societe?: "Notariée" | "Sous seing privé";
  indivision_representant_unique?: boolean;
}
