export type OuiNon = "Oui" | "Non";

export type TypeAutorisation =
  | "Permis de construire"
  | "Déclaration préalable de travaux";

export type TypeTravaux =
  | "Changement de destination"
  | "Occupation ou aménagement du sol"
  | "Modification de l'aspect extérieur"
  | "Création de surface ou de volume";

export type ProcedureType =
  | "preemption"
  | "astreinte_administrative"
  | "demolition_remise_etat"
  | "regularisation"
  | "pv_infraction_urbanisme"
  | "mise_en_demeure"
  | "arrete_interruptif_travaux"
  | "refus_dp"
  | "retrait_annulation_permis"
  | "refus_pc"
  | "procedure_administrative"
  | "autre";

export type ContentieuxType =
  | "penal"
  | "judiciaire"
  | "mairie"
  | "ta"
  | "gracieux"
  | "legalite"
  | "autre";

export type ServitudeType =
  | "passage"
  | "vue"
  | "canalisation"
  | "utilite_publique";

export type TypeZonageDocument =
  | "Plan local d'urbanisme (PLU)"
  | "Carte communale"
  | "Zone d'aménagement (ZAC, secteur sauvegardé, etc.)"
  | "Autre";

export type MotifAbsenceArrete =
  | "Autorisation requise mais non obtenue"
  | "Autorisation non requise par le droit de l'urbanisme";

export type TypeArreteAutorisation =
  | "Permis de construire"
  | "Déclaration préalable"
  | "Permis d’aménager";

export interface TravauxItem {
  arreteExiste?: boolean; // true = aucun arrêté, false = arrêté existant
  arreteType?: TypeArreteAutorisation;
  typeTravaux?: TypeTravaux[];
  travauxAcheves?: boolean; // true = non-achevés, false = terminés
  dateAchevement?: string;
  travauxNonConformes?: boolean;
  dateDepotDaact?: string;
  preuveDaact?: File;
  daactDeposee?: boolean;
  plansDisponibles?: boolean; // true = non disponibles, false = disponibles
  plansApprouves?: File;
  arreteDocument?: File;
  motifAbsenceArrete?: MotifAbsenceArrete;
}

export interface ChecklistUrbanismeTravauxExterieurs {
  urbanisme: {
    autorisationsObtenues?: boolean; // true = aucune autorisation obtenue
    typeAutorisation?: TypeAutorisation;
  };
  travaux: {
    impactExterieur?: boolean;
    details?: TravauxItem[];
  };
  procedure: {
    enCours?: boolean;
    types?: ProcedureType[];
  };
  contentieux: {
    enCours?: boolean;
    types?: ContentieuxType[];
    autreDetail?: string;
  };
  servitudes: {
    existent?: boolean;
    types?: ServitudeType[];
  };
  zonage: {
    reglemente?: boolean;
    type?: TypeZonageDocument;
    typeAutre?: string;
  };
  cadastre: {
    section?: string;
    parcelle?: string;
    superficie?: number | null;
    planDisponible?: boolean; // true = possède un extrait ou plan
    plan?: File;
  };
}
