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
  type_terrain?:
    | "Terrain agricole"
    | "Terrain forestier"
    | "Parcelle de loisir"
    | "Terrain non constructible"
    | "Terrain a batir";
  immeuble?: {
    configuration?: "Lotisseur" | "En lots";
  };
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
