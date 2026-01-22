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
  addInfo("ProcÇ¸dure administrative en cours", procedure.enCours);
  addInfo(
    "Type(s) de procÇ¸dure",
    procedure.types,
    procedure.enCours === "Oui",
  );

  const contentieux = data.contentieux ?? {};
  addInfo("Un contentieux est en cours", contentieux.enCours);
  addInfo("Type(s) de contentieux", contentieux.types, contentieux.enCours === "Oui");
  addInfo(
    "PrÇ¸cisions sur le contentieux",
    contentieux.autreDetail,
    Array.isArray(contentieux.types) && contentieux.types.includes("autre"),
  );

  const servitudes = data.servitudes ?? {};
  addInfo("Le bien est grevÇ¸ de servitudes connues", servitudes.existent);
  addInfo("Type(s) de servitudes", servitudes.types, servitudes.existent === "Oui");

  const zonage = data.zonage ?? {};
  addInfo(
    "Le bien est situÇ¸ dans une zone rÇ¸glementÇ¸e",
    zonage.reglemente,
  );
  addInfo(
    "Type de document d'urbanisme",
    zonage.type === "Autre" ? zonage.typeAutre : zonage.type,
    zonage.reglemente === "Oui",
  );

  const travaux = data.travaux ?? {};
  addInfo(
    "Travaux avec impact extÇ¸rieur / urbanistique",
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

    addRow("ArrÇ¦tÇ¸ d'urbanisme", t.arreteExiste);
    addRow("Type d'autorisation", t.arreteType, t.arreteExiste === "Oui");
    addRow(
      "Motif de l'absence d'arrÇ¦tÇ¸",
      t.motifAbsenceArrete,
      t.arreteExiste === "Non",
    );
    addRow("Type de travaux", t.typeTravaux);
    addRow("Travaux achevÇ¸s ?", t.travauxAcheves);
    addRow(
      "Date d'achÇ¦vement prÇ¸vue",
      t.dateAchevement,
      t.travauxAcheves === "Non",
    );
    addRow("Travaux conformes ?", t.travauxNonConformes, t.travauxAcheves === "Oui");
    addRow(
      "Date de dÇ¸p™t de la DAACT",
      t.dateDepotDaact,
      t.arreteExiste === "Oui" &&
        t.travauxNonConformes === "Oui" &&
        t.travauxAcheves !== "Oui",
    );
    addRow("Plans approuvÇ¸s disponibles", t.plansDisponibles, t.arreteExiste === "Oui");

    infoRows.push([label, buildKeyValueSubTable(rows)]);

    addDoc(
      "ArrÇ¦tÇ¸ de permis de construire ou arrÇ¦tÇ¸ de non-opposition Çÿ dÇ¸claration prÇ¸alable",
      t.arreteExiste === "Oui",
    );
    addDoc(t.arreteType ?? "", t.arreteExiste === "Oui" && Boolean(t.arreteType));
    addDoc(
      "AccusÇ¸ de rÇ¸ception ou preuve de dÇ¸p™t de la DAACT",
      t.arreteExiste === "Oui" &&
        t.travauxNonConformes === "Oui" &&
        t.travauxAcheves !== "Oui",
    );
    addDoc(
      "DAACT (dÇ¸claration attestant l'achÇ¦vement et la conformitÇ¸ des travaux)",
      t.arreteExiste === "Oui" &&
        t.travauxNonConformes === "Oui" &&
        t.travauxAcheves !== "Oui",
    );
    addDoc(
      "Plans approuvÇ¸s",
      t.arreteExiste === "Oui" && t.plansDisponibles === false,
    );
  });

  const cadastre = data.cadastre ?? {};
  addInfo("Section cadastrale", cadastre.section);
  addInfo("NumÇ¸ro de parcelle", cadastre.parcelle);
  addInfo("Superficie cadastrale (mý)", cadastre.superficie);
  addInfo("Plan cadastral disponible", cadastre.planDisponible);

  addDoc("Extrait ou plan cadastral du bien", cadastre.planDisponible === "Oui");
  if (Array.isArray(servitudes.types) && servitudes.types.length) {
    addDoc("Justificatif ou plan disponible");
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
    title: "Urbanisme & travaux extÇ¸rieurs",
    subtitle: "Autorisation d'urbanisme et travaux extÇ¸rieurs",
    infoTitle: "Informations fournies",
    docsTitle,
    metadataTitle: "",
    generatedOnLabel: "GÇ¸nÇ¸rÇ¸ le",
    emptyDocsText: "",
    note: "Checklist indicative, sous rÇ¸serve de demandes spÇ¸cifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
