import type { PreEtatDate } from "@/utils/types/pre-etat-date-complet";

const squashTofu = (s: unknown) =>
  typeof s === "string" ? s.replace(/\u202F|\u00A0/g, " ") : s;
const toNum = (x: unknown): number | undefined => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim() !== "" && !Number.isNaN(Number(x)))
    return Number(x);
  return undefined;
};
const fmtEur = (x: unknown) => {
  const n = toNum(x);
  return n == null
    ? "-"
    : squashTofu(
        n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
      );
};
const fmtPct = (x: unknown) => {
  const n = toNum(x);
  return n == null ? "-" : squashTofu((n * 100).toFixed(2) + " %");
};

export function buildDocDefinition(d: PreEtatDate, logoBase64: string) {
  const lots =
    (d.bien?.lots ?? [])
      .map((l) => {
        const t = toNum(l.tantiemes);
        const base = `Lot ${l.numero}${l.usage ? ` (${l.usage})` : ""}${
          t != null ? ` — ${t} tantièmes` : ""
        }`;
        const ts = l.tantiemes_speciaux;
        const spec = ts
          ? ` [tantièmes spéciaux: ${Object.entries(ts)
              .map(([k, v]) => `${k}: ${toNum(v) ?? "-"}`)
              .join(", ")}]`
          : "";
        return base + spec;
      })
      .join(", ") || "-";

  const procedures = (d.copropriete?.procedures ?? []).map((p) => [
    p.type ?? "-",
    p.etat ?? "-",
    fmtEur(p.montant),
  ]);
  const emprunts = (d.copropriete?.emprunts ?? []).map((e) => [
    e.objet ?? "-",
    fmtEur(e.capital_restant_du),
  ]);
  const travauxVotes = (d.ag?.derniere_ag?.travaux_votes ?? []).map((t) => [
    t.objet ?? "-",
    fmtEur(t.budget),
    t.etat ?? "-",
  ]);
  const echeances = (d.financier_lot?.echeances_a_venir ?? []).map((e) => [
    e.date,
    fmtEur(e.montant),
  ]);

  const chargesN = d.financier_lot?.charges?.N;
  const chargesN1 = d.financier_lot?.charges?.N_1;
  const labelN = chargesN?.année_exercice
    ? `Exercice ${chargesN.année_exercice}`
    : "N";
  const labelN1 = chargesN1?.année_exercice
    ? `Exercice ${chargesN1.année_exercice}`
    : "N-1";

  // === SOMMES CHARGE ACQUEREUR POST VENTE ===
  const acq = d.financier_lot?.sommes_a_la_charge_acquereur_post_vente;

  // 1) Reconstitution des avances
  const R = acq?.reconstitution_avances || {};
  const reconstitutionRows = [
    ["- avances constituant la réserve (D. art. 35. 1°)", fmtEur(R.reserve)],
    [
      "- avances nommées provisions (provisions spéciales)",
      fmtEur(R.provisions_speciales),
    ],
    ["- avances (D. art. 45-1, al. 4) – emprunts", fmtEur(R.avances_emprunts)],
  ];

  // 2) Provisions non encore exigibles
  const bpRows = (
    acq?.provisions_non_encore_exigibles?.budget_previsionnel ?? []
  ).map((it) => [it?.date ?? "-", fmtEur(it?.montant)]);

  const hb = acq?.provisions_non_encore_exigibles?.hors_budget;
  const hbRows =
    hb && (hb.date || hb.montant) ? [[hb.date ?? "-", fmtEur(hb.montant)]] : [];

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
          [{ text: "Lots", style: "h3" }, { text: lots }],
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
              "Nombre de lots principaux",
              String(d.copropriete?.nombre_lots_principaux ?? "-"),
            ],
            [
              "Fonds travaux (ALUR)",
              fmtEur(d.copropriete?.fonds_travaux?.montant),
            ],
            [
              "Arrêté fonds travaux",
              d.copropriete?.fonds_travaux?.date_arret ?? "-",
            ],
            ["Impayés (>30j) total", fmtEur(d.copropriete?.impayes?.total)],
            ["Taux d’impayés", fmtPct(d.copropriete?.impayes?.taux)], // <= FIX
            ["Assureur", d.copropriete?.assurance?.assureur ?? "-"],
            [
              "N° de police d'assurance",
              d.copropriete?.assurance?.police ?? "-",
            ],
            ["Échéance assurance", d.copropriete?.assurance?.echeance ?? "-"],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },

      // Procédures
      { text: "Les procédures en cours", style: "h3" },
      procedures.length
        ? {
            table: {
              widths: ["*", "auto", "auto"],
              body: [["Type", "État", "Montant"], ...procedures],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 8],
          }
        : { text: "Aucune", margin: [0, 0, 0, 8] },

      // Emprunts
      { text: "Emprunts du syndicat", style: "h3" },
      emprunts.length
        ? {
            table: {
              widths: ["*", "auto"],
              body: [["Objet", "CRD"], ...emprunts],
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
            ["Téléphone", d.syndic?.contact?.telephone ?? "-"],
            ["Fin du mandat", d.syndic?.fin_du_mandat ?? "-"],
            ["Date de désignation (AG)", d.syndic?.date_designation_ag ?? "-"],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },

      // AG
      { text: "La dernière Assemblée Générale", style: "h2" },
      {
        table: {
          widths: ["*", "auto"],
          body: [["Date", d.ag?.derniere_ag?.date ?? "-"]],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 6],
      },
      { text: "Travaux votés non soldés", style: "h3" },
      travauxVotes.length
        ? {
            table: {
              widths: ["*", "auto", "auto"],
              body: [["Objet", "Budget", "État"], ...travauxVotes],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 24],
          }
        : { text: "Aucun", margin: [0, 0, 0, 24] },

      // Lot – Financier (+ date d’arrêté visible)
      { text: "La situation financière du lot", style: "h2" },
      {
        text: `Données arrêtées au ${d.financier_lot?.arrete_au ?? "-"}`,
        italics: true,
        margin: [0, 0, 0, 4],
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              "Solde du compte copropriétaire",
              fmtEur(d.financier_lot?.solde_compte),
            ],
            [
              "Appels échus non payés",
              fmtEur(d.financier_lot?.appels_echus_non_payes),
            ],
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

      (() => {
        const num = (v: any) =>
          (typeof v === "number" ? v : Number(v ?? 0)) || 0;

        // A) Avances perçues
        const A1 = num(d.financier_lot?.avances_provisions?.generale); // réserve / avance générale
        const A2 = num(d.financier_lot?.avances_provisions?.travaux); // provisions spéciales / travaux
        const A3 = (
          Array.isArray(d.copropriete?.emprunts) ? d.copropriete.emprunts : []
        ).reduce((s: number, e: any) => s + num(e?.capital_restant_du), 0); // emprunt auprès de copropriétaires

        // B) Provisions postérieures rendues exigibles (art. 19-2)
        const B = num(
          d.financier_lot?.sommes_dues_cedant?.provisions_posterieures_exigibles
        );

        // C) Solde créditeur exercice antérieur approuvé non imputé
        const C = num(d.financier_lot?.solde_crediteur_exercice_anterieur);

        const TOTAL = A1 + A2 + A3 + B + C;

        return {
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
              [
                "A1 – avances constituant la réserve (D. art. 35 1°)",
                fmtEur(A1),
              ],
              [
                "A2 – avances nommées provisions (L. art. 18 al. 6 et D. art. 35, 4° et 5°)",
                fmtEur(A2),
              ],
              [
                "A3 – avances (D. art. 45-1, al. 4) – emprunt du syndicat auprès de copropriétaires",
                fmtEur(A3),
              ],
              [
                "Modalités de remboursement des avances",
                d.financier_lot?.avances_provisions?.modalites_remboursement ??
                  "-",
              ],
              // spacer
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
              // spacer
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
        };
      })(),

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
              fmtEur(
                d.financier_lot?.sommes_dues_cedant
                  ?.provisions_budget_previsionnel_exigibles
              ),
            ],
            [
              "Provisions hors budget exigibles",
              fmtEur(
                d.financier_lot?.sommes_dues_cedant
                  ?.provisions_hors_budget_exigibles
              ),
            ],
            [
              "Charges impayées antérieures",
              fmtEur(
                d.financier_lot?.sommes_dues_cedant
                  ?.charges_impayees_anterieures
              ),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 16],
      },

      // Charges avec année_exercice
      { text: "Charges", style: "h3" },
      {
        table: {
          widths: ["*", "auto", "auto"],
          body: [
            ["Exercice", "Courantes", "Hors budget"],
            [
              labelN,
              fmtEur(chargesN?.courantes),
              fmtEur(chargesN?.hors_budget),
            ],
            [
              labelN1,
              fmtEur(chargesN1?.courantes),
              fmtEur(chargesN1?.hors_budget),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 24],
      },

      // Sommes post-vente
      {
        text: "Sommes incombant au nouveau propriétaire pour les lots objets de la future mutation",
        style: "h2",
      },
      { text: "AU SYNDICAT, AU TITRE :", style: "h3", margin: [0, 0, 0, 8] },

      // 1 — Reconstitution des avances
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

      {
        text: "Dans le budget prévisionnel (D. art. 5, 3° b):",
        italics: true,
        margin: [0, 0, 0, 4],
      },
      bpRows.length
        ? {
            table: {
              widths: ["auto", "auto"],
              body: [["Date d’exigibilité", "Montant"], ...bpRows],
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
              body: [["Date d’exigibilité", "Montant"], ...hbRows],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 24],
          }
        : { text: "Aucune", margin: [0, 0, 0, 24] },

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
