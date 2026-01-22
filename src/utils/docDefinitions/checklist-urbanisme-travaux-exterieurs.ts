import type { ChecklistUrbanismeTravauxExterieurs } from "@/types/checklist-urbanisme-travaux-exterieurs";
import { formatChecklistValue as val } from "./formatters";
import {
  buildChecklistPdfStructure,
  buildKeyValueSubTable,
} from "./pdfStructure";
import type { TableCell } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistUrbanismeTravauxExterieurs,
  logoBase64: string,
) {
  if (!data) return;

  const infoRows: TableCell[][] = [];
  const docsSet = new Set<string>();

  const addInfo = (label: string, value: unknown, when = true) => {
    if (!when) return;
    infoRows.push([label, val(value)]);
  };

  const addDoc = (label: string, when = true) => {
    if (!when) return;
    docsSet.add(label);
  };

  const procedure = data.procedure ?? {};
  addInfo("Procédure administrative en cours", procedure.enCours);
  addInfo("Type(s) de procédure", procedure.types, procedure.enCours === "Oui");

  const contentieux = data.contentieux ?? {};
  addInfo("Un contentieux est en cours", contentieux.enCours);
  addInfo(
    "Type(s) de contentieux",
    contentieux.types,
    contentieux.enCours === "Oui",
  );
  addInfo(
    "Précisions sur le contentieux",
    contentieux.autreDetail,
    Array.isArray(contentieux.types) && contentieux.types.includes("autre"),
  );

  const servitudes = data.servitudes ?? {};
  addInfo("Le bien est grevé de servitudes connues", servitudes.existent);
  addInfo(
    "Type(s) de servitudes",
    servitudes.types,
    servitudes.existent === "Oui",
  );

  const zonage = data.zonage ?? {};
  addInfo("Le bien est situé dans une zone réglementée", zonage.reglemente);
  addInfo(
    "Type de document d'urbanisme",
    zonage.type === "Autre" ? zonage.typeAutre : zonage.type,
    zonage.reglemente === "Oui",
  );

  const travaux = data.travaux ?? {};
  addInfo(
    "Travaux avec impact extérieur / urbanistique",
    travaux.impactExterieur,
  );

  const details = Array.isArray(travaux.details) ? travaux.details : [];
  details.forEach((t, idx) => {
    const label = `Travaux ${idx + 1}`;
    const rows: Array<[string, TableCell]> = [];
    const addRow = (rowLabel: string, value: unknown, when = true) => {
      if (!when) return;
      rows.push([rowLabel, val(value)]);
    };

    addRow("Arrêté d'urbanisme", t.arreteExiste);
    addRow("Type d'autorisation", t.arreteType, t.arreteExiste === "Oui");
    addRow(
      "Motif de l'absence d'arrêté",
      t.motifAbsenceArrete,
      t.arreteExiste === "Non",
    );
    addRow("Type de travaux", t.typeTravaux);
    addRow("Travaux achevés", t.travauxAcheves);
    addRow(
      "Date d'achèvement prévue",
      t.dateAchevement,
      t.travauxAcheves === "Non",
    );
    addRow(
      "Travaux conformes",
      t.travauxNonConformes,
      t.travauxAcheves === "Oui",
    );
    addRow(
      "Date de dépôt de la DAACT",
      t.dateDepotDaact,
      t.arreteExiste === "Oui" &&
        t.travauxNonConformes === "Oui" &&
        t.travauxAcheves !== "Oui",
    );
    addRow(
      "Plans approuvés disponibles",
      t.plansDisponibles,
      t.arreteExiste === "Oui",
    );

    infoRows.push([label, buildKeyValueSubTable(rows)]);

    addDoc(
      "Arrêté de permis de construire ou arrêté de non-opposition à déclaration préalable",
      t.arreteExiste === "Oui",
    );
    addDoc(
      t.arreteType ?? "",
      t.arreteExiste === "Oui" && Boolean(t.arreteType),
    );
    addDoc(
      "Accusé de réception ou preuve de dépôt de la DAACT",
      t.arreteExiste === "Oui" &&
        t.travauxNonConformes === "Oui" &&
        t.travauxAcheves !== "Oui",
    );
    addDoc(
      "DAACT (déclaration attestant l'achèvement et la conformité des travaux)",
      t.arreteExiste === "Oui" &&
        t.travauxNonConformes === "Oui" &&
        t.travauxAcheves !== "Oui",
    );
    addDoc(
      "Plans approuvés",
      t.arreteExiste === "Oui" && t.plansDisponibles === false,
    );
  });

  const cadastre = data.cadastre ?? {};
  addInfo("Section cadastrale", cadastre.section);
  addInfo("Numéro de parcelle", cadastre.parcelle);
  addInfo("Superficie cadastrale (m²)", cadastre.superficie);
  addInfo("Plan cadastral disponible", cadastre.planDisponible);

  addDoc(
    "Extrait ou plan cadastral du bien",
    cadastre.planDisponible === "Oui",
  );
  if (Array.isArray(servitudes.types) && servitudes.types.length) {
    addDoc("Justificatif ou plan disponible");
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
    title: "Urbanisme & travaux extérieurs",
    subtitle: "Autorisation d'urbanisme et travaux extérieurs",
    infoTitle: "Informations fournies",
    docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Généré le",
    emptyDocsText: "",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
