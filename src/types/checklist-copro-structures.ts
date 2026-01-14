export type TypeGestionSyndic =
  | "Syndic professionnel"
  | "Syndic benevole"
  | "Syndic cooperatif"
  | "Auto-syndic"
  | "Aucun syndic (situation a regulariser pour finaliser la vente)";

export interface ChecklistCoproStructures {
  bien_en_copropriete?: boolean;
  lots_annexes?: Array<{
    label?: string;
  }>;
  travaux_parties_communes?: boolean;
  gestion_copropriete?: TypeGestionSyndic;
  email_syndic?: string;
  tel_syndic?: string;
  compteurs_individualises?: boolean;
  conformite_installations?: boolean;
  types_compteurs?: Array<{
    label?: string;
  }>;
  est_en_asl?: boolean;
  nom_asl?: string;
  contact_asl?: string;
  telephone_asl?: string;
}
