import type { ChecklistUrbanismeTravauxExterieurs } from "@/types/checklist-urbanisme-travaux-exterieurs";
import { formatChecklistValue as val } from "./formatters";
import {
  buildChecklistPdfStructure,
  buildKeyValueSubTable,
} from "./pdfStructure";
import type { TableCell } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistUrbanismeTravauxExterieurs,
  logoBase64: string
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

  const travaux = data.travaux ?? {};
  addInfo(
    "Travaux avec impact exterieur / urbanistique",
    travaux.impactExterieur === true ? "Oui" : "Non"
  );

  const details = Array.isArray(travaux.details) ? travaux.details : [];
  details.forEach((t, idx) => {
    const label = `Travaux ${idx + 1}`;
    const arreteState =
      t.arreteExiste === false
        ? "Oui (arrete existant)"
        : t.arreteExiste === true
        ? "Non (aucun arrete)"
        : "-";
    const travauxEtat =
      t.travauxAcheves == null
        ? "-"
        : t.travauxAcheves
        ? "Travaux non-acheves"
        : "Travaux termines";
    const plansEtat =
      t.plansDisponibles == null
        ? "-"
        : t.plansDisponibles
        ? "Plans approuves non disponibles"
        : "Plans approuves disponibles";

    const rows: Array<[string, TableCell]> = [];
    const addRow = (rowLabel: string, value: unknown, when = true) => {
      if (!when) return;
      rows.push([rowLabel, val(value)]);
    };

    rows.push(["Arrete d'urbanisme", arreteState]);
    addRow("Type d'autorisation", t.arreteType, t.arreteExiste === false);
    addRow("Type de travaux", t.typeTravaux);
    rows.push(["Etat", travauxEtat]);
    addRow("Date d'achevement prevue", t.dateAchevement, t.travauxAcheves === true);
    addRow(
      "Travaux non conformes",
      t.travauxNonConformes,
      t.travauxNonConformes !== undefined
    );
    addRow("Plans approuves", plansEtat, t.arreteExiste === false);
    addRow("Travaux acheves", travauxEtat, t.arreteExiste === false);
    addRow(
      "Date de depot DAACT",
      t.dateDepotDaact,
      t.arreteExiste === false &&
        t.travauxNonConformes === false &&
        t.travauxAcheves !== true
    );
    addRow(
      "Plans approuves disponibles",
      t.plansDisponibles,
      t.arreteExiste === false
    );
    addRow(
      "Motif absence arrete",
      t.motifAbsenceArrete,
      t.arreteExiste === true
    );
    infoRows.push([label, buildKeyValueSubTable(rows)]);

    addDoc(
      "Arrete de permis de construire ou arrete de non-opposition a declaration prealable",
      t.arreteExiste === false
    );
    addDoc(
      t.arreteType ?? "",
      t.arreteExiste === false && Boolean(t.arreteType)
    );
    addDoc(
      "Accuse de reception ou preuve de depot de la DAACT",
      t.arreteExiste === false &&
        t.travauxNonConformes === false &&
        t.travauxAcheves !== true
    );
    addDoc(
      "DAACT (declaration attestant l'achevement et la conformite des travaux)",
      t.arreteExiste === false &&
        t.travauxNonConformes === false &&
        t.travauxAcheves !== true
    );
    addDoc(
      "Plans approuves",
      t.arreteExiste === false && t.plansDisponibles === false
    );
  });

  const cadastre = data.cadastre ?? {};
  addInfo("Section cadastrale", cadastre.section);
  addInfo("Numero de parcelle", cadastre.parcelle);
  addInfo("Superficie cadastrale (m2)", cadastre.superficie);
  addInfo(
    "Plan cadastral disponible",
    cadastre.planDisponible === true ? "Oui" : "Non"
  );

  addDoc("Extrait ou plan cadastral du bien", cadastre.planDisponible === true);

  const servitudes = data.servitudes ?? {};
  const servitudeTypes: string[] = Array.isArray(servitudes.types)
    ? servitudes.types
    : [];
  addInfo("Le bien est greve de servitudes connues", servitudes.existent);
  addInfo(
    "Type(s) de servitudes",
    servitudeTypes,
    servitudes.existent === true
  );
  const zonage = data.zonage ?? {};
  addInfo(
    "Le bien est situe dans une zone reglementee par un document d'urbanisme",
    zonage.reglemente
  );
  addInfo(
    "Type de document d'urbanisme",
    zonage.type === "Autre" ? zonage.typeAutre : zonage.type,
    zonage.reglemente === true
  );
  addInfo("Un contentieux est en cours", data.contentieux?.enCours);
  addInfo(
    "Type(s) de contentieux",
    data.contentieux?.types,
    data.contentieux?.enCours === true
  );
  addInfo(
    "Precisions sur le contentieux",
    data.contentieux?.autreDetail,
    Array.isArray(data.contentieux?.types) &&
      data.contentieux?.types?.includes("autre")
  );

  if (servitudeTypes.length) {
    addDoc("Justificatif ou plan disponible");
  }

  const docs = Array.from(docsSet);
  const infoBody = [
    ["Questions", "Reponses"],
    ...(infoRows.length ? infoRows : [["Questions", "-"]]),
  ];

  const docsTitle =
    docs.length === 0
      ? "Aucun document a joindre pour cette rubrique"
      : "Transmettez ces documents a votre notaire";

  return buildChecklistPdfStructure({
    title: "Urbanisme & travaux exterieurs",
    subtitle: "Autorisation d'urbanisme et travaux exterieurs",
    infoTitle: "Informations fournies",
    docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Genere le",
    emptyDocsText: "",
    note: "Checklist indicative, sous reserve de demandes specifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
