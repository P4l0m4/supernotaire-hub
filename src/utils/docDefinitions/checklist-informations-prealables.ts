import type { ChecklistInformationsPrealables } from "@/types/checklist-informations-prealables";

const val = (v: unknown) => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (v == null || v === "") return "-";
  return String(v);
};

export function buildDocDefinition(
  data: ChecklistInformationsPrealables,
  logoBase64: string
) {
  if (!data) return;

  const rows: Array<[string, string]> = [];
  const docs: string[] = [];

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    rows.push([label, val(value)]);
  };
  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docs.push(label);
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
    ["Information", "Réponse"],
    ...(rows.length ? rows : [["Informations", "-"]]),
  ];

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoSupernotaire: logoBase64,
    },
    content: [
      {
        text: "Informations préalables",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: "Type de bien et informations associées",
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
        ? { ul: docs.map((doc) => `${doc}`), margin: [0, 0, 0, 24] }
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
