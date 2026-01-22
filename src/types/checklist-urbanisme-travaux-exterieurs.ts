export type OuiNon = "Oui" | "Non";

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
  | "Permis d'aménager";

export type TypeTravaux =
  | "Un changement de destination (usage du bien ou d'une pièce)"
  | "L'occupation ou l'aménagement du sol (terrasse, piscine, abri, etc)"
  | "L'aspect extérieur (toiture, matériaux visibles)"
  | "Les surfaces ou volumes (agrandissement, extension)"
  | "Une surélévation (niveau supplémentaire par le haut)"
  | "Les façades (murs extérieurs)"
  | "Les structures porteuses avec impact extérieur (murs porteurs)"
  | "Les ouvertures (fenêtres, baie, etc)"
  | "La division intérieure (logements supplémentaires)";

export interface TravauxItem {
  arreteExiste?: OuiNon;
  arreteType?: TypeArreteAutorisation;
  motifAbsenceArrete?: MotifAbsenceArrete;
  typeTravaux?: TypeTravaux[];
  travauxAcheves?: OuiNon;
  dateAchevement?: string;
  travauxNonConformes?: OuiNon;
  dateDepotDaact?: string;
  plansDisponibles?: boolean;
}

export interface ChecklistUrbanismeTravauxExterieurs {
  procedure: {
    enCours?: OuiNon;
    types?: ProcedureType[];
  };
  contentieux: {
    enCours?: OuiNon;
    types?: ContentieuxType[];
    autreDetail?: string;
  };
  servitudes: {
    existent?: OuiNon;
    types?: ServitudeType[];
  };
  zonage: {
    reglemente?: OuiNon;
    type?: TypeZonageDocument;
    typeAutre?: string;
  };
  travaux: {
    impactExterieur?: OuiNon;
    details?: TravauxItem[];
  };
  cadastre: {
    section?: string;
    parcelle?: string;
    superficie?: number | null;
    planDisponible?: OuiNon;
  };
}
