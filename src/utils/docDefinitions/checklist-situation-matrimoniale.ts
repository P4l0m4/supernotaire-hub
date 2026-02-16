import type { ChecklistSituationMatrimoniale } from "@/types/checklist-situation-matrimoniale";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistSituationMatrimoniale,
  logoBase64: string,
) {
  if (!data) return;

  const docsSet = new Set<string>();
  const infoRows: Array<[string, string]> = [];

  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docsSet.add(label);
  };

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    infoRows.push([label, val(value)]);
  };

  const situation = data.situation_matrimoniale ?? {};
  addInfo("Situation matrimoniale", situation.statut);

  if (situation.statut === "Célibataire / Concubin(e) / Union libre") {
    addInfo("Nationalité étrangère", situation.celibataire?.etranger);
    addDoc("Certificat de célibat", situation.celibataire?.etranger === "Oui");
    addDoc("Certificat de coutume", situation.celibataire?.etranger === "Oui");
  }

  if (situation.statut === "Marié(e) (communauté)") {
    addDoc("Copie intégrale de l'acte de mariage < 3 mois");
    addDoc("Pièce d'identité du conjoint (CNI, titre de séjour ou passeport)");
    addDoc("Livret de famille");
  }

  if (situation.statut === "Marié(e) (contrat spécifique)") {
    addDoc("Copie intégrale de l'acte de mariage < 3 mois");
    addDoc("Copie authentique du contrat de mariage");
    addDoc("Livret de famille");
    addDoc("Pièce d'identité du conjoint (CNI, titre de séjour ou passeport)");
  }

  if (situation.statut === "Pacsé(e)") {
    addDoc("Attestation d'enregistrement PACS");
    addDoc("Pièce d'identité du conjoint (CNI, titre de séjour ou passeport)");
    addDoc("Convention de PACS");
  }

  if (situation.statut === "Divorcé(e) (non remarié(e))") {
    addDoc("Jugement de divorce définitif avec certificat de non-appel");
    addDoc("Extrait ou copie intégrale de l'acte de mariage mis à jour");
  }

  if (situation.statut === "Dissolution PACS") {
    addDoc(
      "Ordonnance de dissolution avec formule exécutoire avec certificat de non-appel",
    );
    addDoc("Attestation d'enregistrement de dissolution");
  }

  if (situation.statut === "Veuf / Veuve") {
    addDoc("Acte de décès du conjoint");
    addDoc("Extrait d'acte de mariage portant la mention du décès");
  }

  if (
    situation.statut ===
    "Séparé de corps (mariés mais autorisés à vivre séparément)"
  ) {
    addInfo("Contrat de mariage", situation.separe_de_corps?.contrat_mariage);
    addDoc("Jugement de séparation de corps exécutoire");
    addDoc(
      "Copie authentique du contrat de mariage",
      situation.separe_de_corps?.contrat_mariage === "Oui",
    );
  }

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
    title: "Situation matrimoniale",
    subtitle: "Régime matrimonial, protection du conjoint et gestion des biens",
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
