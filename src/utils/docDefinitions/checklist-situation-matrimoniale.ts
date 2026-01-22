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

  if (situation.statut === "CÇ¸libataire / Concubin(e) / Union libre") {
    addInfo("NationalitÇ¸ Ç¸trangÇùre", situation.celibataire?.etranger);
    addDoc("Certificat de cÇ¸libat", situation.celibataire?.etranger === "Oui");
    addDoc("Certificat de coutume", situation.celibataire?.etranger === "Non");
  }

  if (situation.statut === "MariÇ¸(e) (communautÇ¸)") {
    addDoc("Copie intÇ¸grale de l'acte de mariage < 3 mois");
    addDoc("PiÇùce d'identitÇ¸ du conjoint (CNI, titre de sÇ¸jour ou passeport)");
    addDoc("Livret de famille");
  }

  if (situation.statut === "MariÇ¸(e) (contrat spÇ¸cifique)") {
    addDoc("Copie intÇ¸grale de l'acte de mariage < 3 mois");
    addDoc("Copie authentique du contrat de mariage");
    addDoc("Livret de famille");
    addDoc("PiÇùce d'identitÇ¸ du conjoint (CNI, titre de sÇ¸jour ou passeport)");
  }

  if (situation.statut === "PacsÇ¸(e)") {
    addDoc("Attestation d'enregistrement PACS");
    addDoc("PiÇùce d'identitÇ¸ du conjoint (CNI, titre de sÇ¸jour ou passeport)");
    addDoc("Convention de PACS");
  }

  if (situation.statut === "DivorcÇ¸(e) (non remariÇ¸(e))") {
    addDoc("Jugement de divorce dÇ¸finitif avec certificat de non-appel");
    addDoc("Extrait ou copie intÇ¸grale de l'acte de mariage mis Çÿ jour");
  }

  if (situation.statut === "Dissolution PACS") {
    addDoc(
      "Ordonnance de dissolution avec formule exÇ¸cutoire avec certificat de non-appel",
    );
    addDoc("Attestation d'enregistrement de dissolution");
  }

  if (situation.statut === "Veuf / Veuve") {
    addDoc("Acte de dÇ¸cÇùs du conjoint");
    addDoc("Extrait d'acte de mariage portant la mention du dÇ¸cÇùs");
  }

  if (
    situation.statut ===
    "SÇ¸parÇ¸ de corps (mariÇ¸s mais autorisÇ¸s Çÿ vivre sÇ¸parÇ¸ment)"
  ) {
    addInfo("Contrat de mariage", situation.separe_de_corps?.contrat_mariage);
    addDoc("Jugement de sÇ¸paration de corps exÇ¸cutoire");
    addDoc(
      "Copie authentique du contrat de mariage",
      situation.separe_de_corps?.contrat_mariage === "Oui",
    );
  }

  const docs = Array.from(docsSet);
  const infoBody = [
    ["Questions", "RÇ¸ponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];
  const docsTitle =
    docs.length === 0
      ? "Aucun document Çÿ joindre pour cette rubrique"
      : "Transmettez ces documents Çÿ votre notaire";

  return buildChecklistPdfStructure({
    title: "Situation matrimoniale",
    subtitle: "Regime matrimonial, protection du conjoint et gestion des biens",
    infoTitle: "Informations fournies",
    docsTitle: docsTitle,
    metadataTitle: "",
    generatedOnLabel: "GÇ¸nÇ¸rÇ¸ le",
    emptyDocsText: "",
    note: "Checklist indicative, sous rÇ¸serve de demandes spÇ¸cifiques du notaire.",
    infoBody,
    docs: Array.from(docs),
    logoBase64,
  });
}
