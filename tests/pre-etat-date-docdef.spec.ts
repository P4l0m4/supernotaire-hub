import { describe, it, expect } from "vitest";
import { createGenerator } from "ts-json-schema-generator";
import type { JSONSchema7 } from "json-schema";
import fs from "node:fs";
import path from "node:path";

import preEtatForm from "@/utils/formDefinition/pre-etat-date.json";

type Definition = JSONSchema7 & { definitions?: Record<string, JSONSchema7> };

const typePath = "src/types/pre-etat-date-complet.ts";
const typeName = "PreEtatDate";
const docDefPath = "src/utils/docDefinitions/pre-etat-date.ts";

type PathSet = Set<string>;

const collectSchemaPaths = (schema: Definition, rootKey: string): PathSet => {
  const paths: PathSet = new Set();

  const resolveRef = (ref?: string): JSONSchema7 | undefined => {
    if (!ref || !schema.definitions) return undefined;
    const m = ref.match(/#\/definitions\/(.+)$/);
    if (!m) return undefined;
    return schema.definitions[m[1]];
  };

  const walk = (node?: JSONSchema7, prefix = "") => {
    if (!node) return;
    if (node.$ref) {
      const target = resolveRef(node.$ref);
      if (target) walk(target, prefix);
      return;
    }
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
    (schema.definitions && (schema.definitions as Record<string, JSONSchema7>)[rootKey]) ||
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
  const matches = [...content.matchAll(/d\.([A-Za-z0-9_?.]+)/g)];
  return matches
    .map((m) => m[1])
    .map((p) =>
      p
        .replace(/\?/g, "")
        .replace(/\.\[/g, ".")
        .replace(/\[(\d+)\]/g, ".$1")
    );
};

describe("Pre-etat date concordance across form/type/docDefinition", () => {
  const fileSubProps =
    /(\.|^)size$|(\.|^)type$|(\.|^)lastModified$|(\.|^)name$|(\.|^)webkitRelativePath$/;
  const aliases: Record<string, string> = {
    "documents.attestation_de_propriete": "documents.acte_de_propriete",
    "copropriete.fonds_travaux.existance": "copropriete.fonds_travaux_existance",
    "financier_lot_sommes_dues_cedant.a_des_tiers_emprunts_geres_par_syndic":
      "financier_lot_sommes_dues_cedant.autres_sommes_exigibles.a_des_tiers_emprunts_geres_par_syndic",
  };

  it("types -> form paths", () => {
    const generator = createGenerator({
      path: typePath,
      tsconfig: "tsconfig.json",
      type: typeName,
      skipTypeCheck: true,
    });
    const schema = generator.createSchema() as Definition;
    const typePaths = collectSchemaPaths(schema, typeName);
    const formPaths = collectFormPaths(preEtatForm);
    const missing: string[] = [];
    for (const p of typePaths) {
      const base = p.replace(/\[\]/g, "");
      let candidate = base.replace(`${typeName}.`, "");
      if (candidate.startsWith(".")) candidate = candidate.slice(1);
      const alt = candidate.replace(/_/g, "-");
      if (fileSubProps.test(candidate)) continue; // ignore File internal props
      const alias = aliases[candidate];
      if (
        !formPaths.some(
          (fp) =>
            fp.startsWith(candidate) ||
            fp.startsWith(alt) ||
            (alias ? fp.startsWith(alias) : false)
        )
      ) {
        missing.push(p);
      }
    }
    expect(missing).toEqual([]);
  });

  it("docDefinition -> types", () => {
    const generator = createGenerator({
      path: typePath,
      tsconfig: "tsconfig.json",
      type: typeName,
      skipTypeCheck: true,
    });
    const schema = generator.createSchema() as Definition;
    const typePaths = collectSchemaPaths(schema, typeName);
    const docPaths = collectDocPaths(docDefPath).filter((p) => !p.includes(".includes"));
    const missing: string[] = [];
    for (const p of docPaths) {
      const base = p.replace(/\[\]/g, "").replace(`${typeName}.`, "");
      const key = `${typeName}.${base}`;
      const alt = `${typeName}.${base.replace(/_/g, "-")}`;
      if (!typePaths.has(key) && !typePaths.has(alt)) missing.push(p);
    }
    expect(missing).toEqual([]);
  });
});
