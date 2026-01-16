import type {
  ChecklistIdentiteEtatCivil,
  LieuNaissanceType,
  TypeChangementEtatCivil,
} from "@/types/checklist-identite-etat-civil";
import { formatChecklistValue as val } from "@/utils/docDefinitions/formatters";
import { buildChecklistPdfStructure } from "@/utils/docDefinitions/pdfStructure";

const TYPE_CHANGEMENT_NOM_DECRET: TypeChangementEtatCivil =
  "Changement de nom par décret";
const LIEU_NAISSANCE_ETRANGER: LieuNaissanceType = "Pays étranger";

export function buildDocDefinition(
  data: ChecklistIdentiteEtatCivil,
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

  const identite = data.identite ?? {};
  const lieu = identite.lieu_naissance ?? {};
  const etatCivil = data.etat_civil ?? {};

  addInfo("Date de naissance", identite.date_naissance);
  addInfo("Nom", identite.nom);
  addInfo("Prenom(s)", identite.prenoms);
  addInfo("Adresse actuelle", identite.adresse_actuelle?.properties?.label);
  addInfo("Lieu de naissance", lieu.type);
  addInfo("Departement de naissance", lieu.departement, lieu.type === "France");
  addInfo(
    "Ville de naissance",
    lieu.ville,
    lieu.type === LIEU_NAISSANCE_ETRANGER
  );
  addInfo(
    "Pays de naissance",
    lieu.pays,
    lieu.type === LIEU_NAISSANCE_ETRANGER
  );

  addInfo(
    "Changement d'etat civil",
    etatCivil.changement_etat_civil ? "Oui" : "Non"
  );
  addInfo(
    "Type de changement",
    etatCivil.type_changement,
    etatCivil.changement_etat_civil === true
  );

  if (etatCivil.type_changement === TYPE_CHANGEMENT_NOM_DECRET) {
    const cn = etatCivil.changement_nom ?? {};
    addInfo(
      "A deja signe des documents avec un ancien etat civil",
      cn.a_signe_ancien_etat_civil
    );
    addInfo(
      "Ancien nom",
      cn.ancien_nom,
      cn.a_signe_ancien_etat_civil === false
    );
    addInfo(
      "Date du decret ou jugement",
      cn.date_decret_jugement,
      cn.a_signe_ancien_etat_civil === false
    );
    addDoc(
      "Ancien passeport / CNI ou titre de sejour portant l'ancien nom",
      cn.a_signe_ancien_etat_civil === true
    );
    addDoc("Decret / jugement", cn.a_signe_ancien_etat_civil === false);
    addDoc(
      "Publication au J.O ou attestation mairie",
      cn.a_signe_ancien_etat_civil === false
    );
  }

  if (etatCivil.type_changement === "Mariage") {
    const mariage = etatCivil.mariage ?? {};
    addInfo("Lieu du mariage", mariage.lieu);
    addInfo("Date du mariage", mariage.date);
    addInfo("Nom du conjoint", mariage.nom_conjoint);
    addInfo("Prenom du conjoint", mariage.prenom_conjoint);
    addInfo("Choix d'usage", mariage.choix_usage);
    addDoc("Copie integrale de l'acte de mariage < 3 mois");
  }

  if (etatCivil.type_changement === "Pacs") {
    addDoc("Attestation d'enregistrement PACS");
  }

  if (etatCivil.type_changement === "Divorce / dissolution PACS") {
    const divorce = etatCivil.divorce ?? {};
    addInfo(
      "Date du jugement ou dissolution",
      divorce.date_jugement_ou_dissolution
    );
    addInfo("Nom de l'ex-conjoint / partenaire", divorce.nom_ex_conjoint);
    addDoc(
      "Jugement de divorce (ou acte de dissolution PACS si partenariat contractuel)"
    );
    addDoc("Extrait d'acte de naissance mis a jour");
    addDoc("Copie du livret de famille");
  }

  if (etatCivil.type_changement === "Veuvage") {
    const veuvage = etatCivil.veuvage ?? {};
    addInfo("Date du deces du conjoint", veuvage.date_deces_conjoint);
    addInfo("Lieu du deces du conjoint", veuvage.lieu_deces_conjoint);
    addDoc("Acte de deces du conjoint");
    addDoc("Extrait d'acte de mariage portant mention du deces");
  }

  if (etatCivil.type_changement === "Rectification de genre") {
    const rectif = etatCivil.rectification_genre ?? {};
    addInfo("Date de la decision", rectif.date_decision);
    addInfo("Tribunal de la decision", rectif.tribunal_decision);
    addInfo(
      "A deja signe des documents avec un ancien etat civil",
      rectif.a_signe_ancien_etat_civil
    );
    addDoc("Jugement");
    addDoc(
      "Ancien passeport / CNI ou titre de sejour portant l'ancien nom",
      rectif.a_signe_ancien_etat_civil === true
    );
  }

  addDoc("Piece d'identite (CNI, titre de sejour ou passeport)");
  addDoc("Acte de naissance integral < 3 mois");

  const docs = Array.from(docsSet);
  const infoBody = [
    ["Information", "Reponse"],
    ...(infoRows.length ? infoRows : [["Informations", "-"]]),
  ];

  return buildChecklistPdfStructure({
    title: "Identite & Etat civil",
    subtitle: "Documents et informations a fournir a votre notaire",
    infoTitle: "Informations a fournir",
    docsTitle: "Documents a fournir",
    metadataTitle: "Metadonnees",
    generatedOnLabel: "Genere le",
    emptyDocsText: "Aucun document supplementaire.",
    note: "Checklist indicative, sous reserve de demandes specifiques du notaire.",
    infoBody,
    docs,
    logoBase64,
  });
}
