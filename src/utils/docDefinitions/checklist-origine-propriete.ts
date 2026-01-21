import type { ChecklistOriginePropriete } from "@/types/checklist-origine-propriete";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistOriginePropriete,
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
  addInfo("Date d'acquisition", data.date_acquisition);
  addInfo("Type de propriétaire", data.type_proprietaire);
  addInfo(
    "Mode d'acquisition",
    data.mode_acquisition_personne_physique,
    data.type_proprietaire === "Personne physique",
  );
  addInfo(
    "Mode d'acquisition",
    data.mode_acquisition_personne_morale,
    data.type_proprietaire === "Personne morale",
  );
  addInfo(
    "Mode de transmission",
    data.mode_transmission,
    data.mode_acquisition_personne_physique === "Succession / Testament",
  );

  const modePhys = data.mode_acquisition_personne_physique;
  const modeMorale = data.mode_acquisition_personne_morale;
  const mode = modePhys || modeMorale;

  switch (mode) {
    case "Achat classique":
      addDoc("Attestation ou Titre de propriété");
      break;
    case "Succession / Testament":
      addDoc("Attestation immobilière de propriété");
      addDoc("Copie authentique du testament (s’il existe)");
      if (
        data.mode_transmission === "Succession (pas de bien précis attribué)"
      ) {
        addDoc("Attestation immobilière de succession");
        addDoc("Déclaration de succession (cerfa 2705)");
      }
      if (
        data.mode_transmission ===
        "Legs particulier (attribution d’un bien précis par testament)"
      ) {
        addDoc("Expédition du testament");
        addDoc("Procès-verbal d'ouverture/dépôt");
        addDoc("Certificat d'hérédité ou acte de notoriété");
        addDoc("Attestation immobilière publiée");
      }
      break;
    case "Achat en VEFA (Vente sur plan / programme neuf)":
      addDoc("Acte d’achat avec annexes");
      break;
    case "Donation entre vifs":
      addDoc("Acte de donation");
      break;
    case "Partage / Licitation":
      addDoc("Acte de partage/licitation");
      break;
    case "Échange":
      addDoc("Acte d’échange");
      break;
    case "Apport en société":
      addDoc("Titre de propriété");
      addDoc("Statuts mis à jour");
      addDoc("Acte d’évaluation / rapport du commissaire aux apports");
      addDoc("Décision sociale autorisant la vente (PV d’AG, etc)");
      addDoc("Kbis (ou équivalent)");
      break;
    case "Apport partiel d’actif (scission, fusion, TUP)":
      addDoc("Titre de propriété");
      addDoc("Traité d’apport / fusion / scission");
      addDoc("Statuts mis à jour");
      addDoc("Acte d’évaluation / rapport du commissaire aux apports");
      addDoc("Décision sociale autorisant la vente (PV d’AG, etc)");
      addDoc("Kbis (ou équivalent)");
      addDoc("Attestations de parution (BODACC, JAL)");
      break;
    case "Adjudication / Vente aux enchères":
      addDoc("Procès-verbal d’adjudication");
      break;
    case "Dation en paiement (d'une dette)":
      addDoc("Acte notarié de dation en paiement");
      break;
    case "Vente à terme / paiement différé":
      addDoc("Titre de propriété");
      addDoc("Quitus ou attestation de paiement intégral");
      break;
    case "Cession de nue-propriété / usufruit":
      addDoc("Acte de démembrement");
      addDoc(
        "Acte notarié définissant le démembrement (si le démembrement ne naît pas du même acte que la cession)",
      );
      break;
    default:
      break;
  }

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
    title: "Origine de propriété",
    subtitle: "Titre de propriété, origine et modalités d'acquisition",
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
