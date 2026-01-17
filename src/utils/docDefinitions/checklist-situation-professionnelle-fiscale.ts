import type { ChecklistSituationProfessionnelleFiscale } from "@/types/checklist-situation-professionnelle-fiscale";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistSituationProfessionnelleFiscale,
  logoBase64: string
) {
  if (!data) return;

  const docsSet = new Set<string>();
  const infoRows: Array<[string, string]> = [];

  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docsSet.add(label);
  };

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    infoRows.push([label, val(value)]);
  };

  const situation = data.situation_pro_fiscale ?? {};
  addInfo("Lieu d'imposition", situation.lieu_imposition);
  addInfo("Numéro fiscal", situation.numero_fiscal);
  addInfo("Profession", situation.profession);
  addInfo("Employeur", situation.employeur);
  addInfo("Assujetti(e) à ISF/IFI", situation.assujetti_isf_ifi);
  addInfo(
    "Non résident fiscal français",
    situation.non_resident_fiscal_francais
  );
  addInfo(
    "Pays de résidence fiscale",
    situation.residence_fiscale?.pays,
    situation.non_resident_fiscal_francais === true
  );
  addInfo(
    "NIF étranger (Tax Identification Number)",
    situation.residence_fiscale?.nif_etranger,
    situation.non_resident_fiscal_francais === true
  );

  addDoc("Dernier avis d'impôt sur le revenu");
  addDoc("Dernier avis d'IFI", situation.assujetti_isf_ifi === true);
  addDoc(
    "Certificat de résidence fiscale",
    situation.non_resident_fiscal_francais === true
  );

  const docs = Array.from(docsSet);
  const infoBody = [
    ["Questions", "Réponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];

  const docsTitle =
    docs.length === 0
      ? "Aucun document à joindre pour cette rubrique"
      : "Transmettez ces documents à votre notaire";

  return buildChecklistPdfStructure({
    title: "Situation professionnelle & fiscale",
    subtitle: "Emploi, revenus et fiscalité",
    infoTitle: "Informations fournies",
    docsTitle: docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Généré le",
    emptyDocsText: "",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs: Array.from(docs),
    logoBase64,
  });
}
