import { describe, it, expect } from "vitest";
import { createGenerator } from "ts-json-schema-generator";
import type { JSONSchema7 } from "json-schema";
import urbanismeForm from "@/utils/formDefinition/checklist-urbanisme-travaux-exterieurs.json";
import prealablesForm from "@/utils/formDefinition/checklist-informations-prealables.json";
import identiteForm from "@/utils/formDefinition/checklist-identite-etat-civil.json";
import situationForm from "@/utils/formDefinition/checklist-situation-matrimoniale.json";
import chargesForm from "@/utils/formDefinition/checklist-charges-taxes.json";
import coproForm from "@/utils/formDefinition/checklist-copro-structures.json";
import occupationForm from "@/utils/formDefinition/checklist-occupation-actuelle.json";
import origineForm from "@/utils/formDefinition/checklist-origine-propriete.json";
import capaciteForm from "@/utils/formDefinition/checklist-capacite-representation.json";
import proFiscaleForm from "@/utils/formDefinition/checklist-situation-professionnelle-fiscale.json";
import diagnosticsTIForm from "@/utils/formDefinition/checklist-diagnostics-travaux-interieurs.json";

type Definition = JSONSchema7 & { definitions?: Record<string, JSONSchema7> };

const resolveRef = (ref: string, root: Definition): JSONSchema7 | undefined => {
  const refPath = ref.replace(/^#\//, "").split("/");
  return refPath.reduce<JSONSchema7 | undefined>((acc, key) => {
    if (!acc) return undefined;
    const obj = acc as any;
    return obj[key];
  }, root);
};

const normalizeSchema = (
  node?: JSONSchema7,
  root?: Definition
): JSONSchema7 | undefined => {
  if (!node) return undefined;
  if (node.$ref && root) return normalizeSchema(resolveRef(node.$ref, root), root);
  return node;
};

const getChild = (
  node: JSONSchema7 | undefined,
  key: string,
  root: Definition
) => {
  if (!node) return undefined;
  const normalized = normalizeSchema(node, root);
  if (!normalized) return undefined;
  if (normalized.type === "object" && normalized.properties) {
    return normalizeSchema(normalized.properties[key] as JSONSchema7, root);
  }
  if (normalized.type === "array" && normalized.items) {
    return getChild(normalizeSchema(normalized.items as JSONSchema7, root), key, root);
  }
  const union = (normalized.anyOf || normalized.oneOf) as JSONSchema7[] | undefined;
  if (union?.length) {
    for (const option of union) {
      const found = getChild(normalizeSchema(option, root), key, root);
      if (found) return found;
    }
  }
  return undefined;
};

const collectPaths = (formDef: any): string[] => {
  const paths: string[] = [];
  for (const section of formDef.sections || []) {
    for (const field of section.fields || []) {
      if (field.type === "array" && field.itemSchema?.fields) {
        const base = field.path;
        for (const sub of field.itemSchema.fields) {
          paths.push(`${base}.${sub.path}`);
        }
      } else {
        paths.push(field.path);
      }
    }
  }
  return paths;
};

const cases = [
  {
    name: "urbanisme",
    form: urbanismeForm,
    typePath: "src/types/checklist-urbanisme-travaux-exterieurs.ts",
    typeName: "ChecklistUrbanismeTravauxExterieurs",
  },
  {
    name: "informations-prealables",
    form: prealablesForm,
    typePath: "src/types/checklist-informations-prealables.ts",
    typeName: "ChecklistInformationsPrealables",
  },
  {
    name: "identite-etat-civil",
    form: identiteForm,
    typePath: "src/types/checklist-identite-etat-civil.ts",
    typeName: "ChecklistIdentiteEtatCivil",
  },
  {
    name: "situation-matrimoniale",
    form: situationForm,
    typePath: "src/types/checklist-situation-matrimoniale.ts",
    typeName: "ChecklistSituationMatrimoniale",
  },
  {
    name: "charges-taxes",
    form: chargesForm,
    typePath: "src/types/checklist-charges-taxes.ts",
    typeName: "ChecklistChargesTaxes",
  },
  {
    name: "copro-structures",
    form: coproForm,
    typePath: "src/types/checklist-copro-structures.ts",
    typeName: "ChecklistCoproStructures",
  },
  {
    name: "occupation-actuelle",
    form: occupationForm,
    typePath: "src/types/checklist-occupation-actuelle.ts",
    typeName: "ChecklistOccupationActuelle",
  },
  {
    name: "origine-propriete",
    form: origineForm,
    typePath: "src/types/checklist-origine-propriete.ts",
    typeName: "ChecklistOriginePropriete",
  },
  {
    name: "capacite-representation",
    form: capaciteForm,
    typePath: "src/types/checklist-capacite-representation.ts",
    typeName: "ChecklistCapaciteRepresentation",
  },
  {
    name: "situation-professionnelle-fiscale",
    form: proFiscaleForm,
    typePath: "src/types/checklist-situation-professionnelle-fiscale.ts",
    typeName: "ChecklistSituationProfessionnelleFiscale",
  },
  {
    name: "diagnostics-travaux-interieurs",
    form: diagnosticsTIForm,
    typePath: "src/types/checklist-diagnostics-travaux-interieurs.ts",
    typeName: "ChecklistDiagnosticsTravauxInterieurs",
  },
];

describe("Checklist schema vs types", () => {
  for (const c of cases) {
    it(`${c.name} formDefinition paths exist in ${c.typeName}`, () => {
      const generator = createGenerator({
        path: c.typePath,
        tsconfig: "tsconfig.json",
        type: c.typeName,
        skipTypeCheck: true,
      });
      const schema = generator.createSchema() as Definition;
      const rootSchema =
        normalizeSchema(
          (schema.definitions as Record<string, JSONSchema7>)?.[c.typeName] || schema,
          schema
        ) || normalizeSchema(schema, schema);
      expect(rootSchema).toBeDefined();

      const paths = collectPaths(c.form);
      const missing: string[] = [];
      for (const path of paths) {
        const segments = path.split(".");
        let current: JSONSchema7 | undefined = rootSchema;
        for (const segment of segments) {
          current = getChild(current, segment, schema);
          if (!current) break;
        }
        if (!current) missing.push(path);
      }
      expect(missing).toEqual([]);
    });
  }
});
