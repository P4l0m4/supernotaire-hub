import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";

const FORBIDDEN_SEQUENCES = ["Ã©", "Ã ", "Ã¨", "Ãê", "Ãë", "Ãî", "Ãô", "Ãû", "Ãç"];
const SKIP_DIRS = new Set(["node_modules", ".nuxt", "dist", ".git"]);

async function collectVueFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectVueFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".vue")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("Vue files encoding", () => {
  it("contains no common UTF-8 mojibake sequences", async () => {
    const root = path.resolve(__dirname, "..", "src");
    const vueFiles = await collectVueFiles(root);

    const hits: Array<{ file: string; sequence: string }> = [];

    for (const file of vueFiles) {
      const content = await fs.readFile(file, "utf8");
      for (const seq of FORBIDDEN_SEQUENCES) {
        if (content.includes(seq)) {
          hits.push({ file, sequence: seq });
        }
      }
    }

    const message =
      "Found mojibake sequences:\n" +
      hits.map((h) => `- ${h.file} => "${h.sequence}"`).join("\n");

    expect(hits, message).toHaveLength(0);
  });
});
