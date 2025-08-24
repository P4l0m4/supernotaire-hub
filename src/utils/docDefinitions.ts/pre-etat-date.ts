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

  const sommesAcq = (
    d.financier_lot?.sommes_a_la_charge_acquereur_post_vente ?? []
  ).map((s) => [s.decision_ag ?? "-", fmtEur(s.montant)]);

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoSupernotaire: logoBase64,
    },
    content: [
      { text: "Pré-état daté", style: "h1", margin: [0, 0, 0, 8] },

      // En-tête lots + identification précise
      { text: "Bien / Lots", style: "h2" },
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
        margin: [0, 0, 0, 8],
      },

      // Copropriété (+ date d’arrêté visible)
      { text: "Copropriété", style: "h2" },
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
        margin: [0, 0, 0, 8],
      },

      // Procédures
      { text: "Procédures en cours", style: "h3" },
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
            margin: [0, 0, 0, 8],
          }
        : { text: "Aucun", margin: [0, 0, 0, 8] },

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
        margin: [0, 0, 0, 8],
      },

      // AG
      { text: "Dernière AG", style: "h2" },
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
            margin: [0, 0, 0, 8],
          }
        : { text: "Aucun", margin: [0, 0, 0, 8] },

      // Lot – Financier (+ date d’arrêté visible)
      { text: "Situation financière du lot", style: "h2" },
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
            [
              "Avance générale (art. 45-1)",
              fmtEur(d.financier_lot?.avances_provisions?.generale),
            ],
            [
              "Provision travaux (art. 14-2)",
              fmtEur(d.financier_lot?.avances_provisions?.travaux),
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 6],
      },
      { text: "Échéances à venir", style: "h3" },
      echeances.length
        ? {
            table: {
              widths: ["auto", "auto"],
              body: [["Date", "Montant"], ...echeances],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 8],
          }
        : { text: "Aucune", margin: [0, 0, 0, 8] },

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
        margin: [0, 0, 0, 8],
      },

      // Sommes post-vente
      { text: "Sommes à la charge de l’acquéreur après vente", style: "h3" },
      sommesAcq.length
        ? {
            table: {
              widths: ["*", "auto"],
              body: [["Décision d’AG", "Montant"], ...sommesAcq],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 8],
          }
        : { text: "Aucune", margin: [0, 0, 0, 8] },

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
      h2: { fontSize: 13, bold: true, margin: [0, 10, 0, 6] },
      h3: { fontSize: 11, bold: true, margin: [0, 6, 0, 4] },
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
            text: "Généré sur Supernotaire.fr, la plateforme qui facilite les ventes immobilières.",
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
