import type { ChecklistOccupationActuelle } from "@/types/checklist-occupation-actuelle";
import { formatChecklistValue as val } from "@/utils/docDefinitions/formatters";
import { buildChecklistPdfStructure } from "@/utils/docDefinitions/pdfStructure";

export function buildDocDefinition(
  data: ChecklistOccupationActuelle,
  logoBase64: string
) {
  if (!data) return;

  const rows: Array<[string, string]> = [];
  const docs = new Set<string>();

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    rows.push([label, val(value)]);
  };
  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docs.add(label);
  };

  addInfo("Bien occupe actuellement", data.bien_occupe);
  addInfo(
    "Bien libre au moment de la vente",
    data.bien_libre_moment_vente,
    data.bien_occupe === false
  );
  addInfo(
    "Date estimee de liberation",
    data.date_liberation,
    data.bien_occupe === false && data.bien_libre_moment_vente === false
  );

  addInfo("Occupe par", data.par_qui, data.bien_occupe === true);

  addInfo(
    "Nom complet de l'occupant",
    data.occupant_gratuit_nom,
    data.par_qui === "Occupant gratuit"
  );
  addDoc(
    "Convention d'occupation a titre gratuit ou attestation sur l'honneur du vendeur",
    data.par_qui === "Occupant gratuit"
  );

  addInfo(
    "Nature de l'occupation",
    data.nature_occupation,
    data.par_qui === "Proprietaire vendeur"
  );

  addDoc(
    "Convention d'indivision ou accord ecrit",
    data.par_qui === "Indivisaire"
  );

  addInfo(
    "Procedure en cours (occupation sans droit ni titre)",
    data.procedure_en_cours,
    data.par_qui === "Squatteur"
  );
  addDoc(
    "Document de procedure deja emis (si disponible)",
    data.par_qui === "Squatteur" && data.procedure_en_cours === true
  );

  addInfo("Type de bail", data.type_bail, data.par_qui === "Locataire");
  addInfo(
    "Precisions bail",
    data.bail_autre_precisions,
    data.par_qui === "Locataire" && data.type_bail === "Autre"
  );
  addDoc("Copie du bail", data.par_qui === "Locataire");
  addDoc(
    "Dernier avis d'echeance ou quittance de loyer",
    data.par_qui === "Locataire"
  );
  addDoc(
    "Etat des lieux d'entree (si disponible)",
    data.par_qui === "Locataire"
  );

  const infoBody = [
    ["Information", "Reponse"],
    ...(rows.length ? rows : [["Informations", "-"]]),
  ];

  return buildChecklistPdfStructure({
    title: "Occupation actuelle du bien",
    subtitle: "Situation d'occupation du bien et pieces associees",
    infoTitle: "Informations a fournir",
    docsTitle: "Documents a fournir",
    metadataTitle: "Metadonnees",
    generatedOnLabel: "Genere le",
    emptyDocsText: "Aucun document supplementaire.",
    note: "Checklist indicative, sous reserve de demandes specifiques du notaire.",
    infoBody,
    docs: Array.from(docs),
    logoBase64,
  });
}


