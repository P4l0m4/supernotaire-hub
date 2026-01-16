import type { ChecklistOriginePropriete } from "@/types/checklist-origine-propriete";
import { formatChecklistValue as val } from "@/utils/docDefinitions/formatters";
import { buildChecklistPdfStructure } from "@/utils/docDefinitions/pdfStructure";

export function buildDocDefinition(
  data: ChecklistOriginePropriete,
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
    ["Information", "Réponse"],
    ...(rows.length ? rows : [["Informations", "-"]]),
  ];

      return buildChecklistPdfStructure({
    title: "Origine de propriete",
    subtitle: "Titre de propriete, origine et modalites d'acquisition",
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
