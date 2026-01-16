import type { ChecklistCapaciteRepresentation } from "@/types/checklist-capacite-representation";
import { formatChecklistValue as val } from "@/utils/docDefinitions/formatters";
import { buildChecklistPdfStructure } from "@/utils/docDefinitions/pdfStructure";

export function buildDocDefinition(
  data: ChecklistCapaciteRepresentation,
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

  addInfo("Statut de la partie", data.statut_partie);

  if (data.statut_partie === "Personne physique") {
    addInfo("Vente en nom propre", data.bien_vendu_en_nom_propre);

    if (data.bien_vendu_en_nom_propre) {
      addInfo(
        "Sous protection juridique",
        data.sous_protection_personne_physique
      );
      addInfo(
        "Type de protection",
        data.type_protection_personne_physique,
        data.sous_protection_personne_physique
      );

      if (data.sous_protection_personne_physique) {
        if (data.type_protection_personne_physique === "Curatelle") {
          addDoc("Accord ecrit du curateur (lettre datee et signee)");
          addDoc("Jugement de mise sous curatelle");
          addDoc("Piece d’identite du curateur");
        }
        if (data.type_protection_personne_physique === "Tutelle") {
          addDoc("Autorisation du juge des tutelles pour la vente");
          addDoc("Piece d’identite du tuteur");
          addDoc("Jugement de mise sous tutelle");
        }
        if (
          data.type_protection_personne_physique ===
          "Mandat de protection future ou autre"
        ) {
          addDoc("Mandat de protection future ou procuration notarisee");
          addDoc("Piece d’identite du mandataire");
        }
      }
    }

    if (data.bien_vendu_en_nom_propre === false) {
      addInfo(
        "Type de representation",
        data.type_representation_personne_physique
      );

      if (
        data.type_representation_personne_physique ===
        "Mandat simple (procuration sous seing prive)"
      ) {
        addDoc("Procuration signee par le vendeur");
        addDoc("Piece d’identite du mandataire");
      }

      if (
        data.type_representation_personne_physique ===
        "Representation d’un majeur protege"
      ) {
        addInfo(
          "Type de protection pour la representation",
          data.type_protection_representation
        );
        if (data.type_protection_representation === "Tutelle") {
          addDoc("Autorisation du juge des tutelles pour la vente");
          addDoc("Piece d’identite du tuteur");
          addDoc("Jugement de mise sous tutelle");
        }
        if (data.type_protection_representation === "Curatelle") {
          addDoc("Jugement de mise sous curatelle");
          addDoc("Accord ecrit du curateur");
          addDoc("Piece d’identite du curateur");
        }
        if (data.type_protection_representation === "Mandataire special") {
          addDoc("Procuration notarisee ou sous seing prive");
          addDoc("Piece d’identite du mandataire");
        }
        if (data.type_protection_representation === "Habilitation familiale") {
          addDoc("Acte constitutif de l’habilitation familiale");
          addDoc("Piece d’identite de l’habilitant");
        }
      }

      if (
        data.type_representation_personne_physique ===
        "Mandataire special (procuration ponctuelle ou generale)"
      ) {
        addDoc("Procuration notarisee ou sous seing prive");
        addDoc("Piece d’identite du mandataire");
      }

      if (
        data.type_representation_personne_physique === "Habilitation familiale"
      ) {
        addDoc("Acte constitutif de l’habilitation familiale");
        addDoc("Piece d’identite de l’habilitant");
      }
    }
  }

  if (data.statut_partie === "Personne morale") {
    addInfo("Type d’entite", data.type_entite_personne_morale);
    addInfo(
      "Entite representee par un mandataire",
      data.entite_representee_par_mandataire
    );

    if (data.type_entite_personne_morale === "Societe") {
      addDoc("Extrait Kbis de moins de 3 mois");
      addDoc(
        "Statuts a jour de la societe (si pouvoirs non precises dans le Kbis)"
      );
      addDoc("Piece d’identite du representant legal");
      addDoc(
        "Proces-verbal d’assemblee autorisant la vente (si requis par les statuts)"
      );
    }

    if (data.type_entite_personne_morale === "Association") {
      addDoc("Statuts de l’association");
      addDoc("Proces-verbal de nomination du president ou representant");
      addDoc("Proces-verbal autorisant la vente du bien immobilier");
      addDoc("Piece d’identite du representant legal");
    }

    if (data.entite_representee_par_mandataire) {
      addDoc("Piece d’identite du mandataire");
      addDoc("Mandat ecrit / procuration du mandataire");
    }
  }

  if (data.statut_partie === "Indivision") {
    addInfo(
      "Mandataire / representant unique designe",
      data.indivision_representant_unique
    );
    addDoc("Titre d’indivision (acte ou convention)");
    addDoc("Identite et parts de chaque indivisaire");
    addDoc("Proces-verbal ou accord des indivisaires autorisant la vente");
    if (data.indivision_representant_unique) {
      addDoc("Mandat commun / procuration du representant de l’indivision");
    }
  }

  const infoBody = [
    ["Information", "Reponse"],
    ...(infoRows.length ? infoRows : [["Informations", "-"]]),
  ];

  return buildChecklistPdfStructure({
    title: "Capacite & Representation",
    subtitle: "Capacite juridique, protections et pouvoirs pour signer la vente",
    infoTitle: "Informations a fournir",
    docsTitle: "Documents a fournir",
    metadataTitle: "Metadonnees",
    generatedOnLabel: "Genere le",
    emptyDocsText: "Aucun document supplementaire.",
    note: "Checklist indicative, sous reserve de demandes specifiques du notaire.",
    infoBody,
    docs: Array.from(docsSet),
    logoBase64,
  });
}










