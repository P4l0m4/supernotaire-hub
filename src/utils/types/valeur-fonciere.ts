import type { Adresse } from "@/components/FormElements/LocationForm.vue";

export interface ValeurFonciere {
  adresse: Adresse;
  is_downtown: boolean;
  dimensions: Dimensions;
  configuration: Configuration;
  etat: Etat;
}

export interface Dimensions {
  surface: number;
  surface_habitable: number;
  pieces: number;
  terrain: number;
}

export interface Configuration {
  type_local: "Appartement" | "Maison";
  bonus: string[];
  malus: string[];
  rdc: boolean;
}

export interface Etat {
  travaux: string;
  dpe: string;
  annee_construction: string;
}
