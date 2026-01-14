import type { ChecklistDiagnosticsTravauxInterieurs } from "@/types/checklist-diagnostics-travaux-interieurs";

const val = (v: unknown) => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (Array.isArray(v)) return v.map((x) => val(x)).join(", ");
  if (v && typeof v === "object") {
    const anyVal = v as Record<string, unknown>;
    if (typeof anyVal.label === "string") return anyVal.label;
    if (typeof anyVal.value === "string") return anyVal.value;
    return "-";
  }
  return v == null || v === "" ? "-" : String(v);
};

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
  addDoc(
    "Diagnostic assainissement",
    diagnostics.raccordToutALegout === true
  );

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
  addDoc(
    "Diagnostic plomb (CREP)",
    diagnostics.construitAvant1949 === true
  );

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
  addDoc(
    "Diagnostic électricité",
    diagnostics.installationElec15Ans === true
  );

  addInfo("Date du DPE", diagnostics.dateDpe);
  addDoc("DPE – Diagnostic de performance énergétique", true);

  const travaux = data.travaux ?? {};
  addInfo(
    "Travaux réalisés dans le bien",
    travaux.realises === true ? "Oui" : travaux.realises === false ? "Non" : "-"
  );
  addInfo("Nature des travaux", travaux.nature, travaux.realises === true);
  addInfo("Travaux réalisés par", travaux.realisesPar, travaux.realises === true);

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
    ["Information", "Réponse"],
    ...(infoRows.length ? infoRows : [["Informations", "-"]]),
  ];

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoSupernotaire: logoBase64,
    },
    content: [
      {
        text: "Diagnostics & Travaux intérieurs",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: "Documents et informations à fournir à votre notaire",
        italics: true,
        margin: [0, 0, 0, 16],
      },
      { text: "Informations à fournir", style: "h2" },
      {
        table: {
          widths: ["*", "*"],
          body: infoBody,
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },
      { text: "Documents à fournir", style: "h2" },
      docs.length
        ? {
            ul: docs.map((doc) => `• ${doc}`),
            margin: [0, 0, 0, 24],
          }
        : { text: "Aucun document supplémentaire.", margin: [0, 0, 0, 24] },
      { text: "Métadonnées", style: "h3" },
      {
        table: {
          widths: ["auto", "*"],
          body: [
            [
              { text: "Généré le", noWrap: true },
              {
                text: new Date().toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }),
                noWrap: true,
              },
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },
      {
        text: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
        italics: true,
        margin: [0, 8, 0, 0],
      },
    ],
    styles: {
      h1: { fontSize: 18, bold: true },
      h2: { fontSize: 14, bold: true, margin: [0, 10, 0, 6] },
      h3: { fontSize: 12, bold: true, margin: [0, 6, 0, 4] },
    },
    footer: (currentPage: number, pageCount: number) => {
      return {
        columns: [
          {
            image: "logoSupernotaire",
            width: 20,
            margin: [0, 2, 10, 0],
          },
          {
            text: "Créé sur Supernotaire.fr, la plateforme qui facilite les ventes immobilières.",
            alignment: "left",
            margin: [0, 0, 0, 0],
            fontSize: 10,
            color: "#22262e",
          },
          {
            text: `${currentPage}/${pageCount}`,
            alignment: "right",
            margin: [0, 10, 16, 0],
            fontSize: 9,
          },
        ],
        columnGap: 8,
        margin: [24, 24, 24, 24],
      };
    },
  };
}
