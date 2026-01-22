export type SituationMatrimonialeType =
  | "Célibataire / Concubin(e) / Union libre"
  | "Marié(e) (communauté)"
  | "Marié(e) (contrat spécifique)"
  | "Pacsé(e)"
  | "Divorcé(e) (non remarié(e))"
  | "Dissolution PACS"
  | "Veuf / Veuve"
  | "Séparé de corps (mariés mais autorisés à vivre séparément)";

export type OuiNon = "Oui" | "Non";

export interface ChecklistSituationMatrimoniale {
  situation_matrimoniale: {
    statut?: SituationMatrimonialeType;
    celibataire?: {
      etranger?: OuiNon;
    };
    separe_de_corps?: {
      contrat_mariage?: OuiNon;
    };
  };
}
