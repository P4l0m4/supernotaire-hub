import type { ChecklistChargesTaxes } from "@/types/checklist-charges-taxes";

const val = (v: unknown) => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (v == null || v === "") return "-";
  return String(v);
};

export function buildDocDefinition(
  data: ChecklistChargesTaxes,
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
  addInfo("Type de chauffage", data.type_chauffage);
  addInfo(
    "Précision chauffage",
    data.type_chauffage_autre,
    data.type_chauffage === "Autre"
  );
  addInfo(
    "Date du dernier entretien du chauffage",
    data.date_entretien_chauffage
  );
  addInfo("Date du dernier ramonage", data.date_ramonage);

  addInfo("Mode d'assainissement", data.mode_assainissement);
  addInfo("Situation d'occupation fiscale", data.situation_fiscale);
  addInfo("Montant annuel de la taxe foncière", data.montant_taxe_fonciere);
  addInfo(
    "Montant annuel de la dernière taxe d’habitation",
    data.montant_derniere_taxe_habitation
  );
  addInfo(
    "Présence d'une TEOM",
    data.presence_teom,
    data.presence_teom !== undefined
  );
  addInfo(
    "Bien soumis à la taxe d'habitation",
    data.bien_soumis_taxe_habitation,
    data.bien_soumis_taxe_habitation !== undefined
  );

  // Documents
  addDoc(
    "Dernière attestation d'entretien du chauffage",
    Boolean(data.type_chauffage)
  );
  addDoc(
    "Rapport de diagnostic assainissement non collectif (en cours de validité)",
    data.mode_assainissement === "Individuel"
  );
  addDoc("Dernier avis de taxe foncière");
  addDoc(
    "Dernier avis de taxe d'habitation",
    data.bien_soumis_taxe_habitation === true
  );
  addDoc(
    "Montant annuel de la dernière taxe d'habitation (si applicable)",
    data.bien_soumis_taxe_habitation === false
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
        text: "Charges & Taxes",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: "Chauffage, assainissement et situation fiscale",
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
