import type { ChecklistChargesTaxes } from "@/types/checklist-charges-taxes";
import { formatChecklistValue as val } from "./formatters";
import {
  buildChecklistPdfStructure,
  buildKeyValueSubTable,
} from "./pdfStructure";
import type { TableCell } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistChargesTaxes,
  logoBase64: string,
) {
  if (!data) return;

  const infoRows: TableCell[][] = [];
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
    "Précision chauffage",
    data.type_chauffage_autre,
    data.type_chauffage === "Autre",
  );
  addInfo(
    "Date du dernier entretien du chauffage",
    data.date_entretien_chauffage,
  );
  addInfo("Date du dernier ramonage", data.date_ramonage);

  addInfo("Mode d'assainissement", data.mode_assainissement);
  addInfo("Situation d'occupation fiscale", data.situation_fiscale);
  addInfo("Montant annuel de la taxe foncière", data.montant_taxe_fonciere);
  addInfo(
    "Montant annuel de la dernière taxe d'habitation",
    data.montant_derniere_taxe_habitation,
  );
  addInfo(
    "Présence d'une TEOM",
    data.presence_teom,
    data.presence_teom !== undefined,
  );
  addInfo(
    "Bien soumis à la taxe d'habitation",
    data.bien_soumis_taxe_habitation,
    data.bien_soumis_taxe_habitation !== undefined,
  );
  addInfo(
    "Prêt immobilier en cours sur le bien",
    data.pret_immobilier_en_cours,
    data.pret_immobilier_en_cours !== undefined,
  );
  addInfo(
    "Nom de la banque",
    data.nom_banque,
    data.pret_immobilier_en_cours === "Oui",
  );
  addInfo(
    "Date de la dernière échéance",
    data.date_derniere_echeance,
    data.pret_immobilier_en_cours === "Oui",
  );

  const coordonnees = Array.isArray(data.coordonnees_bancaires_beneficiaires)
    ? data.coordonnees_bancaires_beneficiaires
    : [];

  coordonnees.forEach((beneficiaire, index) => {
    const label = `Beneficiaire ${index + 1}`;
    const rows: Array<[string, TableCell]> = [
      ["Rôle", val(beneficiaire.role_beneficiaire)],
      [
        "Perçoit une commission",
        val(beneficiaire.beneficiaire_percoit_commission),
      ],
    ];
    if (beneficiaire.beneficiaire_percoit_commission === "Oui") {
      rows.push([
        "Montant de la commission",
        val(beneficiaire.montant_commission),
      ]);
    }
    infoRows.push([label, buildKeyValueSubTable(rows)]);
    addDoc(`RIB du beneficiaire ${index + 1}`);
  });

  // Documents
  addDoc(
    "Dernière attestation d'entretien du chauffage",
    Boolean(data.type_chauffage),
  );
  addDoc(
    "Rapport de diagnostic assainissement non collectif (en cours de validité)",
    data.mode_assainissement === "Individuel",
  );
  addDoc("Dernier avis de taxe foncière");
  addDoc(
    "Dernier avis de taxe d'habitation",
    data.bien_soumis_taxe_habitation === "Oui",
  );
  addDoc(
    "Montant annuel de la dernière taxe d'habitation (si applicable)",
    data.bien_soumis_taxe_habitation === "Non",
  );
  addDoc("Décompte de prêt", data.pret_immobilier_en_cours === "Oui");

  const infoBody = [
    ["Questions", "Réponses"],
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
    generatedOnLabel: "Généré le",
    emptyDocsText: "",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
