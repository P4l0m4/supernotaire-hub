import { a as _export_sfc, b as __nuxt_component_0, _ as __nuxt_component_0$3, c as __nuxt_component_1$1, f as useNuxtApp, u as useState, j as __nuxt_component_2$1 } from './server.mjs';
import { _ as __nuxt_component_3$1, a as achievement, b as __nuxt_component_5 } from './virtual_public-iCNOiLb_.mjs';
import { _ as __nuxt_component_6 } from './SecondaryButton-Bz5oS0xB.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, reactive, ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { p as processDocument } from './textFromDocument-Dh1G48l-.mjs';
import { _ as __nuxt_component_2 } from './FAQComponent-BTibXSzv.mjs';
import { _ as __nuxt_component_3 } from './DidYouKnow-D3KAcN22.mjs';
import { u as useJsonld } from './composable-ChyRw7se.mjs';
import { u as useHead } from './v3-BRmP28IU.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'vue-router';
import 'dayjs';
import 'dayjs/plugin/updateLocale.js';
import 'dayjs/plugin/utc.js';
import 'floating-vue';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './InputField-CzMR3qml.mjs';
import './TagComponent-DzyrMhAj.mjs';
import '@vueuse/core';
import './TertiaryButton-B2pqK--O.mjs';
import '@vuelidate/validators';
import '@vuelidate/core';

const checklist = publicAssetsURL("/checklist-71-blue.svg?url");
const filesAndFolder = publicAssetsURL("/files-and-folder-78.svg?url");
const title = "Pr\xE9-\xE9tat dat\xE9";
const sections = /* @__PURE__ */ JSON.parse(`[{"id":"documents","label":"Les sources","fields":[{"path":"document.dernier_pv_ag","id":"dernier-pv-ag","label":"Dernier PV d'AG","name":"dernier_pv_ag","type":"file","required":false,"icon":"plus_circle","accept":[".pdf",".png",".jpg",".jpeg"],"multiple":false,"TS_TYPE":"TS_TYPE_ExtractionPVAG"},{"path":"document.fiche_synthetique_copropriete","id":"fiche-synthetique-copropriete","label":"Fiche synth\xE9tique de la copropri\xE9t\xE9","name":"fiche_synthetique_copropriete","type":"file","required":false,"icon":"plus_circle","accept":[".pdf",".png",".jpg",".jpeg"],"multiple":false,"TS_TYPE":"TS_TYPE_FicheSynth\xE9tiqueCopropri\xE9t\xE9"},{"path":"document.acte_de_propriete","id":"acte-de-propriete","label":"Attestation de propri\xE9t\xE9","name":"acte_de_propriete","type":"file","required":false,"icon":"plus_circle","accept":[".pdf",".png",".jpg",".jpeg"],"multiple":false,"TS_TYPE":"TS_TYPE_AttestationDePropri\xE9t\xE9"},{"path":"document.releve_individuel_compte","id":"releve-individuel-compte","label":"Relev\xE9 individuel de compte","name":"releve_individuel_compte","type":"file","required":false,"icon":"plus_circle","accept":[".pdf",".png",".jpg",".jpeg"],"multiple":false,"TS_TYPE":"TS_TYPE_ExtractionRIC"},{"path":"document.etat_dettes_creances","id":"etat-dettes-creances","label":"\xC9tat des dettes et cr\xE9ances","name":"etat_dettes_creances","type":"file","required":false,"icon":"plus_circle","accept":[".pdf",".png",".jpg",".jpeg"],"multiple":false,"TS_TYPE":"TS_TYPE_ExtractionEtatDettesCreances"},{"path":"document.comptes_annuels_approuves_annexes","id":"comptes-annuels-approuves-annexes","label":"Comptes annuels approuv\xE9s et annexes","name":"comptes_annuels_approuves_annexes","type":"file","required":false,"icon":"plus_circle","accept":[".pdf",".png",".jpg",".jpeg"],"multiple":false,"TS_TYPE":"TS_TYPE_ExtractionCAAA"},{"path":"document.tableau_travaux_financement","id":"tableau-travaux-financement","label":"Tableau des travaux et financements","name":"tableau_travaux_financement","type":"file","required":false,"icon":"plus_circle","accept":[".pdf",".png",".jpg",".jpeg"],"multiple":false,"TS_TYPE":"TS_TYPE_ExtractionTableauTravauxFinancements"}]},{"id":"bien","label":"Le bien \xE0 vendre","fields":[{"path":"bien.adresse","id":"bien-adresse","suggestionRef":"adresse_du_bien","label":"Adresse","name":"adresse","type":"text","required":true,"placeholder":"12 Rue Exemple, 75000 Paris","icon":"map_pin_fill"},{"path":"bien.identification.batiment","id":"bien-identification-batiment","suggestionRef":"identification_du_batiment","label":"Identifiant du b\xE2timent","name":"batiment","type":"text","placeholder":"A, B1, etc.","required":true,"icon":"buildings_fill"},{"path":"bien.identification.escalier","id":"bien-identification-escalier","suggestionRef":"bien_identification_escalier","label":"Entr\xE9e / cage (escalier)","name":"escalier","type":"text","placeholder":"1, B, etc.","required":false,"icon":"stairs_fill"},{"path":"bien.identification.etage","id":"bien-identification-etage","suggestionRef":"bien_identification_etage","label":"\xC9tage","name":"etage","type":"text","placeholder":"3e, RDC...","required":true,"icon":"escalator_up_fill"},{"path":"bien.identification.complements","id":"bien-identification-complements","suggestionRef":"bien_identification_complements","label":"Compl\xE9ments","name":"complements","required":false,"type":"text","placeholder":"Porte 12"},{"path":"bien.lots","id":"bien-lots","label":"Liste des lots","name":"lots","suggestionRef":"bien_lots","type":"array","minItems":1,"required":true,"itemLabel":"Lot {{index}}","itemSchema":{"fields":[{"path":"designation","suggestionRef":"bien_lots_designation","label":"Num\xE9ro","name":"designation","type":"text","required":true,"placeholder":"cave 754, parking 12, appartement T3, etc","icon":"hash_fill"},{"path":"numero","suggestionRef":"bien_lots_numero","label":"Num\xE9ro","name":"numero","type":"text","required":true,"placeholder":"56","icon":"hash_fill"},{"path":"usage","suggestionRef":"bien_lots_usage","label":"Usage","name":"usage","type":"select","options":["Habitation","Commercial","Exploitation agricole et foresti\xE8re","Int\xE9r\xEAt collectif et services publics","Autre"],"placeholder":"S\xE9lectionner un usage","icon":"gear_six_fill","required":true}]}}]},{"id":"copropriete","label":"La copro","fields":[{"path":"copropriete.arrete_au","id":"copropriete-arrete-au","suggestionRef":"copropriete_arrete_au","label":"Date de cl\xF4ture de l\u2019exercice","name":"arrete_au","type":"date","mode":"date-picker","placeholder":"jj-mm-aaaa","required":true,"icon":"calendar_dots_fill","tooltip":"Date de cl\xF4ture de l\u2019exercice comptable de la copropri\xE9t\xE9."},{"path":"copropriete.fonds_travaux_existance","id":"copropriete-fonds_travaux_existance","suggestionRef":"copropriete_fonds_travaux_existance","label":"Existe-t-il un fonds travaux ALUR ?","name":"fonds_travaux_existance","type":"checkbox","required":false},{"path":"copropriete.fonds_travaux.montant","suggestionRef":"copropriete_montant_du_fonds_travaux","id":"copropriete-fonds-travaux-montant","label":"Montant total fonds travaux","name":"fonds_travaux_montant","required":true,"placeholder":"0 si pas de fonds travaux","type":"number","min":0,"step":0.01,"tooltip":"Montant total du fonds travaux \xE0 la date de cl\xF4ture de l\u2019exercice."},{"path":"copropriete.impayes.total","suggestionRef":"copropriete_impayes_total","id":"copropriete-impayes-total","label":"Impay\xE9s total","name":"impayes_total","type":"number","placeholder":"0 si aucun","min":0,"max":100000000,"step":0.01,"required":true,"tooltip":"Montant total des charges impay\xE9es par l\u2019ensemble des copropri\xE9taires \xE0 la date de cl\xF4ture de l\u2019exercice."},{"path":"copropriete.dettes_syndic_fournisseurs","suggestionRef":"copropriete_dettes_syndic_fournisseurs","id":"copropriete-dettes-syndic-fournisseurs","label":"Dettes vis-\xE0-vis des fournisseurs \xE0 la derni\xE8re cl\xF4ture","name":"dettes_syndic_fournisseurs","type":"number","min":0,"step":1,"placeholder":"1000","required":true},{"path":"copropriete.emprunts","suggestionRef":"copropriete_emprunts","id":"copropriete-emprunts","label":"Emprunts \xE9ventuels","name":"emprunts-eventuels","required":false,"type":"array","itemLabel":"Emprunt {{index}}","itemSchema":{"fields":[{"path":"objet","suggestionRef":"objet","label":"Objet","type":"text","placeholder":"R\xE9novation toiture"},{"path":"capital_restant_du","suggestionRef":"capital_restant_du","label":"Capital restant d\xFB","type":"number","placeholder":"10000","min":0,"step":1}]}}]},{"id":"syndic","label":"Le syndic","fields":[{"path":"syndic.nom","suggestionRef":"nom_du_syndic","id":"syndic-nom","label":"Nom du syndic","name":"syndic_nom","type":"text","placeholder":"Foncia Lemanic, etc.","required":true},{"path":"syndic.contact.email","suggestionRef":"email_du_syndic","id":"syndic-contact-email","label":"Email","name":"syndic_contact_email","type":"email","placeholder":"syndic@email.com","required":true}]},{"id":"financier_lot","label":"Situation financi\xE8re du lot","fields":[{"path":"financier_lot.arrete_au","suggestionRef":"financier_lot_arrete_au","id":"financier_lot-arrete-au","label":"Arr\xEAt\xE9 au","name":"financier_lot_arrete_au","placeholder":"jj-mm-aaaa","type":"date","mode":"date-picker","required":true,"icon":"calendar_dots_fill"},{"path":"financier_lot.solde_compte","suggestionRef":"solde_compte","id":"financier_lot-solde-compte","label":"Solde du compte","name":"financier_lot_solde_compte","type":"number","placeholder":"10000","min":-100000000,"max":100000000,"step":0.01,"required":true},{"path":"financier_lot.solde_crediteur_exercice_anterieur","suggestionRef":"solde_crediteur_exercice_anterieur","id":"solde-crediteur-exercice-anterieur","label":"Solde cr\xE9diteur exercice ant\xE9rieur non imput\xE9","name":"solde_crediteur_exercice_anterieur","type":"number","min":0,"step":0.01,"required":false,"placeholder":"100","tooltip":"Solde cr\xE9diteur de l'exercice ant\xE9rieur approuv\xE9 non imput\xE9 sur le compte du vendeur."},{"path":"financier_lot.appels_echus_non_payes","suggestionRef":"appels_echus_non_payes","id":"financier_lot-appels-echus-non-payes","label":"Appels \xE9chus non pay\xE9s","name":"financier_lot_appels_echus_non_payes","type":"number","placeholder":"1000","min":0,"step":0.01,"required":true},{"path":"financier_lot.echeances_a_venir","suggestionRef":"financier_lot_echeances_a_venir","id":"financier_lot-echeances-a-venir","label":"\xC9ch\xE9ances \xE0 venir","name":"financier_lot_echeances_a_venir","minItems":0,"maxItems":100,"type":"array","required":false,"itemLabel":"\xC9ch\xE9ance {{index}}","itemSchema":{"fields":[{"path":"date","label":"Date","type":"date","placeholder":"jj-mm-aaaa","required":true,"mode":"date-picker","icon":"calendar_dots_fill"},{"path":"montant","label":"Montant","type":"number","placeholder":"1000","min":0,"step":0.01,"required":true,"icon":"hand_coins_fill"}]}}]},{"id":"financier_lot_sommes_dues_cedant","label":"Sommes dues par le c\xE9dant","fields":[{"path":"financier_lot_sommes_dues_cedant.provisions_exigibles.budget_previsionnel","suggestionRef":"cedant_provisions_budget_previsionnel_exigibles","id":"cedant-provisions-bp-exigibles","label":"Provisions du budget pr\xE9visionnel exigibles","name":"cedant_provisions_exigibles_bp","type":"number","min":0,"step":0.01,"required":false,"placeholder":"1000","tooltip":"Appels du budget pr\xE9visionnel arriv\xE9s \xE0 \xE9ch\xE9ance \xE0 la date de la vente et dus par le vendeur s\u2019ils ne sont pas pay\xE9s."},{"path":"financier_lot_sommes_dues_cedant.provisions_exigibles.hors_budget","suggestionRef":"cedant_provisions_hb_exigibles","id":"cedant-provisions-hb-exigibles","label":"Provisions hors budget exigibles","name":"cedant_provisions_exigibles_hb","type":"number","min":0,"step":0.01,"required":false,"placeholder":"1000","tooltip":"Appels hors budget arriv\xE9s \xE0 \xE9ch\xE9ance \xE0 la date de la vente et dus par le vendeur s\u2019ils ne sont pas pay\xE9s."},{"path":"financier_lot_sommes_dues_cedant.charges_impayees_anterieures","suggestionRef":"charges_impayees_anterieures_dues_par_le_cedant","id":"cedant-charges-impayees-anterieures","label":"Charges impay\xE9es ant\xE9rieures","name":"cedant_charges_impayees_anterieures","type":"number","min":0,"step":0.01,"required":false,"placeholder":"1000"},{"path":"financier_lot_sommes_dues_cedant.cotisations_fonds_travaux_exigibles","suggestionRef":"cedant_cotisations_fonds_travaux_exigibles","id":"cedant-cotisations-fonds-travaux-exigibles","label":"Cotisations au fonds de travaux exigibles","name":"cedant_cotisations_fonds_travaux_exigibles","type":"number","min":0,"step":0.01,"required":false,"placeholder":"1000","tooltip":"Cotisations au fonds de travaux arriv\xE9es \xE0 \xE9ch\xE9ance \xE0 la date de la vente et dues par le vendeur si non r\xE9gl\xE9es."},{"path":"financier_lot_sommes_dues_cedant.autres_sommes_exigibles.pret_quote_part_vendeur","suggestionRef":"cedant_autres_exigibles_pret_quote_part_vendeur","id":"cedant-autres-exigibles-pret-quote-part-vendeur","label":"Autres sommes exigibles \u2014 Pr\xEAt (quote-part vendeur)","name":"cedant_autres_exigibles_pret_quote_part_vendeur","type":"number","min":0,"step":0.01,"required":false,"placeholder":"200"},{"path":"financier_lot_sommes_dues_cedant.autres_sommes_exigibles.condamnations","suggestionRef":"cedant_autres_exigibles_condamnations","id":"cedant-autres-exigibles-condamnations","label":"Autres sommes exigibles \u2014 Condamnations","name":"cedant_autres_exigibles_condamnations","type":"number","min":0,"step":0.01,"required":false,"placeholder":"200"},{"path":"financier_lot_sommes_dues_cedant.autres_sommes_exigibles.autres","suggestionRef":"cedant_autres_exigibles_autres","id":"cedant-autres-exigibles-autres","label":"Autres sommes exigibles \u2014 Autres","name":"cedant_autres_exigibles_autres","type":"number","min":0,"step":0.01,"required":false,"placeholder":"1000"},{"path":"financier_lot_sommes_dues_cedant.autres_sommes_exigibles.a_des_tiers_emprunts_geres_par_syndic","suggestionRef":"sommes_exigibles_dues_par_cedant_a_des_tiers_emprunts_geres_par_syndic","id":"cedant-autres-exigibles-a-des-tiers-emprunts-geres-par-syndic","label":"Autres sommes exigibles \u2014 \xC0 des tiers (emprunts g\xE9r\xE9s par le syndic)","name":"cedant_autres_exigibles_a_des_tiers_emprunts_geres_par_syndic","type":"number","min":0,"step":0.01,"required":false,"placeholder":"1000"}]},{"id":"financier_lot_autres","label":"Autres sommes","fields":[{"path":"financier_lot_autres.sommes_dont_syndicat_pourrait_etre_debiteur.provisions_posterieures_rendues_exigibles","suggestionRef":"provisions_posterieures_rendues_exigibles","id":"provisions-posterieures-rendues-exigibles","label":"Provisions post\xE9rieures rendues exigibles","name":"provisions_posterieures_rendues_exigibles","type":"number","min":0,"step":0.01,"required":false,"placeholder":"1000","tooltip":"Provisions encaiss\xE9es pour des p\xE9riodes post\xE9rieures et rendues exigibles (art. 19-2 loi du 10/07/1965)."},{"path":"financier_lot_autres.avances_provisions.generale","suggestionRef":"financier_lot_autres_avances_provisions_generale","id":"financier_lot_autres-avances_provisions-generale","label":"Avance g\xE9n\xE9rale","name":"financier_lot_autres_avances_provisions_generale","type":"number","placeholder":"1000","min":0,"step":0.01,"required":false,"tooltip":"Avance de tr\xE9sorerie / fonds de roulement vers\xE9e ant\xE9rieurement par le vendeur. Montant cr\xE9dit\xE9 sur son compte, non consomm\xE9 \xE0 la date de la vente."},{"path":"financier_lot_autres.avances_provisions.travaux","suggestionRef":"avances_provisions_travaux","id":"financier_lot_autres-avances_provisions-travaux","label":"Provision travaux","name":"financier_lot_autres_avances_provisions_travaux","type":"number","placeholder":"1000","min":0,"step":0.01,"required":false},{"path":"financier_lot_autres.avances_provisions.modalites_remboursement","suggestionRef":"modalites_remboursement_sommes_dues_par_syndic","label":"Modalit\xE9s de remboursement","name":"financier_lot_autres_modalites_remboursement","type":"select","options":["Transfert \xE0 l\u2019acqu\xE9reur","Remboursement au c\xE9dant"],"placeholder":"S\xE9lectionner si applicable","icon":"gear_six_fill","required":false},{"path":"financier_lot_autres.charges.N_1.bp_appelee","suggestionRef":"charges_N_1_quote_part_bp_appelee","id":"financier_lot_autres-charges-N_1-bp_appelee","label":"Charges N-1 - quote-part Budget Pr\xE9visionnel appel\xE9e","name":"financier_lot_autres_charges_N_1_quote_part_bp_appelee","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"},{"path":"financier_lot_autres.charges.N_1.bp_reelle","suggestionRef":"charges_N_1_quote_part_bp_reelle","id":"financier_lot_autres-charges-N_1-bp_reelle","label":"Charges N-1 - quote-part Budget Pr\xE9visionnel r\xE9elle","name":"financier_lot_autres_charges_N_1_quote_part_bp_reelle","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"},{"path":"financier_lot_autres.charges.N_1.hb_appelee","suggestionRef":"charges_N_1_quote_part_hb_appelee","id":"financier_lot_autres-charges-N_1-hb_appelee","label":"Charges N-1 - quote-part Budget Pr\xE9visionnel appel\xE9e","name":"financier_lot_autres_charges_N_1_quote_part_hb_appelee","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"},{"path":"financier_lot_autres.charges.N_1.hb_reelle","suggestionRef":"charges_N_1_quote_part_hb_reelle","id":"financier_lot_autres-charges-N_1-hb_reelle","label":"Charges N-1 - quote-part Budget Pr\xE9visionnel r\xE9elle","name":"financier_lot_autres_charges_N_1_quote_part_hb_reelle","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"},{"path":"financier_lot_autres.charges.N_2.bp_appelee","suggestionRef":"charges_N_2_quote_part_bp_appelee","id":"financier_lot_autres-charges-N_2-bp_appelee","label":"Charges N-2 - quote-part Budget Pr\xE9visionnel appel\xE9e","name":"financier_lot_autres_charges_N_2_quote_part_bp_appelee","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"},{"path":"financier_lot_autres.charges.N_2.bp_reelle","suggestionRef":"charges_N_2_quote_part_bp_reelle","id":"financier_lot_autres-charges-N_2-bp_reelle","label":"Charges N-2 - quote-part Budget Pr\xE9visionnel r\xE9elle","name":"financier_lot_autres_charges_N_2_quote_part_bp_reelle","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"},{"path":"financier_lot_autres.charges.N_2.hb_appelee","suggestionRef":"charges_N_2_quote_part_hb_appelee","id":"financier_lot_autres-charges-N_2-hb_appelee","label":"Charges N-2 - quote-part Budget Pr\xE9visionnel appel\xE9e","name":"financier_lot_autres_charges_N_2_quote_part_hb_appelee","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"},{"path":"financier_lot_autres.charges.N_2.hb_reelle","suggestionRef":"charges_N_2_quote_part_hb_reelle","id":"financier_lot_autres-charges-N_2-hb_reelle","label":"Charges N-2 - quote-part Budget Pr\xE9visionnel r\xE9elle","name":"financier_lot_autres_charges_N_2_quote_part_hb_reelle","type":"number","min":0,"step":0.01,"required":true,"placeholder":"1000"}]},{"id":"financier_lot_sommes_a_la_charge_acquereur_post_vente","label":"Sommes \xE0 la charge acqu\xE9reur","fields":[{"path":"financier_lot_sommes_a_la_charge_acquereur_post_vente.reconstitution_avances.reserve","id":"acq-reconstitution-reserve","label":"Reconstitution \u2013 R\xE9serve","name":"acq_reconstitution_reserve","type":"number","min":0,"step":1,"required":false,"placeholder":"1000"},{"path":"financier_lot_sommes_a_la_charge_acquereur_post_vente.reconstitution_avances.provisions_speciales","id":"acq-reconstitution-provisions-speciales","label":"Reconstitution \u2013 Provisions sp\xE9ciales","name":"acq_reconstitution_provisions_speciales","type":"number","min":0,"step":1,"required":false,"placeholder":"500"},{"path":"financier_lot_sommes_a_la_charge_acquereur_post_vente.reconstitution_avances.avances_emprunts","id":"acq-reconstitution-avances-emprunts","label":"Reconstitution \u2013 Avances (emprunts)","name":"acq_reconstitution_avances_emprunts","type":"number","min":0,"step":1,"required":false,"tooltip":"Avances vers\xE9es par le vendeur pour le remboursement d\u2019emprunts contract\xE9s par le syndicat des copropri\xE9taires."},{"path":"financier_lot_sommes_a_la_charge_acquereur_post_vente.provisions_non_encore_exigibles.budget_previsionnel","id":"acq-pnee-bp","label":"Provisions non encore exigibles \u2014 Budget pr\xE9visionnel","name":"acq_pnee_bp","type":"array","required":false,"itemLabel":"\xC9ch\xE9ance BP {{index}}","itemSchema":{"fields":[{"path":"date","label":"Date d\u2019exigibilit\xE9","type":"date","mode":"date-picker","required":true,"icon":"calendar_dots_fill","placeholder":"jj-mm-aaaa"},{"path":"montant","label":"Montant","type":"number","min":0,"step":0.01,"required":true,"placeholder":"300","icon":"hand_coins_fill"}]}},{"path":"financier_lot_sommes_a_la_charge_acquereur_post_vente.provisions_non_encore_exigibles.hors_budget","id":"acq-pnee-hb","suggestionRef":"provisions_non_encore_exigibles_hors_budget","label":"Provisions non encore exigibles \u2014 Hors budget","name":"acq_pnee_hb","type":"array","required":false,"itemLabel":"\xC9ch\xE9ance HB {{index}}","itemSchema":{"fields":[{"path":"date","label":"Date d\u2019exigibilit\xE9","type":"date","mode":"date-picker","placeholder":"jj-mm-aaaa","required":true,"icon":"calendar_dots_fill"},{"path":"montant","label":"Montant","type":"number","min":0,"step":0.01,"required":true,"placeholder":"400","icon":"hand_coins_fill"}]}},{"path":"financier_lot_sommes_a_la_charge_acquereur_post_vente.fonds_travaux_non_encore_exigibles","id":"acq-fonds-travaux-non-encore-exigibles","label":"Fonds de travaux \u2014 Provisions non encore exigibles","name":"acq_fonds_travaux_non_encore_exigibles","type":"array","required":false,"itemLabel":"\xC9ch\xE9ance fonds travaux {{index}}","itemSchema":{"fields":[{"path":"date","label":"Date d\u2019exigibilit\xE9","type":"date","mode":"date-picker","required":true,"placeholder":"jj-mm-aaaa","icon":"calendar_dots_fill"},{"path":"montant","label":"Montant","type":"number","min":0,"step":0.01,"required":true,"placeholder":"400","icon":"hand_coins_fill"}]}}]}]`);
const formDefinition = {
  title,
  sections
};
const TS_TYPE_ExtractionPVAG = `
{
  adresse_du_bien: Bien["adresse"]; //format: 123 rue de Paris, 75001 Paris
  identification_du_batiment: Bien["identification"]["batiment"]; //format: A, B1, etc.
};`.trim();
const TS_TYPE_FicheSynth\u00E9tiqueCopropri\u00E9t\u00E9 = `
{
 nom_du_syndic: Syndic["nom"];
  email_du_syndic: Syndic["contact"]["email"]; //format: string, email valide
  copropriete_arrete_au: Copropriete["arrete_au"]; //format: 20-11-2023, date de cl\xF4ture de l\u2019exercice comptable
  copropriete_montant_du_fonds_travaux: Copropriete["fonds_travaux"]["montant"]; //format: integer
  copropriete_impayes_total: Copropriete["impayes"]["total"]; //format: integer, montant des sommes restant dues par les copropri\xE9taires
  copropriete_dettes_syndic_fournisseurs: Copropriete["dettes_syndic_fournisseurs"]; //format: integer, dettes fournisseurs, r\xE9mun\xE9rations et autres
};`.trim();
const TS_TYPE_AttestationDePropri\u00E9t\u00E9 = `
{
   bien_lots: Bien["lots"]; //format : { bien_lots_designation: string (ex: "cave 754"); bien_lots_numero: string (ex: "13"); bien_lots_usage: "Habitation" | "Commercial" | "Exploitation agricole et foresti\xE8re" | "Int\xE9r\xEAt collectif et services publics" | "Autre";}[]
};`.trim();
const TS_TYPE_ExtractionRIC = `
{
  solde_compte: FinancierLot["solde_compte"]; // format: number
  solde_crediteur_exercice_anterieur?: FinancierLot["solde_crediteur_exercice_anterieur"]; // format: number
  appels_echus_non_payes: FinancierLot["appels_echus_non_payes"]; // format: number
  echeances_a_venir?: FinancierLot["echeances_a_venir"]; // format: { date: 20-11-2023; montant: number }[]
};`.trim();
const TS_TYPE_ExtractionEtatDettesCreances = `
{
   sommes_exigibles_dues_par_cedant_a_des_tiers_emprunts_geres_par_syndic?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["a_des_tiers_emprunts_geres_par_syndic"]; // format: number
  pret_quote_part_vendeur?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["pret_quote_part_vendeur"]; // format: number
  condamnations?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["condamnations"]; // format: number
  autres_sommes_exigibles_autres?: FinancierLotSommesDuesCedant["autres_sommes_exigibles"]["autres"]; // format: number
  copropriete_dettes_syndic_fournisseurs: Copropriete["dettes_syndic_fournisseurs"]; // format: number, Dettes vis-\xE0-vis des fournisseurs \xE0 la derni\xE8re cl\xF4ture
  copropriete_emprunts: Copropriete["emprunts"]; // format: { objet: string; capital_restant_du: number }[]
};`.trim();
const TS_TYPE_ExtractionCAAA = `
{
  charges_N_1_quote_part_bp_appelee: FinancierLotAutres["charges"]["N_1"]["bp_appelee"]; // format: number, bp signifie budget pr\xE9visionnel
  charges_N_1_quote_part_bp_reelle: FinancierLotAutres["charges"]["N_1"]["bp_reelle"]; // format: number, bp signifie budget pr\xE9visionnel
  charges_N_1_quote_part_hb_appelee: FinancierLotAutres["charges"]["N_1"]["hb_appelee"]; // format: number, hb signifie hors budget pr\xE9visionnel
  charges_N_1_quote_part_hb_reelle: FinancierLotAutres["charges"]["N_1"]["hb_reelle"]; // format: number, hb signifie hors budget pr\xE9visionnel
  charges_N_2_quote_part_bp_appelee: FinancierLotAutres["charges"]["N_2"]["bp_appelee"]; // format: number, bp signifie budget pr\xE9visionnel
  charges_N_2_quote_part_bp_reelle: FinancierLotAutres["charges"]["N_2"]["bp_reelle"]; // format: number, bp signifie budget pr\xE9visionnel
  charges_N_2_quote_part_hb_appelee: FinancierLotAutres["charges"]["N_2"]["hb_appelee"]; // format: number, hb signifie hors budget pr\xE9visionnel
  charges_N_2_quote_part_hb_reelle: FinancierLotAutres["charges"]["N_2"]["hb_reelle"]; // format: number, hb signifie hors budget pr\xE9visionnel
};`.trim();
const TS_TYPE_ExtractionTableauTravauxFinancements = `
{
  cedant_provisions_hb_exigibles: FinancierLotSommesDuesCedant["provisions_exigibles"]["hors_budget"]; // format: number
  provisions_non_encore_exigibles_hors_budget: FinancierLotSommesALaChargeAcquereurPostVente["provisions_non_encore_exigibles"]["hors_budget"]; // format: { date: 20-11-2000; montant: number }[]
  avances_provisions_travaux: FinancierLotAutres["avances_provisions"]["travaux"]; // format: number
};`.trim();
async function AIExtractInfoFromText(textBlob, documentName, TS_TYPE) {
  throw new Error("client_only");
}
async function extractDataFromResults(relevantPages = [], resultsFromTextExtraction, documentName, TS_TYPE) {
  console.log("Extracting data from results...");
  let textFromRelevantPages;
  if (!resultsFromTextExtraction || !resultsFromTextExtraction.result)
    return null;
  if (relevantPages.length === 0) {
    textFromRelevantPages = resultsFromTextExtraction.result.summary.map((page) => page.pageText).join("\n");
  } else {
    textFromRelevantPages = relevantPages.map((pageNumber) => {
      const page = resultsFromTextExtraction.result.summary.find(
        (p) => p.pageNumber === pageNumber
      );
      return page ? page.pageText : "";
    }).join("\n");
    console.log(`Using relevant pages`);
  }
  let AIExtractionResult;
  try {
    AIExtractionResult = await AIExtractInfoFromText(
      textFromRelevantPages,
      documentName,
      TS_TYPE
    );
    console.log("Extraction result:", AIExtractionResult);
  } catch (e) {
    console.error("Extraction error:", e);
  }
  console.log("Extraction finished:", AIExtractionResult);
  return AIExtractionResult;
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GenerateurPED",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b, _c, _d;
    const annexes = [
      "Dernier proc\xE8s-verbal d\u2019assembl\xE9e g\xE9n\xE9rale approuv\xE9.",
      "\xC9tat dat\xE9 des impay\xE9s du copropri\xE9taire vendeur et des dettes envers le syndicat.",
      "Montant du fonds travaux (ALUR) et arr\xEAt\xE9 correspondant.",
      "Carnet d\u2019entretien de l\u2019immeuble.",
      "Diagnostic technique global (DTG) s\u2019il existe.",
      "Budget pr\xE9visionnel vot\xE9 et les comptes des deux derniers exercices.",
      "\xC9tat des proc\xE9dures en cours contre la copropri\xE9t\xE9.",
      "Copie du r\xE8glement de copropri\xE9t\xE9 et \xE9tat descriptif de division, \xE0 jour.",
      "Attestation d\u2019assurance de l\u2019immeuble."
    ];
    const documents = [
      "Dernier proc\xE8s-verbal d\u2019assembl\xE9e g\xE9n\xE9rale approuv\xE9.",
      "Fiche synth\xE9tique de la copropri\xE9t\xE9.",
      "Attestation de propri\xE9t\xE9.",
      "Relev\xE9 individuel de compte.",
      "\xC9tat des dettes et cr\xE9ances.",
      "Comptes annuels approuv\xE9s et annexes.",
      "Tableau des travaux et financements vot\xE9s en AG."
    ];
    const formData = reactive({});
    const showFirstAction = ref(true);
    const showLastAction = ref(false);
    formData.bien = (_a = formData.bien) != null ? _a : {
      adresse: "",
      identification: { batiment: "", escalier: "", niveau: "", complements: "" },
      lots: []
    };
    formData.bien.lots = Array.isArray(formData.bien.lots) ? formData.bien.lots : [];
    (_b = formData.financier_lot) != null ? _b : {};
    const { $pdfMake } = useNuxtApp();
    useState("pdfmake-ready");
    const TS_TYPES = {
      TS_TYPE_ExtractionPVAG,
      TS_TYPE_FicheSynth\u00E9tiqueCopropri\u00E9t\u00E9,
      TS_TYPE_AttestationDePropri\u00E9t\u00E9,
      TS_TYPE_ExtractionRIC,
      TS_TYPE_ExtractionEtatDettesCreances,
      TS_TYPE_ExtractionCAAA,
      TS_TYPE_ExtractionTableauTravauxFinancements
    };
    const FIELD_BY_DOC_KEY = {};
    for (const sec of (_c = formDefinition.sections) != null ? _c : []) {
      for (const f of (_d = sec.fields) != null ? _d : []) {
        if (typeof f.path === "string" && f.path.startsWith("document.")) {
          const k = f.path.split(".")[1];
          FIELD_BY_DOC_KEY[k] = f;
        }
      }
    }
    function resolveTsTypeFor(key) {
      var _a2;
      const f = FIELD_BY_DOC_KEY[key];
      if (!f || !f.TS_TYPE) return null;
      return (_a2 = TS_TYPES[f.TS_TYPE]) != null ? _a2 : typeof f.TS_TYPE === "string" ? f.TS_TYPE : null;
    }
    const suggestions = ref([]);
    function toRows(o) {
      return Object.entries(o).map(([key, value]) => ({ key, value }));
    }
    function upsertSuggestions(rows) {
      const map = new Map(suggestions.value.map((r) => [r.key, r.value]));
      for (const r of rows) map.set(r.key, r.value);
      suggestions.value = Array.from(map, ([key, value]) => ({ key, value }));
    }
    async function handleDocumentInfoExtraction(key, file) {
      const { results } = await processDocument(file);
      const TS_TYPE = resolveTsTypeFor(key);
      if (!TS_TYPE) return;
      const filledModel = await extractDataFromResults([], results, key, TS_TYPE);
      upsertSuggestions(toRows(filledModel || {}));
    }
    const seen = /* @__PURE__ */ new Map();
    const fileSig = (f) => `${f.name}|${f.size}|${f.lastModified}`;
    watch(
      () => formData.document,
      (docs) => {
        if (!docs) return;
        for (const [key, val] of Object.entries(docs)) {
          if (val instanceof File) {
            const sig = fileSig(val);
            if (seen.get(key) !== sig) {
              seen.set(key, sig);
              handleDocumentInfoExtraction(key, val);
            }
          } else if (val == null) {
            seen.delete(key);
          }
        }
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIPrimaryButton = __nuxt_component_1$1;
      const _component_FormElementsDynamicForm = __nuxt_component_3$1;
      const _component_TrustPilot = __nuxt_component_5;
      const _component_UISecondaryButton = __nuxt_component_6;
      const _component_ClientOnly = __nuxt_component_2$1;
      _push(`<!--[-->`);
      if (unref(showFirstAction)) {
        _push(`<div class="action" data-v-656121db><div class="action__illustration" data-v-656121db><img class="action__illustration__image"${ssrRenderAttr("src", unref(checklist))} alt="Avant de commencer" data-v-656121db></div><ul class="action__list" data-v-656121db><span class="action__list__title" data-v-656121db>Avant de commencer...</span><span class="action__list__subtitle" data-v-656121db>Munissez-vous des documents (digitalis\xE9s) suivants: </span><!--[-->`);
        ssrRenderList(documents, (document) => {
          _push(`<li class="action__list__item" data-v-656121db>${ssrInterpolate(document)}</li>`);
        });
        _push(`<!--]--><div class="action__list__buttons" data-v-656121db>`);
        _push(ssrRenderComponent(_component_UIPrimaryButton, {
          icon: "arrow_right",
          variant: "accent-color",
          onClick: ($event) => showFirstAction.value = false,
          style: { "margin-top": "1rem" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Commencer`);
            } else {
              return [
                createTextVNode("Commencer")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(showFirstAction) && !unref(showLastAction)) {
        _push(ssrRenderComponent(_component_FormElementsDynamicForm, {
          formDefinition: unref(formDefinition),
          suggestions: unref(suggestions),
          modelValue: formData,
          "onUpdate:modelValue": ($event) => formData = $event,
          onComplete: ($event) => showLastAction.value = true
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(showLastAction)) {
        _push(`<div class="action" data-v-656121db><div class="action__illustration" data-v-656121db><img class="action__illustration__image"${ssrRenderAttr("src", unref(achievement))} alt="Avant de partir" data-v-656121db></div><ul class="action__list" data-v-656121db><span class="action__list__title" data-v-656121db>C&#39;est pr\xEAt !</span><span class="action__list__subtitle" data-v-656121db> Votre Pr\xE9-\xE9tat dat\xE9 est pr\xEAt \xE0 \xEAtre t\xE9l\xE9charg\xE9. </span>`);
        _push(ssrRenderComponent(_component_TrustPilot, { style: { "margin-top": "auto" } }, null, _parent));
        _push(`<div class="action__list__buttons" data-v-656121db>`);
        _push(ssrRenderComponent(_component_UISecondaryButton, {
          variant: "accent-color",
          icon: "arrow_left",
          reverse: true,
          onClick: ($event) => showLastAction.value = false,
          onKeydown: [($event) => showLastAction.value = false, ($event) => showLastAction.value = false]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Revenir au formulaire `);
            } else {
              return [
                createTextVNode(" Revenir au formulaire ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(`</div></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showLastAction)) {
        _push(`<div class="action" data-v-656121db><div class="action__illustration" data-v-656121db><img class="action__illustration__image"${ssrRenderAttr("src", unref(filesAndFolder))} alt="Avant de commencer" data-v-656121db></div><ul class="action__list" data-v-656121db><span class="action__list__title" data-v-656121db> Avant de partir...</span><span class="action__list__subtitle" data-v-656121db> Documents \xE0 joindre en annexe de votre pr\xE9-\xE9tat dat\xE9 </span><!--[-->`);
        ssrRenderList(annexes, (annexe) => {
          _push(`<li class="action__list__item" data-v-656121db>${ssrInterpolate(annexe)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GenerateurPED.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-656121db"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pre-etat-date",
  __ssrInlineRender: true,
  setup(__props) {
    const questions = [
      {
        title: "Combient co\xFBte le service de g\xE9n\xE9ration de Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Vous pouvez utiliser Supernotaire.fr pour cr\xE9er un Pr\xE9-\xE9tat dat\xE9 gratuitement (pour le moment). Habituellement, un Pr\xE9-\xE9tat dat\xE9 co\xFBte entre 150 et 300 euros lorsqu'il est r\xE9alis\xE9 par un professionnel."
      },
      {
        title: "Le Pr\xE9-\xE9tat dat\xE9 g\xE9n\xE9r\xE9 est-il conforme aux exigences l\xE9gales ?",
        answer: "Oui, le Pr\xE9-\xE9tat dat\xE9 g\xE9n\xE9r\xE9 sur Supernotaire est conforme aux exigences l\xE9gales en vigueur. Nous nous assurons que toutes les informations n\xE9cessaires sont incluses, mais il est toujours recommand\xE9 de faire v\xE9rifier le document par un professionnel avant de l'utiliser."
      },
      {
        title: "Quels documents dois-je fournir pour g\xE9n\xE9rer un Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Le Carnet d\u2019entretien de l\u2019immeuble, le dernier proc\xE8s-verbal d\u2019assembl\xE9e g\xE9n\xE9rale, l\u2019\xE9tat des impay\xE9s, et d\u2019autres documents list\xE9s dans le formulaire sont n\xE9cessaires pour g\xE9n\xE9rer un Pr\xE9-\xE9tat dat\xE9 complet et pr\xE9cis."
      },
      {
        title: "Puis-je modifier les informations avant de g\xE9n\xE9rer le Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Oui, vous pouvez revenir en arri\xE8re \xE0 tout moment pour modifier les informations saisies dans le formulaire avant de g\xE9n\xE9rer le Pr\xE9-\xE9tat dat\xE9. Assurez-vous que toutes les informations sont correctes et \xE0 jour avant de finaliser le document."
      },
      {
        title: "Le service de cr\xE9ation de Pr\xE9-\xE9tat dat\xE9 est-il s\xE9curis\xE9 ? ",
        answer: "Nous prenons la s\xE9curit\xE9 de vos donn\xE9es tr\xE8s au s\xE9rieux, c'est pourquoi aucune des informations et documents que vous fournissez ne sont stock\xE9s ni partag\xE9s \xE0 des tiers."
      },
      {
        title: "Comment sont utilis\xE9s les documents que je t\xE9l\xE9charge ?",
        answer: "Les documents que vous t\xE9l\xE9chargez sont utilis\xE9s uniquement pour extraire les informations n\xE9cessaires pour vous guider lors de la cr\xE9ation du Pr\xE9-\xE9tat dat\xE9. Ils sont supprim\xE9s imm\xE9diatement apr\xE8s le traitement."
      },
      {
        title: "\xC0 qui s'adresse ce service de g\xE9n\xE9ration de Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Ce service est destin\xE9 aux vendeurs de biens immobiliers, notaires, syndics de copropri\xE9t\xE9, et autres professionnels de l'immobilier qui ont besoin de g\xE9n\xE9rer rapidement et efficacement des Pr\xE9-\xE9tats dat\xE9s dans le cadre d'une vente immobili\xE8re."
      },
      {
        title: "Puis-je utiliser ce service pour plusieurs biens immobiliers ?",
        answer: "Oui, vous pouvez utiliser Supernotaire pour g\xE9n\xE9rer des Pr\xE9-\xE9tats dat\xE9s pour plusieurs biens immobiliers. Il vous suffit de remplir un nouveau formulaire pour chaque bien."
      },
      {
        title: "Combien de temps faut-il pour g\xE9n\xE9rer un Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Le processus de g\xE9n\xE9ration du Pr\xE9-\xE9tat dat\xE9 est g\xE9n\xE9ralement rapide et peut \xEAtre compl\xE9t\xE9 en quelques minutes, en fonction de la rapidit\xE9 avec laquelle vous fournissez les informations et documents n\xE9cessaires. Nous avons optimis\xE9 le processus pour vous faire gagner du temps gr\xE2ce \xE0 un syst\xE8me de suggestions intelligentes \xE0 partir des informations trouv\xE9es dans vos documents."
      },
      {
        title: "Quels documents joindre au Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Une fois le Pr\xE9-\xE9tat dat\xE9 g\xE9n\xE9r\xE9, vous devez y joindre plusieurs annexes au document: le dernier proc\xE8s-verbal d\u2019assembl\xE9e g\xE9n\xE9rale, l\u2019\xE9tat dat\xE9 des impay\xE9s, le montant du fonds travaux, le carnet d\u2019entretien de l\u2019immeuble, le diagnostic technique global (DTG) s\u2019il existe, le budget pr\xE9visionnel vot\xE9 et les comptes des deux derniers exercices, l\u2019\xE9tat des proc\xE9dures en cours contre la copropri\xE9t\xE9, la copie du r\xE8glement de copropri\xE9t\xE9 et \xE9tat descriptif de division \xE0 jour, ainsi que l\u2019attestation d\u2019assurance de l\u2019immeuble. "
      },
      {
        title: "Pourquoi ai-je besoin d'un Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Le Pr\xE9-\xE9tat dat\xE9 est un document essentiel dans le cadre de la vente d'un bien en copropri\xE9t\xE9. Il informe l'acheteur et le notaire sur la situation financi\xE8re et administrative de la copropri\xE9t\xE9, ce qui est crucial pour prendre une d\xE9cision \xE9clair\xE9e."
      },
      {
        title: "Pourquoi utiliser Supernotaire pour g\xE9n\xE9rer un Pr\xE9-\xE9tat dat\xE9 ?",
        answer: "Supernotaire simplifie et acc\xE9l\xE8re le processus de cr\xE9ation du Pr\xE9-\xE9tat dat\xE9 gr\xE2ce \xE0 son interface intuitive et ses fonctionnalit\xE9s intelligentes. Nous vous guidons pour que vous puissiez cr\xE9er votre document en toute simplicit\xE9.Vous gagnez du temps et r\xE9duisez les risques d'erreurs en utilisant notre service."
      }
    ];
    const jsonLDFAQ = questions.map((question) => {
      return {
        "@type": "Question",
        name: question.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: question.answer
        }
      };
    });
    useJsonld(() => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: jsonLDFAQ
    }));
    useHead({
      title: "Supernotaire | G\xE9n\xE9rateur de Pr\xE9-\xE9tat dat\xE9 gratuit",
      meta: [
        {
          name: "description",
          content: "Cr\xE9ez un Pr\xE9-\xE9tat dat\xE9 conforme \xE0 la r\xE9glementation en quelques minutes gr\xE2ce \xE0 notre g\xE9n\xE9rateur gratuit en ligne."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_GenerateurPED = __nuxt_component_1;
      const _component_FAQComponent = __nuxt_component_2;
      const _component_UIDidYouKnow = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UIPrimaryButton = __nuxt_component_1$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="pre-etat-date" class="pre-etat-date" data-v-8c81c492${_scopeId}><div class="pre-etat-date__headlines" data-v-8c81c492${_scopeId}><h1 class="pre-etat-date__headlines__title titles" data-v-8c81c492${_scopeId}> G\xE9n\xE9rateur de Pr\xE9-\xE9tat dat\xE9 gratuit </h1><span class="pre-etat-date__headlines__subtitle subtitles" data-v-8c81c492${_scopeId}>Remplissez le formulaire pour cr\xE9er rapidement un Pr\xE9-\xE9tat dat\xE9 valide </span></div></div>`);
            _push2(ssrRenderComponent(_component_GenerateurPED, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                id: "pre-etat-date",
                class: "pre-etat-date"
              }, [
                createVNode("div", { class: "pre-etat-date__headlines" }, [
                  createVNode("h1", { class: "pre-etat-date__headlines__title titles" }, " G\xE9n\xE9rateur de Pr\xE9-\xE9tat dat\xE9 gratuit "),
                  createVNode("span", { class: "pre-etat-date__headlines__subtitle subtitles" }, "Remplissez le formulaire pour cr\xE9er rapidement un Pr\xE9-\xE9tat dat\xE9 valide ")
                ])
              ]),
              createVNode(_component_GenerateurPED)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="faq" data-v-8c81c492${_scopeId}><div class="faq__headlines" data-v-8c81c492${_scopeId}><h2 class="titles" data-v-8c81c492${_scopeId}>Questions fr\xE9quentes sur le Pr\xE9-\xE9tat dat\xE9</h2><h3 class="subtitles" data-v-8c81c492${_scopeId}> Tarif, d\xE9lais, validit\xE9, documents \xE0 fournir, etc. </h3></div>`);
            _push2(ssrRenderComponent(_component_FAQComponent, { questions }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "faq" }, [
                createVNode("div", { class: "faq__headlines" }, [
                  createVNode("h2", { class: "titles" }, "Questions fr\xE9quentes sur le Pr\xE9-\xE9tat dat\xE9"),
                  createVNode("h3", { class: "subtitles" }, " Tarif, d\xE9lais, validit\xE9, documents \xE0 fournir, etc. ")
                ]),
                createVNode(_component_FAQComponent, { questions })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Container, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIDidYouKnow, { title: "Pas besoin du syndic, faites-le vous-m\xEAme !" }, {
              text: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Depuis le 1er janvier 2015, les syndics sont tenus de proposer aux copropri\xE9taires un acc\xE8s en ligne s\xE9curis\xE9 aux documents d\xE9mat\xE9rialis\xE9s relatifs \xE0 la gestion de l&#39;immeuble. Vous pouvez ainsi obtenir les informations requises pour \xE9tablir le pr\xE9-\xE9tat dat\xE9 sans passer par le syndic et le cr\xE9er vous-m\xEAme. `);
                } else {
                  return [
                    createTextVNode(" Depuis le 1er janvier 2015, les syndics sont tenus de proposer aux copropri\xE9taires un acc\xE8s en ligne s\xE9curis\xE9 aux documents d\xE9mat\xE9rialis\xE9s relatifs \xE0 la gestion de l'immeuble. Vous pouvez ainsi obtenir les informations requises pour \xE9tablir le pr\xE9-\xE9tat dat\xE9 sans passer par le syndic et le cr\xE9er vous-m\xEAme. ")
                  ];
                }
              }),
              cta: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/outils/pre-etat-date#pre-etat-date",
                    "aria-label": "Cr\xE9er mon pr\xE9-\xE9tat dat\xE9"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UIPrimaryButton, { variant: "accent-color" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cr\xE9er mon pr\xE9-\xE9tat dat\xE9`);
                            } else {
                              return [
                                createTextVNode("Cr\xE9er mon pr\xE9-\xE9tat dat\xE9")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                            default: withCtx(() => [
                              createTextVNode("Cr\xE9er mon pr\xE9-\xE9tat dat\xE9")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtLink, {
                      to: "/outils/pre-etat-date#pre-etat-date",
                      "aria-label": "Cr\xE9er mon pr\xE9-\xE9tat dat\xE9"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                          default: withCtx(() => [
                            createTextVNode("Cr\xE9er mon pr\xE9-\xE9tat dat\xE9")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIDidYouKnow, { title: "Pas besoin du syndic, faites-le vous-m\xEAme !" }, {
                text: withCtx(() => [
                  createTextVNode(" Depuis le 1er janvier 2015, les syndics sont tenus de proposer aux copropri\xE9taires un acc\xE8s en ligne s\xE9curis\xE9 aux documents d\xE9mat\xE9rialis\xE9s relatifs \xE0 la gestion de l'immeuble. Vous pouvez ainsi obtenir les informations requises pour \xE9tablir le pr\xE9-\xE9tat dat\xE9 sans passer par le syndic et le cr\xE9er vous-m\xEAme. ")
                ]),
                cta: withCtx(() => [
                  createVNode(_component_NuxtLink, {
                    to: "/outils/pre-etat-date#pre-etat-date",
                    "aria-label": "Cr\xE9er mon pr\xE9-\xE9tat dat\xE9"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIPrimaryButton, { variant: "accent-color" }, {
                        default: withCtx(() => [
                          createTextVNode("Cr\xE9er mon pr\xE9-\xE9tat dat\xE9")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/outils/pre-etat-date.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const preEtatDate = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8c81c492"]]);

export { preEtatDate as default };
//# sourceMappingURL=pre-etat-date-3m0J-m9o.mjs.map
