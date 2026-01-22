export type OuiNon = "Oui" | "Non";

export type TravauxNature =
  | "structure_gros_oeuvre"
  | "distribution_interieure"
  | "reseaux_techniques"
  | "locaux_techniques"
  | "confort_equipement"
  | "entretien_embellissement";

export interface ChecklistDiagnostics {
  raccordToutALegout?: OuiNon;
  dateDiagAssainissement?: string;
  zoneTermites?: OuiNon;
  dateDiagTermites?: string;
  zoneRisques?: OuiNon;
  dateErp?: string;
  dateConstruction?: string;
  dateCrepPlomb?: string;
  dateAmiante?: string;
  installationGaz15Ans?: OuiNon;
  dateDiagnosticGaz?: string;
  installationElec15Ans?: OuiNon;
  dateDiagnosticElectricite?: string;
  dateDpe?: string;
}

export interface ChecklistTravauxInterieurs {
  realises?: OuiNon;
  nature?: TravauxNature[];
  realisesPar?: "Un professionnel" | "Le vendeur lui-même";
}

export interface ChecklistDiagnosticsTravauxInterieurs {
  diagnostics: ChecklistDiagnostics;
  travaux: ChecklistTravauxInterieurs;
}
