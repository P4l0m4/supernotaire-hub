import type { ChecklistCoproStructures } from "@/types/checklist-copro-structures";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistCoproStructures,
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

  const isCopro = data.bien_en_copropriete === true;
  const isAsl = data.est_en_asl === true;
  const lots = data.copro_lots_inclus_vente || [];

  addInfo("Bien en copropriété", data.bien_en_copropriete);
  addInfo("Type de copropriété", data.type_copropriete, isCopro);
  addInfo(
    "Montant annuel moyen des charges",
    data.montant_annuel_charges,
    isCopro
  );
  addInfo("Fonds de travaux", data.copro_fond_travaux, isCopro);
  addInfo(
    "Quote-part attachée au lot",
    data.copro_quote_part_lot,
    data.copro_fond_travaux === true
  );
  addInfo("Charges à jour", data.copro_charges_a_jour, isCopro);
  addInfo(
    "Montant des sommes dues",
    data.montant_sommes_dues,
    data.copro_charges_a_jour === true
  );
  addInfo(
    "Lots inclus dans la vente",
    lots.join(", "),
    isCopro && lots.length > 0
  );
  addInfo(
    "Précision lot annexe",
    data.copro_precision_autre_lot,
    lots.includes("Autre lot annexe")
  );
  addInfo("Gestion de la copropriété", data.gestion_copropriete, isCopro);
  addInfo("Email du syndic", data.email_syndic, Boolean(data.email_syndic));
  addInfo("Numéro du syndic", data.tel_syndic, Boolean(data.tel_syndic));

  addInfo("Association syndicale", data.est_en_asl);
  addInfo("Type de structure", data.type_association_syndicale, isAsl);
  addInfo("Cotisations à jour", data.asl_cotisations_a_jour, isAsl);
  addInfo("Email ASL / AFUL", data.email_asl, Boolean(data.email_asl));
  addInfo(
    "Téléphone ASL / AFUL",
    data.telephone_asl,
    Boolean(data.telephone_asl)
  );
  addInfo(
    "Précision type de structure",
    data.precision_type_structure,
    data.type_association_syndicale === "Autre"
  );

  // Documents copro (si en copropriété)
  addDoc("Historique des charges de copropriété (3 dernières années)", isCopro);
  addDoc("Fiche synthétique de la copropriété (si disponible)", isCopro);
  addDoc("Compte-rendu de la dernière AG (PV)", isCopro);
  addDoc("Procès-verbal d’AG N-1", isCopro);
  addDoc("Procès-verbal d’AG N-2", isCopro);
  addDoc("Convocation et ordre du jour de la prochaine AG", isCopro);
  addDoc("Règlement de copropriété et état descriptif de division", isCopro);
  addDoc("Pré-état daté", isCopro);
  addDoc("Carnet d'entretien de l'immeuble", isCopro);
  addDoc(
    "Relevé des charges annuelles (budget prévisionnel et dépenses)",
    isCopro
  );
  addDoc("Dernier relevé de charges", isCopro);
  addDoc("Dernier appel de charges", isCopro);
  addDoc("Mises en demeure / relances de charges éventuelles", isCopro);
  addDoc("Protocole de recouvrement en cours (le cas échéant)", isCopro);
  addDoc(
    "Diagnostics parties communes (DTG, audits énergétiques le cas échéant)",
    isCopro
  );
  addDoc(
    "Devis ou autorisations pour travaux sur parties communes",
    isCopro && data.gestion_copropriete !== "Aucun syndic"
  );
  addDoc("Coordonnées du représentant du syndic / conseil syndical", isCopro);

  // ASL / AFUL
  addDoc("Statuts et règlement intérieur de l'ASL / AFUL", isAsl);
  addDoc("Appels de charges / contributions ASL", isAsl);
  addDoc("Coordonnées de l'administrateur / président de l'ASL", isAsl);

  const infoBody = [
    ["Questions", "Réponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];

  const docs = Array.from(docsSet);

  const docsTitle =
    docs.length === 0
      ? "Aucun document à joindre pour cette rubrique"
      : "Transmettez ces documents à votre notaire";

  return buildChecklistPdfStructure({
    title: "Copropriété & Structures collectives",
    subtitle: "Informations sur la copropriété et la structure de l'immeuble",
    infoTitle: "Informations fournies",
    docsTitle: docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Généré le",
    emptyDocsText: "",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs: Array.from(docsSet),
    logoBase64,
  });
}
