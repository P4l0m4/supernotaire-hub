import type { ChecklistOccupationActuelle } from "@/types/checklist-occupation-actuelle";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistOccupationActuelle,
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

  const isOccupied = data.bien_occupe === true;
  const notFreeAtSale = data.bien_libre_moment_vente === true;

  addInfo("Bien occupé actuellement", data.bien_occupe);
  addInfo(
    "Bien occupé au moment de la vente",
    data.bien_libre_moment_vente,
    isOccupied
  );
  addInfo(
    "Date estimée de libération",
    data.date_liberation,
    isOccupied && notFreeAtSale
  );

  addInfo("Occupé par", data.par_qui, isOccupied);

  addInfo(
    "Nom complet de l'occupant",
    data.occupant_gratuit_nom,
    data.par_qui === "Un occupant à titre gratuit"
  );
  addDoc(
    "Convention d'occupation à titre gratuit ou attestation sur l'honneur du vendeur",
    data.par_qui === "Un occupant à titre gratuit"
  );

  addInfo(
    "Nature de l'occupation",
    data.nature_occupation,
    data.par_qui === "Le propriétaire vendeur"
  );

  addDoc(
    "Convention d'indivision ou accord écrit",
    data.par_qui === "Un indivisaire (plusieurs propriétaires)"
  );

  addInfo(
    "Procédure en cours (occupation sans droit ni titre)",
    data.procedure_en_cours,
    data.par_qui === "Un squatteur"
  );
  addDoc(
    "Document de procédure déjà émis (si disponible)",
    data.par_qui === "Un squatteur" && data.procedure_en_cours === true
  );

  addInfo("Type de bail", data.type_bail, data.par_qui === "Un locataire");
  addInfo(
    "Précisions bail",
    data.bail_autre_precisions,
    data.par_qui === "Un locataire" && data.type_bail === "Autre"
  );
  addDoc("Copie du bail", data.par_qui === "Un locataire");
  addDoc(
    "Dernier avis d'échéance ou quittance de loyer",
    data.par_qui === "Un locataire"
  );
  addDoc(
    "Etat des lieux d'entrée (si disponible)",
    data.par_qui === "Un locataire"
  );

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
    title: "Occupation actuelle du bien",
    subtitle: "Situation d'occupation du bien et pièces associées",
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
