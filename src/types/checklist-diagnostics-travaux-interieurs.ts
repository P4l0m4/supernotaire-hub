export type TravauxNature =
  | "structure_gros_oeuvre"
  | "distribution_interieure"
  | "reseaux_techniques"
  | "locaux_techniques"
  | "confort_equipement"
  | "entretien_embellissement";

export interface ChecklistDiagnostics {
  raccordToutALegout?: boolean;
  dateDiagAssainissement?: string;
  zoneTermites?: boolean;
  dateDiagTermites?: string;
  zoneRisques?: boolean;
  dateErp?: string;
  dateConstruction?: string;
  construitAvant1949?: boolean;
  dateCrepPlomb?: string;
  construitAvantJuillet1997?: boolean;
  dateAmiante?: string;
  installationGaz15Ans?: boolean;
  dateDiagnosticGaz?: string;
  installationElec15Ans?: boolean;
  dateDiagnosticElectricite?: string;
  dateDpe?: string;
}

export interface ChecklistTravauxInterieurs {
  realises?: boolean;
  nature?: TravauxNature[];
  realisesPar?: "Un professionnel" | "Le vendeur lui-même";
}

export interface ChecklistDiagnosticsTravauxInterieurs {
  diagnostics: ChecklistDiagnostics;
  travaux: ChecklistTravauxInterieurs;
}
