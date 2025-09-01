import {
  fmtEur,
  squashTofu,
  fmtPct,
  toNum,
} from "@/utils/docDefinitions/formatters";

import type {
  PreEtatDate,
  Provision,
} from "@/utils/types/pre-etat-date-complet";

export function buildDocDefinition(d: PreEtatDate, logoBase64: string) {
  const FL = d.financier_lot;
  const SDC = d.financier_lot_sommes_dues_cedant;
  const AUT = d.financier_lot_autres;
  const ACQ = d.financier_lot_sommes_a_la_charge_acquereur_post_vente;
  const num = (v: any) => (typeof v === "number" ? v : Number(v ?? 0)) || 0;

  const toNum = (v: any) => {
    const n = Number(String(v ?? "").replace(/\s/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const lotCard = (l: any) => {
    const designation = l.designation || "-";
    const numero = l.numero || "-";
    const usage = l.usage || "-";

    return {
      table: {
        widths: ["*", "auto"],
        body: [
          [
            { text: designation, style: "tableHeader", fillColor: "#f5f5f5" },
            {
              text: `Lot ${numero}`,
              style: "tableHeader",
              fillColor: "#f5f5f5",
            },
          ],
          ["Usage", usage],
        ],
      },
      layout: "lightHorizontalLines",
      margin: [0, 4, 0, 8],
    };
  };

  const lotsStack = (d.bien?.lots ?? []).map(lotCard);

  const emprunts = (d.copropriete?.emprunts ?? []).map((e) => [
    e.objet ?? "-",
    fmtEur(e.capital_restant_du),
  ]);

  const echeances = Array.isArray(FL.echeances_a_venir)
    ? FL.echeances_a_venir.map((p) => [p.date, fmtEur(p.montant)])
    : [];

  // A) Avances perçues (AUT.avances_provisions) + emprunts copropriété
  const A1 = num(AUT?.avances_provisions?.generale);
  const A2 = num(AUT?.avances_provisions?.travaux);
  const A3 = (
    Array.isArray(d.copropriete?.emprunts) ? d.copropriete.emprunts : []
  ).reduce((s: number, e: any) => s + num(e?.capital_restant_du), 0);

  // B) Provisions postérieures rendues exigibles (AUT.sommes_dont_…)
  const B = num(
    AUT?.sommes_dont_syndicat_pourrait_etre_debiteur
      ?.provisions_posterieures_rendues_exigibles
  );

  // C) Solde créditeur exercice antérieur (FL)
  const C = num(FL.solde_crediteur_exercice_anterieur);

  const TOTAL = A1 + A2 + A3 + B + C;

  const chargesN1 = AUT?.charges?.N_1;
  const chargesN2 = AUT?.charges?.N_2;

  // === SOMMES CHARGE ACQUEREUR POST VENTE ===
  const acq = d.financier_lot_sommes_a_la_charge_acquereur_post_vente;

  // 1) Reconstitution des avances
  const R = acq?.reconstitution_avances;
  const reconstitutionRows = [
    ["- avances constituant la réserve (D. art. 35. 1°)", fmtEur(R?.reserve)],
    [
      "- avances nommées provisions (provisions spéciales)",
      fmtEur(R?.provisions_speciales),
    ],
    ["- avances (D. art. 45-1, al. 4) – emprunts", fmtEur(R?.avances_emprunts)],
  ];

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoSupernotaire: logoBase64,
    },
    content: [
      { text: "Pré-état daté Loi ALUR", style: "h1", margin: [0, 0, 0, 8] },
      {
        text: " (Articles 54 et suivants, nouvel article L 721-2 du CCH)",
        italics: true,
        margin: [0, 0, 0, 16],
      },
      {
        text: "Mutation de lots de copropriété - Information des parties dans le cadre de la signature d'un avant-contrat",
        style: "h2",
        margin: [0, 0, 0, 24],
      },
      {
        text: "Récapitulatif des pièces à annexer à l'avant-contrat en complément des diagnostiques techniques et en vue d'ouvrir le délai de rétractation (loi SRU):",
        style: "h3",
        margin: [0, 0, 0, 8],
      },
      {
        ul: [
          "L règlement de copropriété et ses modificatifs publiés",
          "L’état descriptif de division et ses modificatifs publiés",
          "Les procès-verbaux des assemblées générales des trois dernières années",
          "Le présent document / Pré-état daté (documents relatifs à la situation financière de la copropriété et du copropriétaire vendeur)",
          "Le carnet d'entretien de la copropriété",
        ],
        margin: [0, 0, 0, 24],
      },

      // En-tête lots + identification précise
      { text: "Identification du bien et des lots", style: "h2" },
      {
        columns: [
          [
            { text: "Adresse", style: "h3" },
            { text: d.bien?.adresse || "-", margin: [0, 0, 0, 6] },
            { text: "Identification", style: "h3", margin: [0, 6, 0, 2] },
            {
              table: {
                widths: ["*", "*"],
                body: [
                  ["Bâtiment", d.bien?.identification?.batiment ?? "-"],
                  [
                    "Entrée / Cage escalier",
                    d.bien?.identification?.escalier ?? "-",
                  ],
                  ["Étage", d.bien?.identification?.etage ?? "-"],
                  ["Compléments", d.bien?.identification?.complements ?? "-"],
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
          [
            { text: "Lots", style: "h3" },
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    {
                      stack: lotsStack.length ? lotsStack : [{ text: "-" }],
                      colSpan: 2,
                    },
                    {},
                  ],
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
        ],
        margin: [0, 0, 0, 24],
      },

      // Copropriété (+ date d’arrêté visible)
      { text: "La copropriété", style: "h2" },
      {
        text: `Données arrêtées au ${d.copropriete?.arrete_au ?? "-"}`,
        italics: true,
        margin: [0, 0, 0, 4],
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              "Existe-t-il un fonds travaux ALUR ?",
              fmtEur(d.copropriete?.fonds_travaux?.existance) ? "Oui" : "Non",
            ],
            [
              "Montant du fonds travaux",
              fmtEur(d.copropriete?.fonds_travaux?.montant),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },
      {
        text: "Impayés et dettes à la clôture du dernier exercice",
        style: "h3",
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              "Montant total des impayés",
              fmtEur(d.copropriete?.impayes?.total),
            ],
            [
              "État global de la dette du syndicat vis-à-vis des fournisseurs",
              fmtEur(d.copropriete?.dettes_syndic_fournisseurs),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },

      // Emprunts
      { text: "Emprunts du syndicat", style: "h3" },
      emprunts.length
        ? {
            table: {
              widths: ["*", "auto"],
              body: [["Objet", "Capital Restant Dû"], ...emprunts],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 24],
          }
        : { text: "Aucun", margin: [0, 0, 0, 24] },

      { text: "Le syndicat des copropriétaires", style: "h2" },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            ["Nom du syndic", d.syndic?.nom ?? "-"],
            ["Email", d.syndic?.contact?.email ?? "-"],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },

      // Lot – Financier (+ date d’arrêté visible)
      { text: "La situation financière du lot", style: "h2" },
      {
        text: `Données arrêtées au ${FL.arrete_au ?? "-"}`,
        italics: true,
        margin: [0, 0, 0, 4],
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            ["Solde du compte copropriétaire", fmtEur(FL.solde_compte)],
            ["Appels échus non payés", fmtEur(FL.appels_echus_non_payes)],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },

      {
        text: "Sommes dont le Syndicat pourrait être débiteur à l'égard du copropriétaire cédant pour les lots objets de la future mutation",
        style: "h2",
      },
      { text: "AU TITRE :", style: "h3", margin: [0, 0, 0, 8] },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "A/ DES AVANCES PERÇUES (D. art. 5, 2° a)",
                bold: true,
                colSpan: 2,
              },
              {},
            ],
            ["A1 – avances constituant la réserve (D. art. 35 1°)", fmtEur(A1)],
            [
              "A2 – avances nommées provisions (L. art. 18 al. 6 ; D. art. 35, 4° et 5°)",
              fmtEur(A2),
            ],
            [
              "A3 – avances (D. art. 45-1, al. 4) – emprunt du syndicat auprès de copropriétaires",
              fmtEur(A3),
            ],
            [
              "Modalités de remboursement des avances",
              AUT?.avances_provisions?.modalites_remboursement ?? "-",
            ],
            [
              {
                text: "",
                colSpan: 2,
                border: [false, false, false, false],
                margin: [0, 8, 0, 8],
              },
              {},
            ],
            [
              {
                text: "B/ DES PROVISIONS (D. art. 5, 2° b)",
                bold: true,
                colSpan: 2,
              },
              {},
            ],
            [
              "Provisions encaissées pour périodes postérieures et rendues exigibles (L. 10/07/1965, art. 19-2)",
              fmtEur(B),
            ],
            [
              {
                text: "",
                colSpan: 2,
                border: [false, false, false, false],
                margin: [0, 8, 0, 8],
              },
              {},
            ],
            [
              {
                text: "C/ DU SOLDE CRÉDITEUR SUR L’EXERCICE ANTÉRIEUR",
                bold: true,
                colSpan: 2,
              },
              {},
            ],
            [
              "Solde créditeur de l’exercice antérieur approuvé non imputé",
              fmtEur(C),
            ],
            [
              { text: "TOTAL (A + B + C)", bold: true },
              { text: fmtEur(TOTAL), bold: true },
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },

      { text: "Échéances à venir", style: "h3" },
      echeances.length
        ? {
            table: {
              widths: ["auto", "auto"],
              body: [["Date", "Montant"], ...echeances],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 24],
          }
        : { text: "Aucune", margin: [0, 0, 0, 24] },

      {
        text: "Sommes dues par le copropriétaire cédant pour les lots objets de la future mutation",
        style: "h2",
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              "Provisions budget prévisionnel exigibles",
              fmtEur(SDC?.provisions_exigibles?.budget_previsionnel),
            ],
            [
              "Provisions hors budget exigibles",
              fmtEur(SDC?.provisions_exigibles?.hors_budget),
            ],
            [
              "Charges impayées antérieures",
              fmtEur(SDC?.charges_impayees_anterieures),
            ],
            [
              "Cotisations au fonds de travaux exigibles",
              fmtEur(SDC?.cotisations_fonds_travaux_exigibles),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 16],
      },
      // Sous-détail “Autres sommes exigibles” si présent
      (() => {
        const a = SDC?.autres_sommes_exigibles;
        const rows = [
          ["Prêt (quote-part vendeur)", fmtEur(a?.pret_quote_part_vendeur)],
          ["Condamnations", fmtEur(a?.condamnations)],
          ["Autres", fmtEur(a?.autres)],
          [
            "À des tiers (emprunts gérés par le syndic)",
            fmtEur(a?.a_des_tiers_emprunts_geres_par_syndic),
          ],
        ].filter(([, v]) => v !== "—" && v !== undefined);
        return rows.length
          ? [
              {
                text: "Autres sommes exigibles",
                style: "h3",
                margin: [0, 8, 0, 6],
              },
              {
                table: { widths: ["*", "auto"], body: rows },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 24],
              },
            ]
          : { text: "" };
      })(),

      // Charges avec année_exercice
      {
        text: "Quote-part pour les lots objets de la future mutation:",
        style: "h2",
      },

      { text: "Au titre du budget prévisionnel", style: "h3", bold: true },
      {
        table: {
          widths: ["*", "auto", "auto"],
          body: [
            ["Exercice", "Quote-part appelée", "Quote-part réelle"],
            [
              "N-1",
              fmtEur(chargesN1?.bp_appelee),
              fmtEur(chargesN1?.bp_reelle),
            ],
            [
              "N-2",
              fmtEur(chargesN2?.bp_appelee),
              fmtEur(chargesN2?.bp_reelle),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 16],
      },

      { text: "Au titre des dépenses hors budget", style: "h3", bold: true },
      {
        table: {
          widths: ["*", "auto", "auto"],
          body: [
            ["Exercice", "Quote-part appelée", "Quote-part réelle"],
            [
              "Exercice (N-1)",
              fmtEur(chargesN1?.hb_appelee),
              fmtEur(chargesN1?.hb_reelle),
            ],
            [
              "Exercice (N-2)",
              fmtEur(chargesN2?.hb_appelee),
              fmtEur(chargesN2?.hb_reelle),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 16],
      },

      // Sommes post-vente
      {
        text: "Sommes incombant au nouveau propriétaire pour les lots objets de la future mutation",
        style: "h2",
      },
      { text: "AU SYNDICAT, AU TITRE :", style: "h3", margin: [0, 0, 0, 8] },

      {
        text: "1 — de la reconstitution des avances (D. art. 5, 3° a)",
        bold: true,
        margin: [0, 0, 0, 8],
      },
      reconstitutionRows.some((r) => r[1])
        ? {
            table: { widths: ["*", "auto"], body: reconstitutionRows },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 8],
          }
        : { text: "Aucune", margin: [0, 0, 0, 8] },

      // 2 — Provisions non encore exigibles
      {
        text: "2 — des provisions non encore exigibles",
        bold: true,
        margin: [0, 8, 0, 8],
      },

      (() => {
        const pnee = ACQ?.provisions_non_encore_exigibles;
        const toRows = (list?: Provision[]) =>
          Array.isArray(list) && list.length
            ? list.map((p) => [p.date, fmtEur(p.montant)])
            : [];

        const bpRows = toRows(pnee?.budget_previsionnel);
        const hbRows = toRows(pnee?.hors_budget);
        const ftRows = toRows(ACQ?.fonds_travaux_non_encore_exigibles);

        return [
          {
            text: "Dans le budget prévisionnel (D. art. 5, 3° b):",
            italics: true,
            margin: [0, 0, 0, 4],
          },
          bpRows.length
            ? {
                table: {
                  widths: ["auto", "auto"],
                  body: [["Date d’exigibilité", "Montant (EUR)"], ...bpRows],
                },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 6],
              }
            : { text: "Aucune", margin: [0, 0, 0, 6] },

          {
            text: "Dans les dépenses hors budget prévisionnel (D. art. 5, 3° c):",
            italics: true,
            margin: [0, 4, 0, 4],
          },
          hbRows.length
            ? {
                table: {
                  widths: ["auto", "auto"],
                  body: [["Date d’exigibilité", "Montant (EUR)"], ...hbRows],
                },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 6],
              }
            : { text: "Aucune", margin: [0, 0, 0, 6] },

          {
            text: "Fonds de travaux — Provisions non encore exigibles :",
            italics: true,
            margin: [0, 4, 0, 4],
          },
          ftRows.length
            ? {
                table: {
                  widths: ["auto", "auto"],
                  body: [["Date d’exigibilité", "Montant (EUR)"], ...ftRows],
                },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 24],
              }
            : { text: "Aucune", margin: [0, 0, 0, 24] },
        ];
      })(),

      // Meta / Sources
      { text: "Métadonnées", style: "h2" },
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
        text: "Pré-état daté provisoire. Sous réserves des pièces du syndic et sur la foi des déclarations effectuées par le propriétaire du bien.",
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
