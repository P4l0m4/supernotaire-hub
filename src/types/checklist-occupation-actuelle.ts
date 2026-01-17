export type OccupationParQui =
  | "Un locataire"
  | "Un occupant à titre gratuit"
  | "Le propriétaire vendeur"
  | "Un indivisaire (plusieurs propriétaires)"
  | "Un squatteur";

export type NatureOccupationProprietaire =
  | "Residence principale"
  | "Residence secondaire"
  | "Occupation temporaire";

export type TypeBail = "Habitation nue" | "Meublé" | "Autre";

export interface ChecklistOccupationActuelle {
  bien_occupe?: boolean;
  par_qui?: OccupationParQui;
  bien_libre_moment_vente?: boolean;
  date_liberation?: string;

  occupant_gratuit_nom?: string;

  nature_occupation?: NatureOccupationProprietaire;

  procedure_en_cours?: boolean;

  type_bail?: TypeBail;

  bail_autre_precisions?: string;
}
