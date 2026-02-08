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
    diagnostics.raccordToutALegout === "Oui",
  );
  addDoc("Diagnostic assainissement", diagnostics.raccordToutALegout === "Oui");

  addInfo("En zone termites", diagnostics.zoneTermites);
  addInfo(
    "Date du diagnostic termites",
    diagnostics.dateDiagTermites,
    diagnostics.zoneTermites === "Oui",
  );
  addDoc("Diagnostic termites", diagnostics.zoneTermites === "Oui");

  addInfo("En zone à risques (ERP)", diagnostics.zoneRisques);
  addInfo(
    "Date du diagnostic ERP",
    diagnostics.dateErp,
    diagnostics.zoneRisques === "Oui",
  );
  addDoc(
    "ERP - État des Risques et Pollutions",
    diagnostics.zoneRisques === "Oui",
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
    "Date du dernier diagnostic électricité",
    diagnostics.dateDiagnosticElectricite,
    diagnostics.installationElec15Ans === "Oui",
  );
  addDoc("Diagnostic électricité", diagnostics.installationElec15Ans === "Oui");
  addInfo("Date du DPE", diagnostics.dateDpe, Boolean(diagnostics.dateDpe));
  addDoc("DPE - Diagnostic de performance énergétique", true);

  const travaux = data.travaux ?? {};
  const natureLabels: Record<string, string> = {
    structure_gros_oeuvre:
      "La structure ou le gros œuvre (toiture, murs porteurs, planchers, etc.)",
    distribution_interieure:
      "La distribution intérieure (cloisons non porteuses, nombre de pièces)",
    reseaux_techniques:
      "Les réseaux techniques (électricité, chauffage, gaz, VMC, plomberie, etc.)",
    locaux_techniques: "Les locaux techniques (salle de bain, cuisine, etc.)",
    confort_equipement:
      "Le confort et/ou l’équipement (climatisation, cheminée, domotique, rangements intégrés, etc.)",
    entretien_embellissement: "Entretien et/ou embellissement",
  };
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
  const realisesParValues = Array.isArray(travaux.realisesPar)
    ? travaux.realisesPar
    : [];
  const realisesParLabels = realisesParValues.map((v) =>
    v === "professionnel" ? "Un professionnel" : "Le vendeur lui-même",
  );
  const realisesParByPro = realisesParValues.includes("professionnel");

  addInfo("Travaux réalisés dans le bien", travaux.realises);
  addInfo(
    "Nature des travaux",
    natureTravaux.map((v: any) => natureLabels[v as string] || v),
    travaux.realises === "Oui",
  );
  addInfo(
    "Travaux réalisés par",
    realisesParLabels,
    travaux.realises === "Oui" && hasStructureLike,
  );

  addDoc(
    "Justificatifs (devis, factures, assurance, etc.)",
    realisesParByPro,
  );
  addDoc(
    "Assurance décennale (si disponible)",
    realisesParByPro,
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
