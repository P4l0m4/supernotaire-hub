export type OuiNon = "Oui" | "Non";

export type TypeProprietaire = "Personne physique" | "Personne morale";

export type ModeAcquisitionPhysique =
  | "Achat classique"
  | "Succession / Testament"
  | "Achat en VEFA (Vente sur plan / programme neuf)"
  | "Donation entre vifs"
  | "Cession de nue-propriété / usufruit"
  | "Partage / Licitation"
  | "Échange"
  | "Adjudication / Vente aux enchères"
  | "Dation en paiement (d'une dette)"
  | "Vente à terme / paiement différé";

export type ModeAcquisitionMorale =
  | "Achat classique"
  | "Apport en société"
  | "Apport partiel d’actif (scission, fusion, TUP)"
  | "Achat en VEFA (Vente sur plan / programme neuf)"
  | "Donation entre vifs"
  | "Cession de nue-propriété / usufruit"
  | "Partage / Licitation"
  | "Échange"
  | "Adjudication / Vente aux enchères"
  | "Dation en paiement (d'une dette)"
  | "Vente à terme / paiement différé";

export type ModeTransmission =
  | "Succession (pas de bien précis attribué)"
  | "Legs particulier (attribution d’un bien précis par testament)";

export interface ChecklistOriginePropriete {
  date_acquisition: Date;
  type_proprietaire?: TypeProprietaire;
  mode_acquisition_personne_physique?: ModeAcquisitionPhysique;
  mode_acquisition_personne_morale?: ModeAcquisitionMorale;
  mode_transmission?: ModeTransmission;
}
