import type { Adresse } from "@/types/adresse";

export type OuiNon = "Oui" | "Non";

export type TypeChangementEtatCivil =
  | "Changement de nom par décret"
  | "Mariage"
  | "Pacs"
  | "Divorce / dissolution PACS"
  | "Veuvage"
  | "Rectification de genre";

export type ChoixUsage = "Double nom" | "Nom de naissance" | "Nom d'usage";

export type LieuNaissanceType = "France" | "Pays étranger";

export interface ChecklistIdentiteEtatCivil {
  identite: {
    date_naissance?: string;
    nom?: string;
    prenoms?: string;
    adresse_actuelle?: Adresse;
    lieu_naissance?: {
      type?: LieuNaissanceType;
      ville?: string;
      pays?: string;
      departement?: string;
    };
  };
  etat_civil: {
    changement_etat_civil?: OuiNon;
    type_changement?: TypeChangementEtatCivil;
    changement_nom?: {
      a_signe_ancien_etat_civil?: OuiNon;
      ancien_nom?: string;
      date_decret_jugement?: string;
    };
    mariage?: {
      lieu?: string;
      date?: string;
      nom_conjoint?: string;
      prenom_conjoint?: string;
      choix_usage?: ChoixUsage;
    };
    divorce?: {
      date_jugement_ou_dissolution?: string;
      nom_ex_conjoint?: string;
    };
    veuvage?: {
      date_deces_conjoint?: string;
      lieu_deces_conjoint?: string;
    };
    rectification_genre?: {
      date_decision?: string;
      tribunal_decision?: string;
      a_signe_ancien_etat_civil?: OuiNon;
    };
  };
}
