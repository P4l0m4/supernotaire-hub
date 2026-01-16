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

  const infoBody = [
    ["Information", "Reponse"],
    ...(infoRows.length ? infoRows : [["Informations", "-"]]),
  ];

  return buildChecklistPdfStructure({
    title: "Charges & Taxes",
    subtitle: "Chauffage, assainissement et situation fiscale",
    infoTitle: "Informations a fournir",
    docsTitle: "Documents a fournir",
    metadataTitle: "Metadonnees",
    generatedOnLabel: "Genere le",
    emptyDocsText: "Aucun document supplementaire.",
    note: "Checklist indicative, sous reserve de demandes specifiques du notaire.",
    infoBody,
    docs: Array.from(docsSet),
    logoBase64,
  });
}
