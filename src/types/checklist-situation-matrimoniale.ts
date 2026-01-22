export type SituationMatrimonialeType =
  | "CÇ¸libataire / Concubin(e) / Union libre"
  | "MariÇ¸(e) (communautÇ¸)"
  | "MariÇ¸(e) (contrat spÇ¸cifique)"
  | "PacsÇ¸(e)"
  | "DivorcÇ¸(e) (non remariÇ¸(e))"
  | "Dissolution PACS"
  | "Veuf / Veuve"
  | "SÇ¸parÇ¸ de corps (mariÇ¸s mais autorisÇ¸s Çÿ vivre sÇ¸parÇ¸ment)";

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
