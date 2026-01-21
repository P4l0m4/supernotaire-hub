import type { ChecklistDiagnosticsTravauxInterieurs } from "@/types/checklist-diagnostics-travaux-interieurs";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistDiagnosticsTravauxInterieurs,
  logoBase64: string,
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

  const parseYear = (input?: string | number): number | null => {
    if (input == null) return null;
    if (typeof input === "number") return input;
    const str = String(input).trim();
    const yearMatch = str.match(/(\d{4})/);
    if (yearMatch?.[1]) return Number(yearMatch[1]);
    const parsed = Date.parse(str);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const diagnostics = data.diagnostics ?? {};
  const constructionYear = parseYear(diagnostics.dateConstruction);
  const before1949 = constructionYear != null && constructionYear < 1949;
  const before1997 = constructionYear != null && constructionYear < 1997;
  const before2008 = constructionYear != null && constructionYear < 2008;

  addInfo("Bien raccordé au tout-à-l'égout", diagnostics.raccordToutALegout);
  addInfo(
    "Date du diagnostic assainissement",
    diagnostics.dateDiagAssainissement,
    diagnostics.raccordToutALegout === true,
  );
  addDoc("Diagnostic assainissement", diagnostics.raccordToutALegout === true);

  addInfo("En zone termites", diagnostics.zoneTermites);
  addInfo(
    "Date du diagnostic termites",
    diagnostics.dateDiagTermites,
    diagnostics.zoneTermites === true,
  );
  addDoc("Diagnostic termites", diagnostics.zoneTermites === true);

  addInfo("En zone à risques (ERP)", diagnostics.zoneRisques);
  addInfo(
    "Date du diagnostic ERP",
    diagnostics.dateErp,
    diagnostics.zoneRisques === true,
  );
  addDoc(
    "ERP - État des Risques et Pollutions",
    diagnostics.zoneRisques === true,
  );

  addInfo("Date de construction", diagnostics.dateConstruction);

  addInfo(
    "Date du diagnostic plomb (CREP)",
    diagnostics.dateCrepPlomb,
    before1949,
  );
  addDoc("Diagnostic plomb (CREP)", before1949);

  addInfo(
    "Date du diagnostic amiante (DTA)",
    diagnostics.dateAmiante,
    before1997,
  );
  addDoc("Diagnostic amiante", before1997);

  addInfo(
    "Installation gaz en place depuis plus de 15 ans",
    diagnostics.installationGaz15Ans,
    before2008,
  );
  addInfo(
    "Date du diagnostic gaz",
    diagnostics.dateDiagnosticGaz,
    diagnostics.installationGaz15Ans === "Oui",
  );
  addDoc("Diagnostic gaz", diagnostics.installationGaz15Ans === "Oui");

  addInfo(
    "Installation électrique de plus de 15 ans",
    diagnostics.installationElec15Ans,
    before2008,
  );
  addInfo(
    "Date du diagnostic électricité",
    diagnostics.dateDiagnosticElectricite,
    diagnostics.installationElec15Ans === "Oui",
  );
  addDoc("Diagnostic électricité", diagnostics.installationElec15Ans === "Oui");
  addInfo("Date du DPE", diagnostics.dateDpe, Boolean(diagnostics.dateDpe));
  addDoc("DPE - Diagnostic de performance énergétique", true);

  const travaux = data.travaux ?? {};
  const natureTravaux = travaux.nature || [];
  const hasStructureLike =
    Array.isArray(natureTravaux) &&
    natureTravaux.some((v) =>
      [
        "structure_gros_oeuvre",
        "distribution_interieure",
        "reseaux_techniques",
        "locaux_techniques",
        "confort_equipement",
      ].includes(v),
    );

  addInfo("Travaux realises dans le bien", travaux.realises);
  addInfo("Nature des travaux", natureTravaux, travaux.realises === "Oui");
  addInfo(
    "Travaux realises par",
    travaux.realisesPar,
    travaux.realises === "Oui" && hasStructureLike,
  );

  addDoc(
    "Justificatifs (devis, factures, assurance, etc.)",
    travaux.realisesPar === "Un professionnel",
  );
  addDoc(
    "Assurance decennale (si disponible)",
    travaux.realisesPar === "Un professionnel",
  );

  const docs = Array.from(docsSet);
  const infoBody = [
    ["Questions", "Reponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];
  const docsTitle =
    docs.length === 0
      ? "Aucun document à joindre pour cette rubrique"
      : "Transmettez ces documents à votre notaire";

  return buildChecklistPdfStructure({
    title: "Diagnostics & Travaux intérieurs",
    subtitle: "Documents et informations à fournir à votre notaire",
    infoTitle: "Informations fournies",
    docsTitle: docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Généré le",
    emptyDocsText: "Aucun document supplémentaire.",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
