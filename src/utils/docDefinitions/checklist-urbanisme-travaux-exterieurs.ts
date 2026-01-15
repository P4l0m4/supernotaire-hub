import type { ChecklistUrbanismeTravauxExterieurs } from "@/types/checklist-urbanisme-travaux-exterieurs";

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
  data: ChecklistUrbanismeTravauxExterieurs,
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

  const urbanisme = data.urbanisme ?? {};
  addInfo(
    "Aucune autorisation d'urbanisme obtenue",
    urbanisme.autorisationsObtenues
  );
  addInfo(
    "Type d'autorisation",
    urbanisme.typeAutorisation,
    urbanisme.autorisationsObtenues === false
  );

  const travaux = data.travaux ?? {};
  addInfo(
    "Travaux avec impact extérieur / urbanistique",
    travaux.impactExterieur === true ? "Oui" : "Non"
  );

  const details = Array.isArray(travaux.details) ? travaux.details : [];
  details.forEach((t, idx) => {
    const label = `Travaux ${idx + 1}`;
    const arreteState =
      t.arreteExiste === false
        ? "Oui (arrêté existant)"
        : t.arreteExiste === true
        ? "Non (aucun arrêté)"
        : "-";
    addInfo(`${label} - Arrêté d'urbanisme`, arreteState);
    addInfo(
      `${label} - Type d'autorisation`,
      t.arreteType,
      t.arreteExiste === false
    );
    addInfo(`${label} - Type de travaux`, t.typeTravaux);
    const travauxEtat =
      t.travauxAcheves == null
        ? "-"
        : t.travauxAcheves
        ? "Travaux non-achevés"
        : "Travaux terminés";
    addInfo(`${label} - État`, travauxEtat);
    addInfo(
      `${label} - Date d'achèvement prévue`,
      t.dateAchevement,
      t.travauxAcheves === true
    );
    addInfo(
      `${label} - Travaux non conformes`,
      t.travauxNonConformes,
      t.travauxNonConformes !== undefined
    );
    const plansEtat =
      t.plansDisponibles == null
        ? "-"
        : t.plansDisponibles
        ? "Plans approuvés non disponibles"
        : "Plans approuvés disponibles";
    addInfo(`${label} - Plans approuvés`, plansEtat, t.arreteExiste === false);
    addInfo(
      `${label} - Travaux achevés`,
      travauxEtat,
      t.arreteExiste === false
    );
    addInfo(
      `${label} - Date de dépôt DAACT`,
      t.dateDepotDaact,
      t.arreteExiste === false &&
        t.travauxNonConformes === false &&
        t.travauxAcheves !== true
    );
    addInfo(
      `${label} - Plans approuvés disponibles`,
      t.plansDisponibles,
      t.arreteExiste === false
    );
    addInfo(
      `${label} - Motif absence arrêté`,
      t.motifAbsenceArrete,
      t.arreteExiste === true
    );

    addDoc(
      "Arrêté de permis de construire ou arrêté de non-opposition à déclaration préalable",
      t.arreteExiste === false
    );
    addDoc(
      t.arreteType ?? "",
      t.arreteExiste === false && Boolean(t.arreteType)
    );
    addDoc(
      "Accusé de réception ou preuve de dépôt de la DAACT",
      t.arreteExiste === false &&
        t.travauxNonConformes === false &&
        t.travauxAcheves !== true
    );
    addDoc(
      "DAACT (Déclaration attestant l'achèvement et la conformité des travaux)",
      t.arreteExiste === false &&
        t.travauxNonConformes === false &&
        t.travauxAcheves !== true
    );
    addDoc(
      "Plans approuvés",
      t.arreteExiste === false && t.plansDisponibles === false
    );
  });

  const cadastre = data.cadastre ?? {};
  addInfo("Section cadastrale", cadastre.section);
  addInfo("Numéro de parcelle", cadastre.parcelle);
  addInfo("Superficie cadastrale (m²)", cadastre.superficie);
  addInfo(
    "Plan cadastral disponible",
    cadastre.planDisponible === true ? "Oui" : "Non"
  );

  addDoc("Extrait ou plan cadastral du bien", cadastre.planDisponible === true);

  const servitudes = data.servitudes ?? {};
  const servitudeTypes: string[] = Array.isArray(servitudes.types)
    ? servitudes.types
    : [];
  addInfo("Le bien est grevé de servitudes connues", servitudes.existent);
  addInfo(
    "Type(s) de servitudes",
    servitudeTypes,
    servitudes.existent === true
  );
  const zonage = data.zonage ?? {};
  addInfo(
    "Le bien est situé dans une zone réglementée par un document d'urbanisme",
    zonage.reglemente
  );
  addInfo(
    "Type de document d'urbanisme",
    zonage.type === "Autre" ? zonage.typeAutre : zonage.type,
    zonage.reglemente === true
  );
  addInfo("Un contentieux est en cours", data.contentieux?.enCours);
  addInfo(
    "Type(s) de contentieux",
    data.contentieux?.types,
    data.contentieux?.enCours === true
  );
  addInfo(
    "Précisions sur le contentieux",
    data.contentieux?.autreDetail,
    Array.isArray(data.contentieux?.types) &&
      data.contentieux?.types?.includes("autre")
  );

  if (servitudeTypes.length) {
    addDoc("Justificatif ou plan disponible");
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
      logoEasyCase: logoBase64,
    },
    content: [
      {
        text: "Urbanisme & Travaux extérieurs",
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
