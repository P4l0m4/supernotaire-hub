import type { Adresse } from "./adresse";

export type OuiNon = "Oui" | "Non";

export type TypeBienPrealables = "Appartement" | "Maison";

export type NatureTerrain =
  | "Terrain privatif"
  | "Terrain en indivision"
  | "Terrain en copropriété"
  | "Terrain non constructible ou agricole";

export interface ChecklistInformationsPrealables {
  type_bien?: TypeBienPrealables;
  adresse_bien: Adresse;
  maison?: {
    vendue_avec_terrain?: OuiNon;
    edifiee_domaine_public?: OuiNon;
    nature_terrain?: NatureTerrain;
  };
}
