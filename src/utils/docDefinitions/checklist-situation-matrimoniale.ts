import type { ChecklistSituationMatrimoniale } from "@/utils/types/checklist-situation-matrimoniale";

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
  data: ChecklistSituationMatrimoniale,
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

  const situation = data.situation_matrimoniale ?? {};
  addInfo("Situation matrimoniale", situation.statut);

  if (situation.statut === "Célibataire / Concubin(e) / Union libre") {
    addInfo("Nationalité étrangère", situation.celibataire?.etranger);
    addDoc("Certificat de célibat", situation.celibataire?.etranger === true);
    addDoc("Certificat de coutume", situation.celibataire?.etranger === false);
  }

  if (situation.statut === "Marié(e) (communauté)") {
    addDoc("Copie intégrale de l'acte de mariage < 3 mois");
    addDoc("Pièce d'identité du conjoint (CNI, titre de séjour ou passeport)");
    addDoc("Livret de famille");
  }

  if (situation.statut === "Marié(e) (contrat spécifique)") {
    addDoc("Copie intégrale de l'acte de mariage < 3 mois");
    addDoc("Copie authentique du contrat de mariage");
    addDoc("Livret de famille");
    addDoc("Pièce d'identité du conjoint (CNI, titre de séjour ou passeport)");
  }

  if (situation.statut === "Pacsé") {
    addDoc("Attestation d'enregistrement PACS");
    addDoc("Pièce d'identité du conjoint (CNI, titre de séjour ou passeport)");
    addDoc("Convention de PACS");
  }

  if (situation.statut === "Divorcé(e) (non remarié(e))") {
    addDoc("Jugement de divorce définitif avec certificat de non-appel");
    addDoc(
      "Extrait ou copie intégrale de l'acte de mariage mis à jour"
    );
  }

  if (situation.statut === "Dissolution PACS") {
    addDoc(
      "Ordonnance de dissolution avec formule exécutoire avec certificat de non-appel"
    );
    addDoc("Attestation d'enregistrement de dissolution");
  }

  if (situation.statut === "Veuf / Veuve") {
    addDoc("Acte de décès du conjoint");
    addDoc("Extrait d'acte de mariage portant la mention du décès");
  }

  if (situation.statut === "Séparé de corps") {
    addInfo("Contrat de mariage", situation.separe_de_corps?.contrat_mariage);
    addDoc("Jugement de séparation de corps exécutoire");
    addDoc(
      "Copie authentique du contrat de mariage",
      situation.separe_de_corps?.contrat_mariage === true
    );
  }

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
        text: "Checklist dossier de vente - Situation matrimoniale",
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
            ul: docs,
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
