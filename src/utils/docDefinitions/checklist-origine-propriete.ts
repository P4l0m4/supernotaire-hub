import type { ChecklistOriginePropriete } from "@/types/checklist-origine-propriete";

const val = (v: unknown) => {
  if (v == null || v === "") return "-";
  return String(v);
};

export function buildDocDefinition(
  data: ChecklistOriginePropriete,
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

  addInfo("Origine de propriété", data.origine_propriete);
  addInfo(
    "Type de succession / testament",
    data.sous_type_succession,
    data.origine_propriete === "Succession / Testament"
  );

  switch (data.origine_propriete) {
    case "Achat classique":
      addDoc("Attestation ou titre de propriété");
      break;
    case "Succession / Testament":
      if (data.sous_type_succession === "Succession / Héritage") {
        addDoc("Attestation immobilière de succession");
        addDoc("Déclaration de succession (cerfa 2705)");
      }
      if (data.sous_type_succession === "Legs particulier (testament)") {
        addDoc("Expédition du testament");
        addDoc("Procès-verbal d'ouverture/dépôt");
        addDoc("Certificat d'hérédité ou acte de notoriété");
        addDoc("Attestation immobilière publiée");
      }
      break;
    case "Achat en VEFA (vente sur plan / programme neuf)":
      addDoc("Acte d'achat avec annexes");
      break;
    case "Donation entre vifs":
      addDoc("Acte de donation");
      break;
    case "Partage / Licitation":
      addDoc("Acte de partage/licitation");
      break;
    case "Échange":
      addDoc("Acte d'échange");
      break;
    case "Apport en société":
      addDoc("Acte d'apport");
      addDoc("Statuts mis à jour");
      break;
    case "Adjudication / Vente aux enchères":
      addDoc("Procès-verbal d'adjudication");
      break;
    case "Dation en paiement":
      addDoc("Acte notarié de transfert");
      addDoc("Convention de dation acceptée par le créancier");
      addDoc("Quitus de la dette");
      break;
    case "Vente à terme / paiement différé":
      addDoc("Acte de vente à terme");
      addDoc("Quitus ou attestation de paiement intégral");
      break;
    case "Cession de nue-propriété / usufruit":
      addDoc("Acte de démembrement");
      addDoc("Convention d'usufruit");
      addDoc("Attestation d'absence d'hypothèque");
      break;
    default:
      break;
  }

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
        text: "Origine de propriété",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: "Documents liés à l'origine de propriété du bien",
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
        ? { ul: docs.map((doc) => `■ ${doc}`), margin: [0, 0, 0, 24] }
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
