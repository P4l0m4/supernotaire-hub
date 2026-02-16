export type OuiNon = "Oui" | "Non";

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

export type TypeCopropriete =
  | "Copropriété classique (immeuble)"
  | "Copropriété horizontale ou partielle (lotissements, maisons, etc)";

export type LotsInclus =
  | "Lot principal d'habitation"
  | "Jardin / terrasse en lot"
  | "Cave"
  | "Parking / box"
  | "Grenier / cellier"
  | "Autre lot annexe";

export interface ChecklistCoproStructures {
  type_structure_collective?: TypeStructureCollective;
  type_copropriete?: TypeCopropriete;
  montant_annuel_charges?: number;
  copro_fond_travaux?: OuiNon;
  copro_quote_part_lot?: string;
  copro_charges_a_jour?: OuiNon;
  montant_sommes_dues?: number;
  copro_lots_inclus_vente?: LotsInclus[];
  copro_precision_autre_lot?: string;
  gestion_copropriete?: TypeGestionSyndic;
  email_syndic?: string;
  tel_syndic?: string;
  type_association_syndicale?: TypeAssociationSyndicale;
  asl_cotisations_a_jour?: OuiNon;
  email_asl?: string;
  telephone_asl?: string;
  precision_type_structure?: string;
}
