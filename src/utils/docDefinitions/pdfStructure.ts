type TableCell =
  | string
  | {
      text: string;
      [key: string]: unknown;
    };

export interface ChecklistPdfStructureOptions {
  title: string;
  subtitle: string;
  infoTitle: string;
  docsTitle: string;
  metadataTitle: string;
  generatedOnLabel: string;
  emptyDocsText: string;
  note: string;
  infoBody: TableCell[][];
  docs: string[];
  logoBase64: string;
}

export const buildChecklistPdfStructure = ({
  title,
  subtitle,
  infoTitle,
  docsTitle,
  metadataTitle,
  generatedOnLabel,
  emptyDocsText,
  note,
  infoBody,
  docs,
  logoBase64,
}: ChecklistPdfStructureOptions) => {
  const headerCellStyle = {
    fillColor: "#f5f7fa",
    color: "#111827",
    bold: true,
  };

  const tableLayout = {
    fillColor: (rowIndex: number) => (rowIndex === 0 ? "#f5f7fa" : undefined),
    hLineWidth: () => 1,
    vLineWidth: () => 1,
    hLineColor: () => "#d0d5dd",
    vLineColor: () => "#d0d5dd",
    paddingLeft: () => 12,
    paddingRight: () => 12,
    paddingTop: () => 6,
    paddingBottom: () => 6,
  };

  const infoTableBody = infoBody.map((row, rowIndex) =>
    row.map((cell) => {
      if (rowIndex !== 0) return cell;
      if (typeof cell === "string") {
        return { text: cell, ...headerCellStyle };
      }
      return { ...cell, ...headerCellStyle };
    })
  );

  const docsTableBody: TableCell[][] = docs.length
    ? [
        [
          { text: "", ...headerCellStyle },
          {
            text: "Transmettez ces documents à votre notaire",
            ...headerCellStyle,
          },
          { text: "Observations", ...headerCellStyle },
        ],
        ...docs.map((doc) => [{ text: "" }, { text: doc }, { text: "" }]),
      ]
    : [
        [
          { text: "", ...headerCellStyle },
          {
            text: "Transmettez ces documents à votre notaire",
            ...headerCellStyle,
          },
          { text: "Observations", ...headerCellStyle },
        ],
        [{ text: "" }, { text: emptyDocsText }, { text: "" }],
      ];

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoEasyCase: logoBase64,
    },
    content: [
      {
        text: title,
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: subtitle,
        italics: true,
        margin: [0, 0, 0, 16],
      },
      { text: infoTitle, style: "h2" },
      {
        table: {
          widths: ["*", "*"],
          body: infoTableBody,
        },
        layout: tableLayout,
        margin: [0, 0, 0, 24],
      },
      { text: docsTitle, style: "h2" },
      {
        table: {
          widths: ["auto", "*", "30%"],
          body: docsTableBody,
        },
        layout: tableLayout,
        margin: [0, 0, 0, 24],
      },
      { text: metadataTitle, style: "h3" },
      {
        table: {
          widths: ["auto", "*"],
          body: [
            [
              { text: generatedOnLabel, noWrap: true },
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
        text: note,
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
            text: "Créé en quelques secondes sur easycase.fr, conçu pour les notaires débordés et les vendeurs pressés.",
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
};
