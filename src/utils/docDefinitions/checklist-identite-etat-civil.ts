import type { ChecklistIdentiteEtatCivil } from "@/types/checklist-identite-etat-civil";

const val = (v: unknown) => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (v && typeof v === "object") {
    const anyVal = v as Record<string, unknown>;
    if (typeof anyVal.label === "string") return anyVal.label;
    if (typeof anyVal.value === "string") return anyVal.value;
    const props = (anyVal as Record<string, any>).properties;
    if (props && typeof props.label === "string") return props.label;
    return "-";
  }
  return v == null || v === "" ? "-" : String(v);
};

export function buildDocDefinition(
  data: ChecklistIdentiteEtatCivil,
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

  const identite = data.identite ?? {};
  const lieu = identite.lieu_naissance ?? {};
  const etatCivil = data.etat_civil ?? {};

  addInfo("Date de naissance", identite.date_naissance);
  addInfo("Nom", identite.nom);
  addInfo("Prénom(s)", identite.prenoms);
  addInfo("Adresse actuelle", identite.adresse_actuelle?.properties?.label);
  addInfo("Lieu de naissance", lieu.type);
  addInfo("Département de naissance", lieu.departement, lieu.type === "France");
  addInfo("Ville de naissance", lieu.ville, lieu.type === "Pays étranger");
  addInfo("Pays de naissance", lieu.pays, lieu.type === "Pays étranger");

  addInfo(
    "Changement d'état civil",
    etatCivil.changement_etat_civil ? "Oui" : "Non"
  );
  addInfo(
    "Type de changement",
    etatCivil.type_changement,
    etatCivil.changement_etat_civil === true
  );

  if (etatCivil.type_changement === "Changement de nom par décret") {
    const cn = etatCivil.changement_nom ?? {};
    addInfo(
      "A déjà signé des documents avec un ancien état civil",
      cn.a_signe_ancien_etat_civil
    );
    addInfo(
      "Ancien nom",
      cn.ancien_nom,
      cn.a_signe_ancien_etat_civil === false
    );
    addInfo(
      "Date du décret ou jugement",
      cn.date_decret_jugement,
      cn.a_signe_ancien_etat_civil === false
    );
  }

  if (etatCivil.type_changement === "Mariage") {
    const mariage = etatCivil.mariage ?? {};
    addInfo("Lieu du mariage", mariage.lieu);
    addInfo("Date du mariage", mariage.date);
    addInfo("Nom du conjoint", mariage.nom_conjoint);
    addInfo("Prénom du conjoint", mariage.prenom_conjoint);
    addInfo("Choix d'usage", mariage.choix_usage);
  }

  if (etatCivil.type_changement === "Divorce / dissolution PACS") {
    const divorce = etatCivil.divorce ?? {};
    addInfo(
      "Date du jugement ou dissolution",
      divorce.date_jugement_ou_dissolution
    );
    addInfo("Nom de l'ex-conjoint / partenaire", divorce.nom_ex_conjoint);
  }

  if (etatCivil.type_changement === "Veuvage") {
    const veuvage = etatCivil.veuvage ?? {};
    addInfo("Date du décès du conjoint", veuvage.date_deces_conjoint);
    addInfo("Lieu du décès du conjoint", veuvage.lieu_deces_conjoint);
  }

  if (etatCivil.type_changement === "Rectification de genre") {
    const rectif = etatCivil.rectification_genre ?? {};
    addInfo("Date de la décision", rectif.date_decision);
    addInfo("Tribunal de la décision", rectif.tribunal_decision);
    addInfo(
      "A déjà signé des documents avec un ancien état civil",
      rectif.a_signe_ancien_etat_civil
    );
  }

  addDoc("Pièce d'identité (CNI, titre de séjour ou passeport)");
  addDoc("Acte de naissance intégral < 3 mois");

  if (etatCivil.type_changement === "Changement de nom par décret") {
    const cn = etatCivil.changement_nom ?? {};
    addDoc(
      "Ancien passeport / CNI ou titre de séjour portant l'ancien nom",
      cn.a_signe_ancien_etat_civil === true
    );
    addDoc("Décret / jugement", cn.a_signe_ancien_etat_civil === false);
    addDoc(
      "Publication au J.O ou attestation mairie",
      cn.a_signe_ancien_etat_civil === false
    );
  }

  if (etatCivil.type_changement === "Mariage") {
    addDoc("Copie intégrale de l'acte de mariage < 3 mois");
  }

  if (etatCivil.type_changement === "Pacs") {
    addDoc("Attestation d'enregistrement PACS");
  }

  if (etatCivil.type_changement === "Divorce / dissolution PACS") {
    addDoc(
      "Jugement de divorce (ou acte de dissolution PACS si partenariat contractuel)"
    );
    addDoc("Extrait d'acte de naissance mis à jour");
    addDoc("Copie du livret de famille");
  }

  if (etatCivil.type_changement === "Veuvage") {
    addDoc("Acte de décès du conjoint");
    addDoc("Extrait d'acte de mariage portant mention du décès");
  }

  if (etatCivil.type_changement === "Rectification de genre") {
    addDoc("Jugement");
    addDoc(
      "Ancien passeport / CNI ou titre de séjour portant l'ancien nom",
      etatCivil.rectification_genre?.a_signe_ancien_etat_civil === true
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
        text: "Identité & État civil",
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
