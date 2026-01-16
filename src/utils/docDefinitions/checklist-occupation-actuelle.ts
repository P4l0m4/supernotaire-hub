import type { ChecklistOccupationActuelle } from "@/types/checklist-occupation-actuelle";
import { formatChecklistValue as val } from "@/utils/docDefinitions/formatters";

export function buildDocDefinition(
  data: ChecklistOccupationActuelle,
  logoBase64: string
) {
  if (!data) return;

  const rows: Array<[string, string]> = [];
  const docs = new Set<string>();

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    rows.push([label, val(value)]);
  };
  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docs.add(label);
  };

  addInfo("Bien occupé actuellement", data.bien_occupe);
  addInfo(
    "Bien libre au moment de la vente",
    data.bien_libre_moment_vente,
    data.bien_occupe === false
  );
  addInfo(
    "Date estimée de libération",
    data.date_liberation,
    data.bien_occupe === false && data.bien_libre_moment_vente === false
  );

  addInfo("Occupé par", data.par_qui, data.bien_occupe === true);

  addInfo(
    "Nom complet de l'occupant",
    data.occupant_gratuit_nom,
    data.par_qui === "Occupant gratuit"
  );
  addDoc(
    "Convention d'occupation à titre gratuit ou attestation sur l'honneur du vendeur",
    data.par_qui === "Occupant gratuit"
  );

  addInfo(
    "Nature de l'occupation",
    data.nature_occupation,
    data.par_qui === "Proprietaire vendeur"
  );

  addDoc(
    "Convention d'indivision ou accord écrit",
    data.par_qui === "Indivisaire"
  );

  addInfo(
    "Procédure en cours (occupation sans droit ni titre)",
    data.procedure_en_cours,
    data.par_qui === "Squatteur"
  );
  addDoc(
    "Document de procédure déjà émis (si disponible)",
    data.par_qui === "Squatteur" && data.procedure_en_cours === true
  );

  addInfo("Type de bail", data.type_bail, data.par_qui === "Locataire");
  addInfo(
    "Précisions bail",
    data.bail_autre_precisions,
    data.par_qui === "Locataire" && data.type_bail === "Autre"
  );
  addDoc("Copie du bail", data.par_qui === "Locataire");
  addDoc(
    "Dernier avis d'échéance ou quittance de loyer",
    data.par_qui === "Locataire"
  );
  addDoc(
    "Etat des lieux d'entrée (si disponible)",
    data.par_qui === "Locataire"
  );

  const infoBody = [
    ["Information", "Réponse"],
    ...(rows.length ? rows : [["Informations", "-"]]),
  ];

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoEasyCase: logoBase64,
    },
    content: [
      {
        text: "Occupation actuelle du bien",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: "Situation d'occupation du bien et pièces associées",
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
      docs.size
        ? { ul: Array.from(docs).map((doc) => `${doc}`), margin: [0, 0, 0, 24] }
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





