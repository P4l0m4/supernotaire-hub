export type OccupationParQui =
  | "Locataire"
  | "Occupant gratuit"
  | "Proprietaire vendeur"
  | "Indivisaire"
  | "Squatteur";

export type NatureOccupationProprietaire =
  | "Residence principale"
  | "Residence secondaire"
  | "Occupation temporaire";

export type TypeBail = "Habitation nue" | "Meuble" | "Autre";

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
