import type { ChecklistSituationFiscale } from "@/types/checklist-situation-fiscale";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistSituationFiscale,
  logoBase64: string,
) {
  if (!data) return;

  const docsSet = new Set<string>();
  const infoRows: Array<[string, string]> = [];

  const formatLocation = (loc: unknown) => {
    if (!loc) return "";
    if (typeof loc === "string") return loc;
    const anyVal = loc as any;
    return anyVal?.label || anyVal?.value || anyVal?.properties?.label || "";
  };

  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docsSet.add(label);
  };

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    infoRows.push([label, val(value)]);
  };

  const situation = data.situation_fiscale ?? {};
  const typeProprio = situation.type_proprietaire;

  addInfo("Type de propriétaire", typeProprio);

  // Personne physique
  addInfo(
    "Propriétaire imposé ?",
    situation.proprietaire_impose,
    typeProprio === "Personne physique",
  );
  addInfo(
    "Assujetti à l'IFI ?",
    situation.assujetti_ifi,
    typeProprio === "Personne physique",
  );
  addInfo(
    "Avis d'impôt sur le revenu disponible",
    situation.avis_impot_revenu_disponible,
    typeProprio === "Personne physique",
  );
  addInfo(
    "Numéro fiscal français ?",
    situation.numero_fiscal_francais,
    typeProprio === "Personne physique",
  );
  addInfo(
    "Numéro fiscal",
    situation.numero_fiscal,
    situation.numero_fiscal_francais === "Oui",
  );
  addInfo(
    "Lieu d'imposition",
    situation.lieu_imposition,
    situation.proprietaire_impose === "Oui",
  );
  addInfo(
    "Adresse du lieu d'imposition",
    formatLocation(situation.adresse_lieu_imposition),
    situation.lieu_imposition === "En France" ||
      situation.lieu_imposition === "En France et à l'étranger",
  );
  addInfo(
    "Résidence fiscale",
    situation.residence_fiscale_personne_physique?.statut,
    typeProprio === "Personne physique",
  );
  addInfo(
    "Pays de résidence fiscale étrangère",
    situation.residence_fiscale_personne_physique?.pays_etranger,
    typeProprio === "Personne physique" &&
      situation.residence_fiscale_personne_physique?.statut === "A l'étranger",
  );
  addInfo(
    "NIF étranger",
    situation.residence_fiscale_personne_physique?.nif_etranger,
    typeProprio === "Personne physique" &&
      situation.residence_fiscale_personne_physique?.statut === "A l'étranger",
  );

  // Personne morale
  addInfo("Type d'entité", situation.type_entite, typeProprio === "Personne morale");
  addInfo(
    "Entité imposée en France",
    situation.entite_imposee_en_france,
    typeProprio === "Personne morale",
  );
  addInfo(
    "Bien inscrit à l'actif de l'entité",
    situation.bien_inscrit_actif_entite,
    typeProprio === "Personne morale",
  );
  addInfo(
    "Régime d'imposition (société)",
    situation.regime_imposition_entite,
    typeProprio === "Personne morale" &&
      situation.type_entite === "Société : SARL, SAS, SCI, etc.",
  );
  addInfo(
    "Régime d'imposition (association)",
    situation.regime_imposition_association,
    typeProprio === "Personne morale" &&
      situation.type_entite === "Association",
  );

  // Champs communs
  addInfo(
    "Pays de résidence fiscale",
    situation.residence_fiscale?.pays,
    Boolean(situation.residence_fiscale?.pays),
  );

  addDoc(
    "Dernier avis d'impôt sur le revenu",
    situation.avis_impot_revenu_disponible === "Oui",
  );
  addDoc("Dernier avis d'IFI", situation.assujetti_ifi === "Oui");
  addDoc(
    "Certificat de résidence fiscale",
    situation.residence_fiscale_personne_physique?.statut === "A l'étranger",
  );
  addDoc(
    "Dernier avis d'imposition IS",
    situation.regime_imposition_entite === "Impôt sur les sociétés (IS)" ||
      situation.regime_imposition_association ===
        "Soumise à l'impôt sur les sociétés (IS)",
  );
  addDoc(
    "Justificatif de régime fiscal",
    situation.regime_imposition_association ===
      "Lucrative ou fiscalisée partiellement" ||
      situation.regime_imposition_association ===
        "Soumise à l'impôt sur les sociétés (IS)",
  );

  const docs = Array.from(docsSet);
  const infoBody = [
    ["Questions", "Réponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];

  const docsTitle =
    docs.length === 0
      ? "Aucun document à joindre pour cette rubrique"
      : "Transmettez ces documents à votre notaire";

  return buildChecklistPdfStructure({
    title: "Situation fiscale",
    subtitle: "Imposition, résidence et fiscalité",
    infoTitle: "Informations fournies",
    docsTitle: docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Généré le",
    emptyDocsText: "",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs: Array.from(docs),
    logoBase64,
  });
}
