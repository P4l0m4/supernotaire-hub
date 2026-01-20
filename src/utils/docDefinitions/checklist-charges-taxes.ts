import type { ChecklistChargesTaxes } from "@/types/checklist-charges-taxes";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistChargesTaxes,
  logoBase64: string
) {
  if (!data) return;

  const infoRows: Array<[string, string]> = [];
  const docsSet = new Set<string>();

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    infoRows.push([label, val(value)]);
  };
  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docsSet.add(label);
  };

  addInfo("Type de bien", data.type_bien);
  addInfo("Type de chauffage", data.type_chauffage);
  addInfo(
    "Precision chauffage",
    data.type_chauffage_autre,
    data.type_chauffage === "Autre"
  );
  addInfo(
    "Date du dernier entretien du chauffage",
    data.date_entretien_chauffage
  );
  addInfo("Date du dernier ramonage", data.date_ramonage);

  addInfo("Mode d'assainissement", data.mode_assainissement);
  addInfo("Situation d'occupation fiscale", data.situation_fiscale);
  addInfo("Montant annuel de la taxe fonciere", data.montant_taxe_fonciere);
  addInfo(
    "Montant annuel de la derniere taxe d'habitation",
    data.montant_derniere_taxe_habitation
  );
  addInfo(
    "Presence d'une TEOM",
    data.presence_teom,
    data.presence_teom !== undefined
  );
  addInfo(
    "Bien soumis a la taxe d'habitation",
    data.bien_soumis_taxe_habitation,
    data.bien_soumis_taxe_habitation !== undefined
  );
  addInfo(
    "Pret immobilier en cours sur le bien",
    data.pret_immobilier_en_cours,
    data.pret_immobilier_en_cours !== undefined
  );
  addInfo("Nom de la banque", data.nom_banque, data.pret_immobilier_en_cours === "Oui");
  addInfo("Numero du pret", data.numero_pret, data.pret_immobilier_en_cours === "Oui");
  addInfo(
    "Date de la derniere echeance",
    data.date_derniere_echeance,
    data.pret_immobilier_en_cours === "Oui"
  );

  const coordonnees = Array.isArray(data.coordonnees_bancaires_beneficiaires)
    ? data.coordonnees_bancaires_beneficiaires
    : [];

  coordonnees.forEach((beneficiaire, index) => {
    const label = `Beneficiaire ${index + 1}`;
    addInfo(`${label} - Role`, beneficiaire.role_beneficiaire);
    addInfo(
      `${label} - Percoit une commission`,
      beneficiaire.beneficiaire_percoit_commission,
      beneficiaire.beneficiaire_percoit_commission !== undefined
    );
    addInfo(
      `${label} - Montant de la commission`,
      beneficiaire.montant_commission,
      beneficiaire.beneficiaire_percoit_commission === "Oui"
    );
    addDoc(`RIB du beneficiaire ${index + 1}`);
  });

  // Documents
  addDoc(
    "Derniere attestation d'entretien du chauffage",
    Boolean(data.type_chauffage)
  );
  addDoc(
    "Rapport de diagnostic assainissement non collectif (en cours de validite)",
    data.mode_assainissement === "Individuel"
  );
  addDoc("Dernier avis de taxe fonciere");
  addDoc(
    "Dernier avis de taxe d'habitation",
    data.bien_soumis_taxe_habitation === true
  );
  addDoc(
    "Montant annuel de la derniere taxe d'habitation (si applicable)",
    data.bien_soumis_taxe_habitation === false
  );
  addDoc(
    "Decompte de pret",
    data.pret_immobilier_en_cours === "Oui"
  );

  const infoBody = [
    ["Questions", "Reponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];

  const docs = Array.from(docsSet);
  const docsTitle =
    docs.length === 0
      ? "Aucun document à joindre pour cette rubrique"
      : "Transmettez ces documents à votre notaire";

  return buildChecklistPdfStructure({
    title: "Charges & Taxes",
    subtitle: "Chauffage, assainissement et situation fiscale",
    infoTitle: "Informations fournies",
    docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Genere le",
    emptyDocsText: "",
    note: "Checklist indicative, sous reserve de demandes specifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
