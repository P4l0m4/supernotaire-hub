import { loadLogo } from "@/utils/otherFunctions";
import { buildDocDefinition as buildPrealablesDoc } from "@/utils/docDefinitions/checklist-informations-prealables";
import { buildDocDefinition as buildIdentiteDoc } from "@/utils/docDefinitions/checklist-identite-etat-civil";
import { buildDocDefinition as buildSituationDoc } from "@/utils/docDefinitions/checklist-situation-matrimoniale";
import { buildDocDefinition as buildChargesTaxesDoc } from "@/utils/docDefinitions/checklist-charges-taxes";
import { buildDocDefinition as buildProFiscaleDoc } from "@/utils/docDefinitions/checklist-situation-professionnelle-fiscale";
import { buildDocDefinition as buildCoproDoc } from "@/utils/docDefinitions/checklist-copro-structures";
import { buildDocDefinition as buildOccupationDoc } from "@/utils/docDefinitions/checklist-occupation-actuelle";
import { buildDocDefinition as buildOrigineDoc } from "@/utils/docDefinitions/checklist-origine-propriete";
import { buildDocDefinition as buildCapaciteDoc } from "@/utils/docDefinitions/checklist-capacite-representation";
import { buildDocDefinition as buildUrbanismeDoc } from "@/utils/docDefinitions/checklist-urbanisme-travaux-exterieurs";
import { buildDocDefinition as buildDiagnosticsTIDoc } from "@/utils/docDefinitions/checklist-diagnostics-travaux-interieurs";
import type { ChecklistInformationsPrealables } from "@/types/checklist-informations-prealables";
import type { ChecklistIdentiteEtatCivil } from "@/types/checklist-identite-etat-civil";
import type { ChecklistSituationMatrimoniale } from "@/types/checklist-situation-matrimoniale";
import type { ChecklistChargesTaxes } from "@/types/checklist-charges-taxes";
import type { ChecklistSituationProfessionnelleFiscale } from "@/types/checklist-situation-professionnelle-fiscale";

type FreeRubriqueId =
  | "prealables"
  | "identite"
  | "situation"
  | "charges-taxes"
  | "pro-fiscale";

type RubriqueConfig<TData> = {
  id: FreeRubriqueId;
  storageKey: string;
  buildDoc: (data: TData, logo: string) => any;
};

const freeRubriques: RubriqueConfig<any>[] = [
  {
    id: "prealables",
    storageKey: "sn-checklist-prealables",
    buildDoc: buildPrealablesDoc,
  },
  {
    id: "identite",
    storageKey: "sn-checklist-identite",
    buildDoc: buildIdentiteDoc,
  },
  {
    id: "situation",
    storageKey: "sn-checklist-situation",
    buildDoc: buildSituationDoc,
  },
  {
    id: "charges-taxes",
    storageKey: "sn-checklist-charges-taxes",
    buildDoc: buildChargesTaxesDoc,
  },
  {
    id: "pro-fiscale",
    storageKey: "sn-checklist-pro-fiscale",
    buildDoc: buildProFiscaleDoc,
  },
];

const hasValue = (val: unknown): boolean => {
  if (val == null) return false;
  if (typeof val === "boolean") return val === true;
  if (typeof val === "number") return true;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object") return Object.values(val).some((v) => hasValue(v));
  return false;
};

const readStoredRubrique = <T>(storageKey: string): T | null => {
  if (!process.client) return null;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export function buildPartialDocDefinitionFromData(
  dataByRubrique: Partial<Record<FreeRubriqueId, unknown>>,
  logoBase64: string
) {
  return buildCombinedDocDefinition(freeRubriques, dataByRubrique, logoBase64);
}

export async function buildPartialDocDefinition() {
  const logoBase64 = await loadLogo();

  const dataByRubrique: Partial<Record<FreeRubriqueId, unknown>> = {};
  freeRubriques.forEach((config) => {
    dataByRubrique[config.id] = readStoredRubrique(config.storageKey);
  });

  return buildPartialDocDefinitionFromData(dataByRubrique, logoBase64);
}

type AnyRubriqueConfig = RubriqueConfig<any> & { id: string };

const allRubriques: AnyRubriqueConfig[] = [
  ...freeRubriques,
  {
    id: "copro",
    storageKey: "sn-checklist-copro",
    buildDoc: buildCoproDoc,
  },
  {
    id: "occupation",
    storageKey: "sn-checklist-occupation",
    buildDoc: buildOccupationDoc,
  },
  {
    id: "origine",
    storageKey: "sn-checklist-origine",
    buildDoc: buildOrigineDoc,
  },
  {
    id: "capacite",
    storageKey: "sn-checklist-capacite",
    buildDoc: buildCapaciteDoc,
  },
  {
    id: "urbanisme",
    storageKey: "sn-checklist-urbanisme",
    buildDoc: buildUrbanismeDoc,
  },
  {
    id: "diagnostics-travaux-interieurs",
    storageKey: "sn-checklist-diagnostics-travaux-interieurs",
    buildDoc: buildDiagnosticsTIDoc,
  },
];

function buildCombinedDocDefinition(
  configs: AnyRubriqueConfig[],
  dataByRubrique: Partial<Record<string, unknown>>,
  logoBase64: string
) {
  const docDefinitions: any[] = [];

  configs.forEach((config) => {
    const data = dataByRubrique[config.id];
    if (!hasValue(data)) return;
    const definition = config.buildDoc(data as never, logoBase64);
    if (definition?.content?.length) {
      docDefinitions.push(definition);
    }
  });

  if (!docDefinitions.length) return null;

  const combinedContent = docDefinitions.flatMap((definition, index) => {
    const items = Array.isArray(definition.content) ? definition.content : [];
    if (!items.length) return [];
    if (index < docDefinitions.length - 1) {
      return [...items, { text: "", pageBreak: "after" }];
    }
    return items;
  });

  const mergedStyles = docDefinitions.reduce(
    (acc: Record<string, unknown>, definition) => ({
      ...acc,
      ...(definition.styles || {}),
    }),
    {}
  );

  return {
    pageSize: "A4",
    pageMargins: [24, 24, 24, 72],
    images: {
      logoSupernotaire: logoBase64,
    },
    content: combinedContent,
    styles: mergedStyles,
    footer: docDefinitions[0]?.footer,
  };
}

export async function buildFullDocDefinition() {
  const logoBase64 = await loadLogo();
  const dataByRubrique: Partial<Record<string, unknown>> = {};
  allRubriques.forEach((config) => {
    dataByRubrique[config.id] = readStoredRubrique(config.storageKey);
  });
  return buildCombinedDocDefinition(allRubriques, dataByRubrique, logoBase64);
}
