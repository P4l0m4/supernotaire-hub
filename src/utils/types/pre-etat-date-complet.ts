type ISODate = `${number}-${number}-${number}`;
type Euro = number;

export interface PreEtatDate {
  bien: Bien;
  copropriete: Copropriete;
  syndic: Syndic;
  ag: AG;
  financier_lot: FinancierLot;
}

export interface Bien {
  adresse: string;
  identification: {
    batiment: string;
    escalier: string;
    niveau: string;
    complements: string;
  };
  lots: Lot[];
}
export interface Lot {
  numero: string;
  usage: string;
  tantiemes: number;
  tantiemes_speciaux: {
    ascenseur: number;
    chauffage: number;
  };
}

export interface Perimetre {
  lots_concernes: string[];
  commentaire: string;
}

export interface Copropriete {
  arrete_au: ISODate;
  nombre_lots_principaux: number;
  fonds_travaux: { montant: Euro; date_arret: ISODate };
  impayes: { total: Euro; taux: number };
  assurance: { assureur: string; police: string; echeance: ISODate };
  procedures: Procedure[];
  emprunts: Emprunt[];
}
export interface Procedure {
  type: string;
  etat: string;
  montant: Euro;
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

export interface FinancierLot {
  arrete_au: ISODate;
  solde_compte: Euro;
  appels_echus_non_payes: Euro;
  echeances_a_venir: { date: ISODate; montant: Euro }[];
  avances_provisions: { generale: Euro; travaux: Euro };
  charges: {
    N: { courantes: Euro; hors_budget: Euro; année_exercice: string };
    N_1: { courantes: Euro; hors_budget: Euro; année_exercice: string };
  };
  sommes_a_la_charge_acquereur_post_vente: {
    decision_ag: string;
    montant: Euro;
  }[];
}
