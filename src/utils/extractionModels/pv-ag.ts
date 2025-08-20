import type { AG, Syndic } from "@/utils/types/pre-etat-date-complet.ts";

export interface ExtractionPVAG {
  date_derniere_ag: AG["derniere_ag"]["date"];
  ref_proces_verbal: AG["derniere_ag"]["ref_proces_verbal"];
  travaux_votes: AG["derniere_ag"]["travaux_votes"];
  nom_syndic: Syndic["nom"];
  contact: Syndic["contact"];
  fin_du_mandat: Syndic["fin_du_mandat"];
  date_designation_ag: Syndic["date_designation_ag"];
}
