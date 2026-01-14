import type { ChecklistCoproStructures } from "@/types/checklist-copro-structures";

const val = (v: unknown) => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (v == null || v === "") return "-";
  return String(v);
};

export function buildDocDefinition(
  data: ChecklistCoproStructures,
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

  addInfo("Bien en copropriété", data.bien_en_copropriete);
  addInfo(
    "Gestion de la copropriété",
    data.gestion_copropriete,
    data.bien_en_copropriete === true
  );
  addInfo("Email du syndic", data.email_syndic, data.email_syndic);
  addInfo("Numéro du syndic", data.tel_syndic, data.tel_syndic);

  addInfo(
    "Travaux parties communes en cours",
    data.travaux_parties_communes,
    data.bien_en_copropriete === true
  );

  addInfo(
    "Compteurs individualisés",
    data.compteurs_individualises,
    data.bien_en_copropriete === true
  );
  addInfo(
    "Types de compteurs",
    (data.types_compteurs || [])
      .map((t) => val((t as any).label ?? t))
      .join(", "),
    data.compteurs_individualises === true
  );
  addInfo(
    "Installations conformes",
    data.conformite_installations,
    data.compteurs_individualises === true
  );

  addInfo("Lotissement / ASL / AFUL", data.est_en_asl);
  addInfo("Nom ASL/AFUL", data.nom_asl, data.est_en_asl === true);
  addInfo("Contact ASL/AFUL", data.contact_asl, data.est_en_asl === true);
  addInfo("Téléphone ASL/AFUL", data.telephone_asl, data.est_en_asl === true);

  // Documents copro (si en copropriété)
  addDoc(
    "Historique des charges de copropriété (3 dernières années)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Compte-rendu de la dernière AG (PV)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Convocation et ordre du jour de la prochaine AG",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Reglement de copropriété et état descriptif de division",
    data.bien_en_copropriete === true
  );
  addDoc("Carnet d'entretien de l'immeuble", data.bien_en_copropriete === true);
  addDoc(
    "Relevé des charges annuelles (budget prévisionnel et dépenses)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Mises en demeure / relances de charges éventuelles",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Protocole de recouvrement en cours (le cas échéant)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Diagnostics parties communes (DTG, audits énergétiques le cas échéant)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Devis ou autorisations pour travaux sur parties communes",
    data.travaux_parties_communes === true
  );
  addDoc(
    "Coordonnées du représentant du syndic / conseil syndical",
    data.bien_en_copropriete === true
  );

  // ASL / AFUL
  addDoc(
    "Statuts et règlement intérieur de l'ASL / AFUL",
    data.est_en_asl === true
  );
  addDoc("Appels de charges / contributions ASL", data.est_en_asl === true);
  addDoc(
    "Coordonnées de l'administrateur / président de l'ASL",
    data.est_en_asl === true
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
        text: "Copropriété & Structures collectives",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: "Informations copropriété / ASL et pièces associées",
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
