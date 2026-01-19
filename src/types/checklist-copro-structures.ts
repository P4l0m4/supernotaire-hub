export type TypeGestionSyndic =
  | "Syndic professionnel"
  | "Syndic bénévole"
  | "Syndic coopératif"
  | "Aucun syndic";

export type TypeAssociationSyndicale =
  | "ASL (Association Syndicale Libre)"
  | "AFUL (Association Foncière Urbaine Libre)"
  | "Autre";

export type TypeStructureCollective =
  | "D'une copropriété"
  | "D'une association syndicale (ASL / AFUL.)"
  | "D'aucune structure collective";

export interface ChecklistCoproStructures {
  type_structure_collective?: TypeStructureCollective;
  type_copropriete?: string;
  montant_annuel_charges?: number;
  copro_fond_travaux?: boolean;
  copro_quote_part_lot?: number;
  copro_charges_a_jour?: boolean;
  montant_sommes_dues?: number;
  copro_lots_inclus_vente?: string[];
  copro_precision_autre_lot?: string;
  gestion_copropriete?: TypeGestionSyndic;
  email_syndic?: string;
  tel_syndic?: string;
  type_association_syndicale?: TypeAssociationSyndicale;
  asl_cotisations_a_jour?: boolean;
  email_asl?: string;
  telephone_asl?: string;
  precision_type_structure?: string;

  // raw keys with dashes (paths from formDefinition)
  "copro-fond-travaux"?: boolean;
  "copro-quote-part-lot"?: number;
  "copro-charges-a-jour"?: boolean;
}
