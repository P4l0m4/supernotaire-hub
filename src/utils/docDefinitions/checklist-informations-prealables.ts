import type { ChecklistInformationsPrealables } from "../../types/checklist-informations-prealables";
import type { Adresse } from "@/types/adresse";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

const adresseLabel = (adresse?: Adresse) => adresse?.properties?.label;

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

  addInfo("Adresse du bien", adresseLabel(data.adresse_bien));
  addInfo("Type de bien", data.type_bien);

  addInfo(
    "Maison vendue avec un terrain",
    data.maison?.vendue_avec_terrain,
    data.type_bien === "Maison"
  );
  addInfo(
    "Nature du terrain",
    data.maison?.nature_terrain,
    data.type_bien === "Maison" && data.maison?.vendue_avec_terrain === "Oui"
  );
  addInfo(
    "Maison sur domaine public avec titre d'occupation",
    data.maison?.edifiee_domaine_public,
    data.type_bien === "Maison"
  );
  addDoc(
    "Titre d'occupation du domaine public",
    data.type_bien === "Maison" && data.maison?.edifiee_domaine_public === "Oui"
  );

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
    title: "Informations préalables",
    subtitle: "Type de bien et informations associées",
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
