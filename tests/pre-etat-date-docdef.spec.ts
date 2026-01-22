import { describe, it, expect } from "vitest";
import { createGenerator } from "ts-json-schema-generator";
import type { JSONSchema7 } from "json-schema";
import fs from "node:fs";
import path from "node:path";

type Definition = JSONSchema7 & { definitions?: Record<string, JSONSchema7> };

const typePath = "src/types/pre-etat-date-complet.ts";
const typeName = "PreEtatDate";
const docDefPath = "src/utils/docDefinitions/pre-etat-date.ts";
const formDefinitionsDir = "src/utils/formDefinition/pre-etat-date";
const generatorPath = "src/components/Pre-etat-date/GenerateurPED.vue";
const routeSectionsPath = "src/pages/outils/pre-etat-date/[section].vue";

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

const loadMergedFormDefinition = () => {
  const dir = path.resolve(formDefinitionsDir);
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name);

  const sections: any[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.sections)) {
      sections.push(...parsed.sections);
    }
  }

  return {
    title: "Pre-etat date merged",
    sections,
  };
};

const parseSectionGroupKeys = (): string[] => {
  const content = fs.readFileSync(path.resolve(generatorPath), "utf8");
  const match = content.match(/const sectionGroups[^=]*=\s*{([\s\S]*?)};/);
  if (!match) return [];
  const body = match[1];
  const keys: string[] = [];
  for (const m of body.matchAll(/(\w+)\s*:/g)) {
    if (m[1]) keys.push(m[1]);
  }
  return keys;
};

const parseValidSectionsFromRoute = (): string[] => {
  const content = fs.readFileSync(path.resolve(routeSectionsPath), "utf8");
  const match = content.match(/const validSections\s*=\s*\[([\s\S]*?)\]/);
  if (!match) return [];
  const body = match[1];
  const vals: string[] = [];
  for (const m of body.matchAll(/"([^"]+)"/g)) {
    vals.push(m[1]);
  }
  return vals;
};

describe("Pre-etat date concordance across form/type/docDefinition", () => {
  const fileSubProps =
    /(\.|^)size$|(\.|^)type$|(\.|^)lastModified$|(\.|^)name$|(\.|^)webkitRelativePath$/;
  const aliases: Record<string, string> = {
    "documents.attestation_de_propriete": "documents.acte_de_propriete",
    "copropriete.fonds_travaux.existance": "copropriete.fonds_travaux_existance",
    "copropriete.fonds_travaux_existance": "copropriete.fonds_travaux.existance",
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
    const formPaths = collectFormPaths(loadMergedFormDefinition());
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

  it("section ids used in routes map to a form definition", () => {
    const sectionIds = new Set(parseSectionGroupKeys());
    const validSections = new Set(parseValidSectionsFromRoute());
    const missingInGroups: string[] = [];
    const extraGroups: string[] = [];

    validSections.forEach((id) => {
      if (!sectionIds.has(id)) missingInGroups.push(id);
    });
    sectionIds.forEach((id) => {
      if (!validSections.has(id)) extraGroups.push(id);
    });

    expect(missingInGroups).toEqual([]);
    expect(extraGroups).toEqual([]);
  });
});
