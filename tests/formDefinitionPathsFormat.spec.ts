import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const FORM_DEFINITION_DIR = path.resolve(
  process.cwd(),
  "src/utils/formDefinition",
);

const isAllowedPath = (p: string) =>
  /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*$/.test(p);

type FormField = {
  path: string;
  type?: string;
  itemSchema?: { fields?: FormField[] };
};

const collectPaths = (def: any): Array<{ path: string; file: string }> => {
  const collected: Array<{ path: string; file: string }> = [];
  const walkField = (field: FormField, file: string, prefix = "") => {
    const fullPath = prefix ? `${prefix}.${field.path}` : field.path;
    collected.push({ path: fullPath, file });

    if (field.type === "array" && field.itemSchema?.fields?.length) {
      field.itemSchema.fields.forEach((sub) =>
        walkField(sub, file, fullPath),
      );
    }
  };

  for (const section of def.sections || []) {
    for (const field of section.fields || []) {
      walkField(field, def.__file || "unknown");
    }
  }

  return collected;
};

describe("formDefinition paths format", () => {
  const formFiles = fs
    .readdirSync(FORM_DEFINITION_DIR)
    .filter((f) => f.endsWith(".json"));

  const allPaths: Array<{ path: string; file: string }> = [];

  for (const file of formFiles) {
    const abs = path.join(FORM_DEFINITION_DIR, file);
    const raw = fs.readFileSync(abs, "utf-8").replace(/^\uFEFF/, "");
    const parsed = JSON.parse(raw);
    parsed.__file = file;
    allPaths.push(...collectPaths(parsed));
  }

  it("all paths are lowercase without accents, digits, spaces or dashes", () => {
    const invalid = allPaths
      .filter(({ path }) => !isAllowedPath(path))
      .map(({ path, file }) => `${file}: ${path}`);
    expect(invalid).toEqual([]);
  });
});
