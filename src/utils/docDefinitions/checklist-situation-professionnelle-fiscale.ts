import type { ChecklistSituationProfessionnelleFiscale } from "@/types/checklist-situation-professionnelle-fiscale";

const val = (v: unknown) => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (v && typeof v === "object") {
    const anyVal = v as Record<string, unknown>;
    if (typeof anyVal.label === "string") return anyVal.label;
    if (typeof anyVal.value === "string") return anyVal.value;
    return "-";
  }
  return v == null || v === "" ? "-" : String(v);
};

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
    ["Information", "Réponse"],
    ...(infoRows.length ? infoRows : [["Informations", "-"]]),
  ];

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoEasyCase: logoBase64,
    },
    content: [
      {
        text: "Situation professionnelle & Fiscale",
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
            ul: docs.map((doc) => `${doc}`),
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
            image: "logoEasyCase",
            width: 20,
            margin: [0, 2, 10, 0],
          },
          {
            text: "Créé sur easycase.fr, la plateforme qui facilite les ventes immobilières.",
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
