export interface ChecklistSituationProfessionnelleFiscale {
  situation_pro_fiscale: {
    lieu_imposition?: string;
    numero_fiscal?: string;
    profession?: string;
    employeur?: string;
    assujetti_isf_ifi?: boolean;
    non_resident_fiscal_francais?: boolean;
    residence_fiscale?: {
      pays?: string;
      nif_etranger?: string;
    };
  };
}
