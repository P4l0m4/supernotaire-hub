import { describe, it, expect } from "vitest";
import { createGenerator } from "ts-json-schema-generator";
import type { JSONSchema7 } from "json-schema";
import fs from "node:fs";
import path from "node:path";

import urbanismeForm from "@/utils/formDefinition/checklist-urbanisme-travaux-exterieurs.json";
import prealablesForm from "@/utils/formDefinition/checklist-informations-prealables.json";
import identiteForm from "@/utils/formDefinition/checklist-identite-etat-civil.json";
import situationForm from "@/utils/formDefinition/checklist-situation-matrimoniale.json";
import chargesForm from "@/utils/formDefinition/checklist-charges-taxes.json";
import coproForm from "@/utils/formDefinition/checklist-copro-structures.json";
import occupationForm from "@/utils/formDefinition/checklist-occupation-actuelle.json";
import origineForm from "@/utils/formDefinition/checklist-origine-propriete.json";
import capaciteForm from "@/utils/formDefinition/checklist-capacite-representation.json";
import fiscaleForm from "@/utils/formDefinition/checklist-situation-fiscale.json";
import diagnosticsTIForm from "@/utils/formDefinition/checklist-diagnostics-travaux-interieurs.json";

type Definition = JSONSchema7 & { definitions?: Record<string, JSONSchema7> };

const cases = [
  {
    name: "urbanisme",
    form: urbanismeForm,
    typePath: "src/types/checklist-urbanisme-travaux-exterieurs.ts",
    typeName: "ChecklistUrbanismeTravauxExterieurs",
    docDefPath:
      "src/utils/docDefinitions/checklist-urbanisme-travaux-exterieurs.ts",
  },
  {
    name: "informations-prealables",
    form: prealablesForm,
    typePath: "src/types/checklist-informations-prealables.ts",
    typeName: "ChecklistInformationsPrealables",
    docDefPath: "src/utils/docDefinitions/checklist-informations-prealables.ts",
  },
  {
    name: "identite-etat-civil",
    form: identiteForm,
    typePath: "src/types/checklist-identite-etat-civil.ts",
    typeName: "ChecklistIdentiteEtatCivil",
    docDefPath: "src/utils/docDefinitions/checklist-identite-etat-civil.ts",
  },
  {
    name: "situation-matrimoniale",
    form: situationForm,
    typePath: "src/types/checklist-situation-matrimoniale.ts",
    typeName: "ChecklistSituationMatrimoniale",
    docDefPath: "src/utils/docDefinitions/checklist-situation-matrimoniale.ts",
  },
  {
    name: "charges-taxes",
    form: chargesForm,
    typePath: "src/types/checklist-charges-taxes.ts",
    typeName: "ChecklistChargesTaxes",
    docDefPath: "src/utils/docDefinitions/checklist-charges-taxes.ts",
  },
  {
    name: "copro-structures",
    form: coproForm,
    typePath: "src/types/checklist-copro-structures.ts",
    typeName: "ChecklistCoproStructures",
    docDefPath: "src/utils/docDefinitions/checklist-copro-structures.ts",
  },
  {
    name: "occupation-actuelle",
    form: occupationForm,
    typePath: "src/types/checklist-occupation-actuelle.ts",
    typeName: "ChecklistOccupationActuelle",
    docDefPath: "src/utils/docDefinitions/checklist-occupation-actuelle.ts",
  },
  {
    name: "origine-propriete",
    form: origineForm,
    typePath: "src/types/checklist-origine-propriete.ts",
    typeName: "ChecklistOriginePropriete",
    docDefPath: "src/utils/docDefinitions/checklist-origine-propriete.ts",
  },
  {
    name: "capacite-representation",
    form: capaciteForm,
    typePath: "src/types/checklist-capacite-representation.ts",
    typeName: "ChecklistCapaciteRepresentation",
    docDefPath: "src/utils/docDefinitions/checklist-capacite-representation.ts",
  },
  {
    name: "situation-fiscale",
    form: fiscaleForm,
    typePath: "src/types/checklist-situation-fiscale.ts",
    typeName: "ChecklistSituationFiscale",
    docDefPath: "src/utils/docDefinitions/checklist-situation-fiscale.ts",
  },
  {
    name: "diagnostics-travaux-interieurs",
    form: diagnosticsTIForm,
    typePath: "src/types/checklist-diagnostics-travaux-interieurs.ts",
    typeName: "ChecklistDiagnosticsTravauxInterieurs",
    docDefPath:
      "src/utils/docDefinitions/checklist-diagnostics-travaux-interieurs.ts",
  },
];

type PathSet = Set<string>;

const collectSchemaPaths = (schema: Definition, rootKey: string): PathSet => {
  const paths: PathSet = new Set();

  const walk = (node?: JSONSchema7, prefix = "") => {
    if (!node) return;
    if (node.$ref) return;
    const norm = (node.anyOf || node.oneOf) as JSONSchema7[] | undefined;
    if (norm?.length) norm.forEach((n) => walk(n, prefix));
    if (node.type === "object" && node.properties) {
      for (const [key, child] of Object.entries(node.properties)) {
        const next = prefix ? `${prefix}.${key}` : key;
        paths.add(next);
        walk(child as JSONSchema7, next);
      }
    } else if (node.type === "array" && node.items) {
      walk(node.items as JSONSchema7, prefix ? `${prefix}[]` : "[]");
    }
  };

  const root =
    (schema.definitions &&
      (schema.definitions as Record<string, JSONSchema7>)[rootKey]) ||
    schema;
  walk(root as JSONSchema7, rootKey);
  return paths;
};

const collectFormPaths = (formDef: any): string[] => {
  const paths: string[] = [];
  for (const section of formDef.sections || []) {
    for (const field of section.fields || []) {
      if (field.type === "array" && field.itemSchema?.fields) {
        for (const sub of field.itemSchema.fields) {
          paths.push(`${field.path}.${sub.path}`);
        }
      } else {
        paths.push(field.path);
      }
    }
  }
  return paths;
};

const collectDocPaths = (docPath: string): string[] => {
  const content = fs.readFileSync(path.resolve(docPath), "utf8");
  // ignore method calls like .includes(
  const matches = [...content.matchAll(/data\.([A-Za-z0-9_?.]+)/g)];
  return matches
    .map((m) => m[1])
    .map((p) =>
      p
        .replace(/\?/g, "")
        .replace(/\.\[/g, ".")
        .replace(/\[(\d+)\]/g, ".$1"),
    );
};

describe("Checklist concordance across form/type/docDefinition", () => {
  for (const c of cases) {
    it(`${c.name}: types -> form paths`, () => {
      const generator = createGenerator({
        path: c.typePath,
        tsconfig: "tsconfig.json",
        type: c.typeName,
        skipTypeCheck: true,
      });
      const schema = generator.createSchema() as Definition;
      const typePaths = collectSchemaPaths(schema, c.typeName);
      const formPaths = collectFormPaths(c.form);
      const missing: string[] = [];
      for (const p of typePaths) {
        const base = p.replace(/\[\]/g, "");
        let candidate = base.replace(`${c.typeName}.`, "");
        if (candidate.startsWith(".")) candidate = candidate.slice(1);
        const alt = candidate.replace(/_/g, "-");
        if (
          !formPaths.some(
            (fp) => fp.startsWith(candidate) || fp.startsWith(alt),
          )
        ) {
          missing.push(p);
        }
      }
      expect(missing).toEqual([]);
    });

    it(`${c.name}: docDefinition -> types`, () => {
      const generator = createGenerator({
        path: c.typePath,
        tsconfig: "tsconfig.json",
        type: c.typeName,
        skipTypeCheck: true,
      });
      const schema = generator.createSchema() as Definition;
      const typePaths = collectSchemaPaths(schema, c.typeName);
      const docPaths = collectDocPaths(c.docDefPath).filter(
        (p) => !p.includes(".includes"),
      );
      const missing: string[] = [];
      for (const p of docPaths) {
        const base = p.replace(/\[\]/g, "").replace(`${c.typeName}.`, "");
        const key = `${c.typeName}.${base}`;
        const alt = `${c.typeName}.${base.replace(/_/g, "-")}`;
        if (!typePaths.has(key) && !typePaths.has(alt)) missing.push(p);
      }
      expect(missing).toEqual([]);
    });
  }
});
