export interface ChecklistInformationsPrealables {
  type_bien?:
    | "Terrain"
    | "Dependance"
    | "Garage ou box"
    | "Entrepot ou batiment industriel"
    | "Bureau"
    | "Local professionnel"
    | "Local commercial"
    | "Immeuble"
    | "Appartement"
    | "Maison";
  adresse_bien?: string;
  maison?: {
    vendue_avec_terrain?: boolean;
    edifiee_domaine_public?: boolean;
    nature_terrain?:
      | "Terrain privatif"
      | "Terrain en indivision"
      | "Terrain en copropriete"
      | "Terrain non constructible ou agricole";
    titre_occupation?: string;
  };
}
