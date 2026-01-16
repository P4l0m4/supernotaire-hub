import type { ChecklistCoproStructures } from "@/types/checklist-copro-structures";
import { formatChecklistValue as val } from "@/utils/docDefinitions/formatters";
import { buildChecklistPdfStructure } from "@/utils/docDefinitions/pdfStructure";

export function buildDocDefinition(
  data: ChecklistCoproStructures,
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

  addInfo("Bien en copropriété", data.bien_en_copropriete);
  addInfo(
    "Gestion de la copropriété",
    data.gestion_copropriete,
    data.bien_en_copropriete === true
  );
  addInfo("Email du syndic", data.email_syndic, data.email_syndic);
  addInfo("Numéro du syndic", data.tel_syndic, data.tel_syndic);

  addInfo(
    "Travaux parties communes en cours",
    data.travaux_parties_communes,
    data.bien_en_copropriete === true
  );

  addInfo(
    "Compteurs individualisés",
    data.compteurs_individualises,
    data.bien_en_copropriete === true
  );
  addInfo(
    "Types de compteurs",
    (data.types_compteurs || [])
      .map((t) => val((t as any).label ?? t))
      .join(", "),
    data.compteurs_individualises === true
  );
  addInfo(
    "Installations conformes",
    data.conformite_installations,
    data.compteurs_individualises === true
  );

  addInfo("Lotissement / ASL / AFUL", data.est_en_asl);
  addInfo("Nom ASL/AFUL", data.nom_asl, data.est_en_asl === true);
  addInfo("Contact ASL/AFUL", data.contact_asl, data.est_en_asl === true);
  addInfo("Téléphone ASL/AFUL", data.telephone_asl, data.est_en_asl === true);

  // Documents copro (si en copropriété)
  addDoc(
    "Historique des charges de copropriété (3 dernières années)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Compte-rendu de la dernière AG (PV)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Convocation et ordre du jour de la prochaine AG",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Reglement de copropriété et état descriptif de division",
    data.bien_en_copropriete === true
  );
  addDoc("Carnet d'entretien de l'immeuble", data.bien_en_copropriete === true);
  addDoc(
    "Relevé des charges annuelles (budget prévisionnel et dépenses)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Mises en demeure / relances de charges éventuelles",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Protocole de recouvrement en cours (le cas échéant)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Diagnostics parties communes (DTG, audits énergétiques le cas échéant)",
    data.bien_en_copropriete === true
  );
  addDoc(
    "Devis ou autorisations pour travaux sur parties communes",
    data.travaux_parties_communes === true
  );
  addDoc(
    "Coordonnées du représentant du syndic / conseil syndical",
    data.bien_en_copropriete === true
  );

  // ASL / AFUL
  addDoc(
    "Statuts et règlement intérieur de l'ASL / AFUL",
    data.est_en_asl === true
  );
  addDoc("Appels de charges / contributions ASL", data.est_en_asl === true);
  addDoc(
    "Coordonnées de l'administrateur / président de l'ASL",
    data.est_en_asl === true
  );

  const infoBody = [
    ["Information", "Réponse"],
    ...(infoRows.length ? infoRows : [["Informations", "-"]]),
  ];

      return buildChecklistPdfStructure({
    title: "Copropriete & structures",
    subtitle: "Informations sur la copropriete et la structure de l'immeuble",
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


