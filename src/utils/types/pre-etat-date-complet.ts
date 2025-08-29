type ISODate = `${number}-${number}-${number}`;
type Euro = number;

export interface PreEtatDate {
  documents: Documents;
  bien: Bien;
  copropriete: Copropriete;
  syndic: Syndic;
  ag: AG;
  financier_lot: FinancierLot;
  financier_lot_sommes_dues_cedant?: FinancierLotSommesDuesCedant;
  financier_lot_autres?: FinancierLotAutres;
  financier_lot_sommes_a_la_charge_acquereur_post_vente?: FinancierLotSommesALaChargeAcquereurPostVente;
}

export interface Documents {
  dernier_pv_ag?: File;
  fiche_synthetique_copropriete?: File;
  attestation_de_propriete?: File;
  releve_individuel_compte?: File;
  etat_dettes_creances?: File;
  comptes_annuels_approuves_annexes?: File;
  tableau_travaux_financements?: File;
}

export interface Bien {
  adresse: string;
  identification: {
    batiment: string;
    escalier: string;
    etage: string;
    complements: string;
  };
  lots: Lot[];
}

export interface Lot {
  numero: string;
  usage: string;
  tantiemes: string;
  tantiemes_speciaux: {
    ascenseur: string;
    chauffage: string;
    eau: string;
    gardiennage: string;
    espaces_verts: string;
  };
}

export interface Copropriete {
  arrete_au: ISODate;
  fonds_travaux: { existance: boolean; montant: Euro };
  impayes: { total: Euro };
  dettes_syndic_fournisseurs: number;
  emprunts: Emprunt[];
}

export interface Emprunt {
  objet: string;
  capital_restant_du: Euro;
}

export interface Syndic {
  nom: string;
  contact: { email: string; telephone: string };
  fin_du_mandat: ISODate;
  date_designation_ag: ISODate;
}

export interface AG {
  derniere_ag: {
    date: ISODate;
    ref_proces_verbal: string;
    travaux_votes: { objet: string; budget: Euro; etat: string }[];
  };
}

export interface Provision {
  date: ISODate;
  montant: Euro;
}

export interface FinancierLot {
  arrete_au: ISODate;
  solde_compte: Euro;
  solde_crediteur_exercice_anterieur?: Euro;
  appels_echus_non_payes: Euro;
  echeances_a_venir?: { date: ISODate; montant: Euro }[];
}

export interface FinancierLotSommesDuesCedant {
  provisions_exigibles?: {
    budget_previsionnel?: Euro;
    hors_budget?: Euro;
  };
  charges_impayees_anterieures?: Euro;
  cotisations_fonds_travaux_exigibles?: Euro;
  autres_sommes_exigibles?: {
    pret_quote_part_vendeur?: Euro;
    condamnations?: Euro;
    autres?: Euro;
    a_des_tiers_emprunts_geres_par_syndic?: Euro;
  };
}

export interface FinancierLotAutres {
  sommes_dont_syndicat_pourrait_etre_debiteur?: {
    provisions_posterieures_rendues_exigibles?: Euro;
    // NB : les “Avances perçues” A1/A2/A3 réutilisent avances_provisions + emprunts
  };

  avances_provisions: {
    generale: Euro;
    travaux: Euro;
    modalites_remboursement: string;
  };

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
