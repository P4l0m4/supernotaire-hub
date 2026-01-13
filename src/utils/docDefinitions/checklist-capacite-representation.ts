import type { ChecklistCapaciteRepresentation } from "@/types/checklist-capacite-representation";

const val = (v: unknown) => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (v == null || v === "") return "-";
  return String(v);
};

export function buildDocDefinition(
  data: ChecklistCapaciteRepresentation,
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

  addInfo("Statut de la partie", data.statut_partie);

  if (data.statut_partie === "Personne physique") {
    addInfo(
      "Sous protection (tutelle/curatelle/habilitation/sauvegarde)",
      data.sous_protection
    );
    addInfo("Type de protection", data.type_protection, data.sous_protection);
    addInfo(
      "Représentation de la personne protégée",
      data.representant_protection,
      data.sous_protection
    );

    if (data.sous_protection) {
      addDoc(
        "Jugement de mise sous protection (tutelle/curatelle/habilitation)"
      );
      if (data.representant_protection === "Conjoint") {
        addDoc("Accord du conjoint (époux/épouse)");
        addDoc("Autorisation du juge ou subdélégation");
      }
      if (
        data.representant_protection === "Tiers (curateur/tuteur/mandataire)"
      ) {
        addDoc("Rôle et identité du curateur/tuteur/mandataire");
        addDoc("Mandat autorisant la vente");
        addDoc("Autorisation du juge des tutelles");
      }
      if (data.representant_protection === "Mandataire judiciaire") {
        addDoc("Décision de nomination du mandataire judiciaire");
        addDoc("Mandat autorisant la vente");
      }
      if (data.representant_protection === "Représentation familiale") {
        addDoc("Jugement d'habilitation familiale / représentation familiale");
      }
    }

    addInfo("Signature par procuration", data.signature_par_procuration);
    addInfo(
      "Type de procuration",
      data.type_procuration,
      data.signature_par_procuration
    );
    if (data.signature_par_procuration) {
      addDoc("Procuration (originale)");
      addDoc("Pièce d'identité du mandataire");
    }
  }

  if (data.statut_partie === "Personne morale") {
    addInfo("Type de personne morale", data.type_personne_morale);
    addInfo(
      "Société unipersonnelle (SASU/EURL/associé unique)",
      data.societe_unipersonnelle
    );
    addInfo("Signature par représentant", data.signature_par_representant);
    addInfo(
      "Type de représentant",
      data.representant_societe,
      data.signature_par_representant
    );
    addInfo(
      "Type de procuration (mandataire délégué)",
      data.type_procuration_societe,
      data.signature_par_representant &&
        data.representant_societe === "Mandataire délégué"
    );

    addDoc("Statuts à jour");
    addDoc("Extrait Kbis de moins de 3 mois");
    addDoc("Pièces d'identité des représentants légaux");
    addDoc(
      "Procès-verbal autorisant la vente du bien au nom de la société (assemblée/associés)"
    );
    addDoc("Procès-verbal de nomination des dirigeants (en cours de validité)");
    if (data.societe_unipersonnelle) {
      addDoc("Procès-verbal de décision de l'associé unique");
    }
    if (
      data.type_personne_morale === "SCI" ||
      data.type_personne_morale === "SARL"
    ) {
      addDoc("Procès-verbal d'agrément des associés (si requis)");
    }
    if (
      data.signature_par_representant &&
      data.representant_societe === "Mandataire délégué"
    ) {
      addDoc("Mandat / délégation de pouvoir autorisant la vente");
      addDoc("Procuration (originale)");
    }
  }

  if (data.statut_partie === "Indivision") {
    addInfo(
      "Mandataire / représentant unique désigné",
      data.indivision_representant_unique
    );
    addDoc("Titre d'indivision (acte ou convention)");
    addDoc("Identité et parts de chaque indivisaire");
    addDoc("Procès-verbal ou accord des indivisaires autorisant la vente");
    if (data.indivision_representant_unique) {
      addDoc("Mandat commun / procuration du représentant de l'indivision");
    }
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
        text: "Capacité & Représentation",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: "Capacité juridique, protections et pouvoirs pour signer la vente",
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
        ? { ul: docs, margin: [0, 0, 0, 24] }
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
