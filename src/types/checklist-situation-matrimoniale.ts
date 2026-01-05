export type SituationMatrimonialeType =
  | "Célibataire / Concubin(e) / Union libre"
  | "Marié(e) (communauté)"
  | "Marié(e) (contrat spécifique)"
  | "Pacsé"
  | "Divorcé(e) (non remarié(e))"
  | "Dissolution PACS"
  | "Veuf / Veuve"
  | "Séparé de corps";

export interface ChecklistSituationMatrimoniale {
  situation_matrimoniale: {
    statut?: SituationMatrimonialeType;
    celibataire?: {
      etranger?: boolean;
    };
    separe_de_corps?: {
      contrat_mariage?: boolean;
    };
  };
}
