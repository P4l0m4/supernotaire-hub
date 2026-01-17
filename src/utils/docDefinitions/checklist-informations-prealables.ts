import type { ChecklistInformationsPrealables } from "../../types/checklist-informations-prealables";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistInformationsPrealables,
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

  addInfo(
    "Maison vendue avec un terrain",
    data.maison?.vendue_avec_terrain,
    data.type_bien === "Maison"
  );
  addInfo(
    "Nature du terrain",
    data.maison?.nature_terrain,
    data.type_bien === "Maison" && data.maison?.vendue_avec_terrain === true
  );
  addInfo(
    "Maison sur domaine public avec titre d'occupation",
    data.maison?.edifiee_domaine_public,
    data.type_bien === "Maison"
  );
  addDoc(
    "Titre d'occupation du domaine public",
    data.type_bien === "Maison" && data.maison?.edifiee_domaine_public === true
  );

  const infoBody = [
    ["Questions", "Réponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];

  return buildChecklistPdfStructure({
    title: "Informations préalables",
    subtitle: "Type de bien et informations associées",
    infoTitle: "Informations fournies",
    docsTitle: "Documents à joindre",
    metadataTitle: "",
    generatedOnLabel: "Généré le",
    emptyDocsText: "Aucun document supplémentaire.",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs: Array.from(docsSet),
    logoBase64,
  });
}
