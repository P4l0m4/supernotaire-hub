import type { ChecklistDiagnosticsTravauxInterieurs } from "@/types/checklist-diagnostics-travaux-interieurs";
import { formatChecklistValue as val } from "@/utils/docDefinitions/formatters";
import { buildChecklistPdfStructure } from "@/utils/docDefinitions/pdfStructure";
export function buildDocDefinition(
  data: ChecklistDiagnosticsTravauxInterieurs,
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

  const diagnostics = data.diagnostics ?? {};
  addInfo(
    "Le bien est raccordé au tout-à-l’égout",
    diagnostics.raccordToutALegout
  );
  addInfo(
    "Date du diagnostic assainissement",
    diagnostics.dateDiagAssainissement,
    diagnostics.raccordToutALegout === true
  );
  addDoc("Diagnostic assainissement", diagnostics.raccordToutALegout === true);

  addInfo(
    "Le bien est en zone termites",
    diagnostics.zoneTermites,
    diagnostics.zoneTermites !== undefined
  );
  addInfo(
    "Date du diagnostic termites",
    diagnostics.dateDiagTermites,
    diagnostics.zoneTermites === true
  );
  addDoc("Diagnostic termites", diagnostics.zoneTermites === true);

  addInfo(
    "Le bien est en zone à risques (ERP)",
    diagnostics.zoneRisques,
    diagnostics.zoneRisques !== undefined
  );
  addInfo(
    "Date du diagnostic ERP",
    diagnostics.dateErp,
    diagnostics.zoneRisques === true
  );
  addDoc(
    "ERP – État des Risques et Pollutions",
    diagnostics.zoneRisques === true
  );

  addInfo("Date de construction", diagnostics.dateConstruction);

  addInfo(
    "Construit avant 1949",
    diagnostics.construitAvant1949,
    diagnostics.construitAvant1949 !== undefined
  );
  addInfo(
    "Date du diagnostic plomb (CREP)",
    diagnostics.dateCrepPlomb,
    diagnostics.construitAvant1949 === true
  );
  addDoc("Diagnostic plomb (CREP)", diagnostics.construitAvant1949 === true);

  addInfo(
    "Construit avant juillet 1997",
    diagnostics.construitAvantJuillet1997,
    diagnostics.construitAvantJuillet1997 !== undefined
  );
  addInfo(
    "Date du diagnostic amiante",
    diagnostics.dateAmiante,
    diagnostics.construitAvantJuillet1997 === true
  );
  addDoc("Diagnostic amiante", diagnostics.construitAvantJuillet1997 === true);

  addInfo(
    "Installation gaz de plus de 15 ans",
    diagnostics.installationGaz15Ans,
    diagnostics.installationGaz15Ans !== undefined
  );
  addInfo(
    "Date du diagnostic gaz",
    diagnostics.dateDiagnosticGaz,
    diagnostics.installationGaz15Ans === true
  );
  addDoc("Diagnostic gaz", diagnostics.installationGaz15Ans === true);

  addInfo(
    "Installation électrique de plus de 15 ans",
    diagnostics.installationElec15Ans,
    diagnostics.installationElec15Ans !== undefined
  );
  addInfo(
    "Date du diagnostic électricité",
    diagnostics.dateDiagnosticElectricite,
    diagnostics.installationElec15Ans === true
  );
  addDoc("Diagnostic électricité", diagnostics.installationElec15Ans === true);

  addInfo("Date du DPE", diagnostics.dateDpe);
  addDoc("DPE – Diagnostic de performance énergétique", true);

  const travaux = data.travaux ?? {};
  addInfo(
    "Travaux réalisés dans le bien",
    travaux.realises === true ? "Oui" : travaux.realises === false ? "Non" : "-"
  );
  addInfo("Nature des travaux", travaux.nature, travaux.realises === true);
  addInfo(
    "Travaux réalisés par",
    travaux.realisesPar,
    travaux.realises === true
  );

  addDoc(
    "Justificatifs (devis, factures, assurance, etc.) (si disponible)",
    travaux.realisesPar === "Un professionnel"
  );
  addDoc(
    "Assurance décennale (si disponible)",
    travaux.realisesPar === "Un professionnel"
  );

  const docs = Array.from(docsSet);
  const infoBody = [
    ["Information", "Reponse"],
    ...(infoRows.length ? infoRows : [["Informations", "-"]]),
  ];

  return buildChecklistPdfStructure({
    title: "Diagnostics & Travaux interieurs",
    subtitle: "Documents et informations a fournir a votre notaire",
    infoTitle: "Informations a fournir",
    docsTitle: "Documents a fournir",
    metadataTitle: "Metadonnees",
    generatedOnLabel: "Genere le",
    emptyDocsText: "Aucun document supplementaire.",
    note: "Checklist indicative, sous reserve de demandes specifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}


