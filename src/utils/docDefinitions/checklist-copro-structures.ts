import type { ChecklistCoproStructures } from "@/types/checklist-copro-structures";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistCoproStructures,
  logoBase64: string,
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

  const structureType = data.type_structure_collective;
  const isCopro = structureType === "D'une copropriété";
  const isAsl = structureType === "D'une association syndicale (ASL / AFUL.)";
  const lots = data.copro_lots_inclus_vente || [];

  addInfo("Structure collective", structureType);
  addInfo("Type de copropriété", data.type_copropriete, isCopro);
  addInfo(
    "Montant annuel moyen des charges",
    data.montant_annuel_charges,
    isCopro,
  );
  addInfo("Fonds de travaux", data.copro_fond_travaux, isCopro);
  addInfo(
    "Quote-part attachée au lot",
    data.copro_quote_part_lot,
    data.copro_fond_travaux === "Oui",
  );
  addInfo("Charges à jour", data.copro_charges_a_jour, isCopro);
  addInfo(
    "Montant approximatif des sommes dues",
    data.montant_sommes_dues,
    data.copro_charges_a_jour === "Non",
  );
  addInfo(
    "Lots inclus dans la vente",
    lots.join(", "),
    isCopro && lots.length > 0,
  );
  addInfo(
    "Précision lot annexe",
    data.copro_precision_autre_lot,
    lots.includes("Autre lot annexe"),
  );
  addInfo("Gestion de la copropriété", data.gestion_copropriete, isCopro);
  addInfo("Email du syndic", data.email_syndic, Boolean(data.email_syndic));
  addInfo("Numéro du syndic", data.tel_syndic, Boolean(data.tel_syndic));

  addInfo(
    "Type de structure (ASL/AFUL)",
    data.type_association_syndicale,
    isAsl,
  );
  addInfo("Cotisations à jour", data.asl_cotisations_a_jour, isAsl);
  addInfo("Email du gestionnaire", data.email_asl, Boolean(data.email_asl));
  addInfo(
    "Téléphone du gestionnaire",
    data.telephone_asl,
    Boolean(data.telephone_asl),
  );
  addInfo(
    "Précision type de structure",
    data.precision_type_structure,
    data.type_association_syndicale === "Autre",
  );

  // Documents copro
  addDoc("Fiche synthétique de la copropriété (si disponible)", isCopro);
  addDoc("Carnet d'entretien de l'immeuble", isCopro);
  addDoc("Règlement de copropriété", isCopro);
  addDoc("État descriptif de la division", isCopro);
  addDoc("Dernier procès-verbal d'AG", isCopro);
  addDoc("Procès-verbal d'AG N-1", isCopro);
  addDoc("Procès-verbal d'AG N-2", isCopro);
  addDoc("Pré-état daté", isCopro);
  addDoc("Dernier appel de charges", isCopro);
  addDoc("Dernier relevé de charges", isCopro);

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
