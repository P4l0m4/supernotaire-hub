import type {
  ChecklistIdentiteEtatCivil,
  LieuNaissanceType,
  TypeChangementEtatCivil,
} from "@/types/checklist-identite-etat-civil";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

const TYPE_CHANGEMENT_NOM_DECRET: TypeChangementEtatCivil =
  "Changement de nom par décret";
const LIEU_NAISSANCE_ETRANGER: LieuNaissanceType = "Pays étranger";

export function buildDocDefinition(
  data: ChecklistIdentiteEtatCivil,
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

  const identite = data.identite ?? {};
  const lieu = identite.lieu_naissance ?? {};
  const etatCivil = data.etat_civil ?? {};

  addInfo("Date de naissance", identite.date_naissance);
  addInfo("Nom", identite.nom);
  addInfo("Prénom(s)", identite.prenoms);
  addInfo("Adresse actuelle", identite.adresse_actuelle?.properties?.label);
  addInfo("Lieu de naissance", lieu.type);
  addInfo("Département de naissance", lieu.departement, lieu.type === "France");
  addInfo(
    "Ville de naissance",
    lieu.ville,
    lieu.type === LIEU_NAISSANCE_ETRANGER,
  );
  addInfo(
    "Pays de naissance",
    lieu.pays,
    lieu.type === LIEU_NAISSANCE_ETRANGER,
  );

  addInfo("Changement d'état civil", etatCivil.changement_etat_civil);
  addInfo(
    "Type de changement",
    etatCivil.type_changement,
    etatCivil.changement_etat_civil === "Oui",
  );

  if (etatCivil.type_changement === TYPE_CHANGEMENT_NOM_DECRET) {
    const cn = etatCivil.changement_nom ?? {};
    addInfo(
      "A déjà signé des documents avec un ancien état civil",
      cn.a_signe_ancien_etat_civil,
    );
    addInfo(
      "Ancien nom",
      cn.ancien_nom,
      cn.a_signe_ancien_etat_civil === "Non",
    );
    addInfo(
      "Date du décret ou jugement",
      cn.date_decret_jugement,
      cn.a_signe_ancien_etat_civil === "Non",
    );
    addDoc(
      "Ancien passeport / CNI ou titre de séjour portant l'ancien nom",
      cn.a_signe_ancien_etat_civil === "Oui",
    );
    addDoc("Décret / jugement", cn.a_signe_ancien_etat_civil === "Non");
    addDoc(
      "Publication au Journal Officiel ou attestation mairie",
      cn.a_signe_ancien_etat_civil === "Non",
    );
  }

  if (etatCivil.type_changement === "Mariage") {
    const mariage = etatCivil.mariage ?? {};
    addInfo("Lieu du mariage", mariage.lieu);
    addInfo("Date du mariage", mariage.date);
    addInfo("Nom du conjoint", mariage.nom_conjoint);
    addInfo("Prénom du conjoint", mariage.prenom_conjoint);
    addInfo("Choix d'usage", mariage.choix_usage);
    addDoc("Copie intégrale de l'acte de mariage < 3 mois");
  }

  if (etatCivil.type_changement === "Pacs") {
    addDoc("Attestation d'enregistrement PACS");
  }

  if (etatCivil.type_changement === "Divorce / dissolution PACS") {
    const divorce = etatCivil.divorce ?? {};
    addInfo(
      "Date du jugement ou dissolution",
      divorce.date_jugement_ou_dissolution,
    );
    addInfo("Nom de l'ex-conjoint / partenaire", divorce.nom_ex_conjoint);
    addDoc(
      "Jugement de divorce (ou acte de dissolution PACS si partenariat contractuel)",
    );
    addDoc("Extrait d'acte de naissance mis à jour");
    addDoc("Copie du livret de famille");
  }

  if (etatCivil.type_changement === "Veuvage") {
    const veuvage = etatCivil.veuvage ?? {};
    addInfo("Date du décès du conjoint", veuvage.date_deces_conjoint);
    addInfo("Lieu du décès du conjoint", veuvage.lieu_deces_conjoint);
    addDoc("Acte de décès du conjoint");
    addDoc("Extrait d'acte de mariage portant mention du décès");
  }

  if (etatCivil.type_changement === "Rectification de genre") {
    const rectif = etatCivil.rectification_genre ?? {};
    addInfo("Date de la décision", rectif.date_decision);
    addInfo("Tribunal de la décision", rectif.tribunal_decision);
    addInfo(
      "A déjà signé des documents avec un ancien état civil",
      rectif.a_signe_ancien_etat_civil,
    );
    addDoc("Jugement");
    addDoc(
      "Ancien passeport / CNI ou titre de séjour portant l'ancien nom",
      rectif.a_signe_ancien_etat_civil === "Oui",
    );
  }

  addDoc("Pièce d'identité (CNI, titre de séjour ou passeport)");
  addDoc("Acte de naissance intégral < 3 mois");
  addDoc("Justificatif de domicile < 3 mois");

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
    title: "Identité & État civil",
    subtitle: "Identification du vendeur ou de son représentant",
    infoTitle: "Informations fournies",
    docsTitle: docsTitle,
    metadataTitle: "",
    generatedOnLabel: "Généré le",
    emptyDocsText: "",
    note: "Checklist indicative, sous réserve de demandes spécifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
