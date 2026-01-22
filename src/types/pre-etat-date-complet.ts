export type ISODate = `${number}-${number}-${number}`;
type Euro = number;

export interface PreEtatDate {
  documents: Documents;
  bien: Bien;
  copropriete: Copropriete;
  syndic: Syndic;
  financier_lot: FinancierLot;
  financier_lot_sommes_dues_cedant: FinancierLotSommesDuesCedant;
  financier_lot_sommes_debiteur_syndic: FinancierLotSommesDebiteurSyndic;
  financier_lot_sommes_a_la_charge_acquereur_post_vente: FinancierLotSommesALaChargeAcquereurPostVente;
  financier_lot_autres: FinancierLotAutres;
}

export interface Documents {
  vendeur_nom: string;
  etat_des_soldes_coproprietaires?: File;
  dernier_pv_ag?: File;
  fiche_synthetique_copropriete?: File;
  attestation_de_propriete?: File;
  acte_de_propriete?: File;
  liste_coproprietaires_debiteurs_crediteurs?: File;
}

export interface Bien {
  adresse: string;
  identification: {
    batiment: string;
    escalier: string;
    etage: string;
    complements: string;
  };
  total_tantiemes_vendeur: number;
  total_tantiemes_copropriete: number;
  lots: Lot[];
}

export interface Copropriete {
  arrete_au: ISODate;
  fonds_travaux_existance?: boolean;
  fonds_travaux?: { existance?: boolean; montant?: Euro };
  impayes: { total: Euro };
  dettes_syndic_fournisseurs: number;
  existance_emprunts: boolean;
  emprunts?: Emprunt[];
}

export interface Emprunt {
  objet: string;
  capital_restant_du: Euro;
}

export interface Syndic {
  nom: string;
  contact: { email: string };
}

export interface Provision {
  date: ISODate;
  montant: Euro;
}

export interface Lot {
  designation: string;
  numero: string;
  usage: string;
}

export interface FinancierLot {
  arrete_au: ISODate;
  solde_compte: Euro;
  solde_crediteur_exercice_anterieur: Euro;
  appels_echus_non_payes: Euro;
  echeances_a_venir?: { date: ISODate; montant: Euro }[];
}

export interface FinancierLotSommesDuesCedant {
  provisions_exigibles: {
    budget_previsionnel: Euro;
    hors_budget: Euro;
  };
  avances_exigibles?: {
    avances_exigibles_reserve?: Euro;
    avances_exigibles_provisions_speciales?: Euro;
    avances_exigibles_emprunt?: Euro;
  };
  autres_sommes_exigibles?: {
    charges_impayees_anterieures?: Euro;
    du_fait_de_la_future_vente?: Euro;
    cotisations_fonds_travaux_exigibles?: Euro;
    pret_quote_part_vendeur?: Euro;
    condamnations?: Euro;
    a_des_tiers_emprunts_geres_par_syndic?: Euro;
  };
}

export interface FinancierLotSommesDebiteurSyndic {
  sommes_dont_syndicat_pourrait_etre_debiteur?: {
    provisions_posterieures_rendues_exigibles?: Euro;
    // NB : les “Avances perçues” A1/A2/A3 réutilisent avances_provisions + emprunts
  };

  avances_provisions: {
    generale: Euro;
    travaux: Euro;
    modalites_remboursement: string;
  };
}

export interface FinancierLotSommesALaChargeAcquereurPostVente {
  reconstitution_avances: {
    reserve: Euro;
    provisions_speciales: Euro;
    avances_emprunts: Euro;
  };
  provisions_non_encore_exigibles: {
    budget_previsionnel: Provision[];
    hors_budget: Provision[];
  };
  fonds_travaux_non_encore_exigibles: Provision[];
}

export interface FinancierLotAutres {
  charges: {
    N_1: {
      bp_appelee: Euro;
      bp_reelle: Euro;
      hb_appelee: Euro;
      hb_reelle: Euro;
    };
    N_2: {
      bp_appelee: Euro;
      bp_reelle: Euro;
      hb_appelee: Euro;
      hb_reelle: Euro;
    };
  };
}
