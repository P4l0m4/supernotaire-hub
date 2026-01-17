import type { ChecklistOriginePropriete } from "@/types/checklist-origine-propriete";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistOriginePropriete,
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

  addInfo("Origine de propriété", data.origine_propriete);
  addInfo(
    "Type de succession / testament",
    data.sous_type_succession,
    data.origine_propriete === "Succession / Testament"
  );

  switch (data.origine_propriete) {
    case "Achat classique":
      addDoc("Attestation ou titre de propriété");
      break;
    case "Succession / Testament":
      if (data.sous_type_succession === "Succession / Héritage") {
        addDoc("Attestation immobilière de succession");
        addDoc("Déclaration de succession (cerfa 2705)");
      }
      if (data.sous_type_succession === "Legs particulier (testament)") {
        addDoc("Expédition du testament");
        addDoc("Procès-verbal d'ouverture/dépôt");
        addDoc("Certificat d'hérédité ou acte de notoriété");
        addDoc("Attestation immobilière publiée");
      }
      break;
    case "Achat en VEFA (vente sur plan / programme neuf)":
      addDoc("Acte d'achat avec annexes");
      break;
    case "Donation entre vifs":
      addDoc("Acte de donation");
      break;
    case "Partage / Licitation":
      addDoc("Acte de partage/licitation");
      break;
    case "Échange":
      addDoc("Acte d'échange");
      break;
    case "Apport en société":
      addDoc("Acte d'apport");
      addDoc("Statuts mis à jour");
      break;
    case "Adjudication / Vente aux enchères":
      addDoc("Procès-verbal d'adjudication");
      break;
    case "Dation en paiement":
      addDoc("Acte notarié de transfert");
      addDoc("Convention de dation acceptée par le créancier");
      addDoc("Quitus de la dette");
      break;
    case "Vente à terme / paiement différé":
      addDoc("Acte de vente à terme");
      addDoc("Quitus ou attestation de paiement intégral");
      break;
    case "Cession de nue-propriété / usufruit":
      addDoc("Acte de démembrement");
      addDoc("Convention d'usufruit");
      addDoc("Attestation d'absence d'hypothèque");
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
