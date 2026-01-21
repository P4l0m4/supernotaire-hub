import type { ChecklistCapaciteRepresentation } from "@/types/checklist-capacite-representation";
import { formatChecklistValue as val } from "./formatters";
import { buildChecklistPdfStructure } from "./pdfStructure";

export function buildDocDefinition(
  data: ChecklistCapaciteRepresentation,
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

  addInfo("Statut de la partie", data.statut_partie);

  if (data.statut_partie === "Personne physique") {
    addInfo("Vente en nom propre", data.bien_vendu_en_nom_propre);

    if (data.bien_vendu_en_nom_propre === "Non") {
      addInfo(
        "Sous protection juridique",
        data.sous_protection_personne_physique,
      );
      addInfo(
        "Type de protection",
        data.type_protection_personne_physique,
        data.sous_protection_personne_physique === "Oui",
      );

      if (data.sous_protection_personne_physique === "Oui") {
        if (data.type_protection_personne_physique === "Curatelle") {
          addDoc("Accord écrit du curateur (lettre datée et signée)");
          addDoc("Jugement de mise sous curatelle");
          addDoc("Pièce d'identité du curateur");
        }
        if (data.type_protection_personne_physique === "Tutelle") {
          addDoc("Autorisation du juge des tutelles pour la vente");
          addDoc("Pièce d'identité du tuteur");
          addDoc("Jugement de mise sous tutelle");
        }
        if (
          data.type_protection_personne_physique ===
          "Mandat de protection future ou autre"
        ) {
          addDoc("Mandat de protection future ou procuration notarisée");
          addDoc("Pièce d'identité du mandataire");
        }
      }
    }

    if (data.bien_vendu_en_nom_propre === "Oui") {
      addInfo(
        "Type de représentation",
        data.type_representation_personne_physique,
      );

      if (
        data.type_representation_personne_physique ===
        "Mandat simple (procuration sous seing privé)"
      ) {
        addDoc("Procuration signée par le vendeur");
        addDoc("Pièce d'identité du mandataire");
      }

      if (
        data.type_representation_personne_physique ===
        "Représentation d’un majeur protégé"
      ) {
        addInfo(
          "Type de protection pour la représentation",
          data.type_protection_representation,
        );
        if (data.type_protection_representation === "Tutelle") {
          addDoc("Autorisation du juge des tutelles pour la vente");
          addDoc("Pièce d'identité du tuteur");
          addDoc("Jugement de mise sous tutelle");
        }
        if (data.type_protection_representation === "Curatelle") {
          addDoc("Jugement de mise sous curatelle");
          addDoc("Accord écrit du curateur");
          addDoc("Pièce d'identité du curateur");
        }
        if (data.type_protection_representation === "Mandataire spécial") {
          addDoc("Procuration notarisée ou sous seing privé");
          addDoc("Pièce d'identité du mandataire");
        }
        if (data.type_protection_representation === "Habilitation familiale") {
          addDoc("Acte constitutif de l'habilitation familiale");
          addDoc("Pièce d'identité de l'habilitant");
        }
      }
    }
  }

  if (data.statut_partie === "Personne morale") {
    addInfo("Type d'entité", data.type_entite_personne_morale);
    addInfo(
      "Entité représentée par un mandataire",
      data.entite_representee_par_mandataire,
    );

    if (data.type_entite_personne_morale === "Société (SARL, SAS, SCI, etc.)") {
      addDoc("Extrait Kbis de moins de 3 mois");
      addDoc(
        "Statuts à jour de la société (si pouvoirs non précisés dans le Kbis)",
      );
      addDoc("Pièce d'identité du représentant légal");
      addDoc(
        "Procès-verbal d'assemblée autorisant la vente (si requis par les statuts)",
      );
    }

    if (data.type_entite_personne_morale === "Association") {
      addDoc("Statuts de l'association");
      addDoc("Procès-verbal de nomination du président ou représentant légal");
      addDoc("Procès-verbal autorisant la vente du bien immobilier");
      addDoc("Pièce d'identité du représentant légal");
    }

    if (data.entite_representee_par_mandataire === "Oui") {
      addDoc("Pièce d'identité du mandataire");
      addDoc("Mandat écrit / procuration du mandataire");
    }
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
    title: "Capacité & Représentation",
    subtitle:
      "Capacité juridique, protections et pouvoirs pour signer la vente",
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
