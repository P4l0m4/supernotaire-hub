import { fmtEur } from "@/utils/docDefinitions/formatters";

import type { ValuationResult } from "@/utils/calculateDVF";
import type { ValeurFonciere } from "@/utils/types/valeur-fonciere";

export function buildDocDefinition(
  formData: ValeurFonciere,
  valuation: ValuationResult,
  logoBase64: string
) {
  if (!valuation) return;

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoSupernotaire: logoBase64,
    },
    content: [
      {
        text: "Estimation de la valeur foncière",
        style: "h1",
        margin: [0, 0, 0, 8],
      },
      {
        text: `${formData.configuration.type_local} situé au`,
        italics: true,
        margin: [0, 0, 0, 4],
      },
      {
        text: `${formData.adresse.properties.label}`,
        style: "h2",
        margin: [0, 0, 0, 24],
      },
      {
        columns: [
          [
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    "Valeur du bien seul",
                    `${fmtEur(Math.round(valuation.estimatedValue ?? 0))}` ||
                      "N/A",
                  ],
                  [
                    "Valeur de base hors décote/surcote",
                    `${fmtEur(Math.round(valuation.marketValue ?? 0))}` ||
                      "N/A",
                  ],
                  [
                    "Prix moyen/m² dans le secteur",
                    `${fmtEur(Math.round(valuation.avgPricePerSqm ?? 0))}` ||
                      "N/A",
                  ],

                  // if type_local = maison && landValue, show :
                  ...(formData.configuration.type_local === "Maison" &&
                  valuation.landValue
                    ? [
                        [
                          "Valeur du terrain seul",
                          `${fmtEur(Math.round(valuation.landValue ?? 0))}` ||
                            "N/A",
                        ],
                        [
                          "Prix terrain moyen/m² dans le secteur",
                          `${fmtEur(
                            Math.round(valuation.avgLandPricePerSqm ?? 0)
                          )}` || "N/A",
                        ],
                        [
                          "Valeur du bien + terrain",
                          `${fmtEur(
                            Math.round(
                              (valuation.estimatedValue ?? 0) +
                                (valuation.landValue ?? 0)
                            )
                          )}` || "N/A",
                        ],
                      ]
                    : []),
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
        ],
        margin: [0, 0, 0, 24],
      },

      {
        text: "Décotes/surcotes appliquées sur la valeur de base",
        style: "h2",
      },
      {
        text: "Selon les informations renseignées",
        style: "h3",
        margin: [0, 0, 0, 8],
      },
      {
        columns: [
          [
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    "Travaux éventuels",
                    `${valuation.factors.renovation}%` || "N/A",
                  ],
                  ["DPE", `${valuation.factors.dpe}%` || "N/A"],
                  [
                    "Proximité centre-ville",
                    `${valuation.factors.downtown}%` || "N/A",
                  ],
                  ["Bonus", `${valuation.factors.bonus}%` || "N/A"],
                  ["Malus", `${valuation.factors.malus}%` || "N/A"],
                  [
                    "Rez-de-chaussée",
                    `${valuation.factors.groundFloor}%` || "N/A",
                  ],
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
        ],
        margin: [0, 0, 0, 24],
      },

      {
        text: "Récapitulatif des informations fournies",
        style: "h2",
        margin: [0, 0, 0, 16],
      },
      {
        text: "Dimensions du bien",
        style: "h3",
        margin: [0, 0, 0, 8],
      },
      {
        columns: [
          [
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    "Surface batie réelle",
                    `${formData.dimensions.surface} m²` || "N/A",
                  ],
                  [
                    "Surface habitable loi Carrez",
                    `${formData.dimensions.surface_habitable} m²` || "N/A",
                  ],
                  [
                    "Nombre de pièces",
                    `${formData.dimensions.pieces}` || "N/A",
                  ],
                  [
                    "Surface terrain",
                    `${formData.dimensions.terrain} m²` || "N/A",
                  ],
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
        ],
        margin: [0, 0, 0, 24],
      },

      {
        text: "Configuration du bien",
        style: "h3",
        margin: [0, 0, 0, 8],
      },
      {
        columns: [
          [
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    "Type de bien",
                    `${formData.configuration.type_local}` || "N/A",
                  ],

                  [
                    "Bonus éventuels",
                    `${(formData.configuration?.bonus ?? []).join(", ")}` ||
                      "N/A",
                  ],
                  [
                    "Malus éventuels",
                    `${(formData.configuration?.malus ?? []).join(", ")}` ||
                      "N/A",
                  ],
                  [
                    "Rez-de-chaussée",
                    formData.configuration.rdc ? "Oui" : "Non",
                  ],
                  [
                    "Proximité centre-ville",
                    formData.is_downtown ? "Oui" : "Non",
                  ],
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
        ],
        margin: [0, 0, 0, 24],
      },

      {
        text: "Etat du bien",
        style: "h3",
        margin: [0, 0, 0, 8],
      },
      {
        columns: [
          [
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    "Année de construction",
                    `${formData.etat.annee_construction}` || "N/A",
                  ],
                  //current year - annee_construction
                  [
                    "Ancienneté du bien",
                    `${
                      new Date().getFullYear() -
                      Number(formData.etat.annee_construction)
                    } an(s)` || "N/A",
                  ],
                  [
                    "Intensité des travaux à prévoir *",
                    `${formData.etat.travaux}` || "N/A",
                  ],
                  ["DPE", `${formData.etat.dpe}` || "N/A"],
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
        ],
        margin: [0, 0, 0, 8],
      },
      {
        text: "*0 = Pas de travaux, 1 = Rafraîchissement léger (peintures, sols…), 2 = Rénovation partielle (cuisine / SDB, électricité partielle…), 3 = Grosse rénovation (restructuration, copro travaux…)",
        italics: true,
        margin: [0, 0, 0, 24],
      },

      // Meta / Sources
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
        text: `Estimation basée sur les ${valuation.records.length} dernières mutations répertoriées au registre officiel des transactions immobilières (DVF) dans le secteur défini. Sous réserves de la validité des informations fournies.`,
        italics: true,
        margin: [0, 8, 0, 0],
      },
      {
        text: `Si votre estimation se base sur moins de 10 transactions, sa fiabilité peut être impactée.`,
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
