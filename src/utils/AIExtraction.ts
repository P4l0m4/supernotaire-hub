import { mergeGeneric } from "@/utils/merge";
import { selectTopKRelevantChunks } from "@/utils/rag";

function buildPrompt(documentName: string, TS_TYPE: string, textBlob: string) {
  const instr = `Réponds UNIQUEMENT par un JSON parsable qui satisfait exactement ce type TS (aucune clé en plus).
Si une information est manquante, met null. Aucun texte hors JSON. Pas de note. N'invente pas d'informations, si tu n'est pas sûr, met null. Commence par { et termine par }.

TYPE:
${TS_TYPE}`;
  const content = `${instr}\n\nDocument: ${documentName}\nTexte:\n"""${textBlob}"""`;
  console.debug("[extract] prompt chars:", content.length);
  return [{ role: "user", content }];
}

function extractJson(raw: string): any {
  const cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json|```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  // Cherche un bloc JSON équilibré { ... }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const candidate = cleaned.slice(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }
  throw new Error("json_block_not_found");
}

function chunkTextByTokens(s: string, targetTokens = 600, overlapTokens = 80) {
  const charsPerTok = 4; // approx.
  const maxChars = targetTokens * charsPerTok;
  const overlap = overlapTokens * charsPerTok;
  if (s.length <= maxChars) return [s];
  const out: string[] = [];
  for (let i = 0; i < s.length; i += maxChars - overlap) {
    out.push(s.slice(i, Math.min(s.length, i + maxChars)));
  }
  return out;
}

// DEDUPLICATION UTILITIES
function stableStringifySorted(o: any): string {
  if (o === null || typeof o !== "object") return JSON.stringify(o);
  if (Array.isArray(o)) return `[${o.map(stableStringifySorted).join(",")}]`;
  const keys = Object.keys(o).sort();
  return `{${keys
    .map((k) => JSON.stringify(k) + ":" + stableStringifySorted(o[k]))
    .join(",")}}`;
}

function hashDJB2Hex(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
}

function uniqueKeyHash(v: any): string {
  return hashDJB2Hex(stableStringifySorted(v));
}

//type is a json object with same structure as TS_TYPE
export async function AIExtractInfoFromText(
  textBlob: string,
  documentName: string,
  TS_TYPE: string
): Promise<{}> {
  if (!import.meta.client) throw new Error("client_only");

  // Try RAG selection first (auto-activated if GEMINI_KEY exists). If it fails, fallback to the
  // previous chunk+merge strategy for robustness.
  try {
    const query = `${documentName} -> Remplir ce type: ${TS_TYPE}`;
    const top = await selectTopKRelevantChunks(textBlob, query, 6, 600, 80);
    if (top && top.length > 0) {
      const context = top.map((t, i) => `[[CTX_${i} score=${t.score.toFixed(3)}]]\n${t.text}`).join("\n\n");
      console.log(`RAG selected ${top.length} chunks for extraction.`);
      return await extractWithGeminiClient(context, documentName, TS_TYPE);
    }
  } catch (e) {
    console.warn("RAG path failed, will fallback:", e);
  }

  // Fallback: original chunking + merge
  const parts = chunkTextByTokens(textBlob, 600, 80);
  if (!parts.length) throw new Error("empty_text");

  const concurrency = Math.min(4, (navigator as any)?.hardwareConcurrency || 2);
  console.log(`Chunking text into ${parts.length} parts for extraction (fallback).`);

  if (parts.length === 1) {
    return await extractWithGeminiClient(parts[0], documentName, TS_TYPE);
  }

  let acc: {} | null = null;
  for (let i = 0; i < parts.length; i += concurrency) {
    const batch = parts.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map((p) =>
        extractWithGeminiClient(p, documentName, TS_TYPE).catch((e) => {
          console.warn("chunk_failed", e);
          return null;
        })
      )
    );
    for (const piece of results) {
      if (!piece) continue;
      if (!acc) {
        acc = piece;
        continue;
      }
      acc = mergeGeneric(acc, piece, {
        restrictToKeysOfA: true,
        uniqueBy: uniqueKeyHash,
      });
    }
  }
  if (!acc) throw new Error("extraction_failed_all_chunks");
  console.log(`Merged ${parts.length} parts into one extraction result (fallback).`);
  return acc;
}

export async function extractDataFromResults(
  relevantPages: number[] = [],
  resultsFromTextExtraction: any,
  documentName: string,
  TS_TYPE: string
) {
  console.log("Extracting data from results...");
  let textFromRelevantPages;
  if (!resultsFromTextExtraction || !resultsFromTextExtraction.result)
    return null;
  if (relevantPages.length === 0) {
    textFromRelevantPages = resultsFromTextExtraction.result.summary
      .map((page: { pageText: string }) => page.pageText)
      .join("\n");
  } else {
    textFromRelevantPages = relevantPages
      .map((pageNumber) => {
        const page = resultsFromTextExtraction.result.summary.find(
          (p: { pageNumber: number }) => p.pageNumber === pageNumber
        );
        return page ? page.pageText : "";
      })
      .join("\n");
    console.log(`Using relevant pages`);
  }

  let AIExtractionResult;

  try {
    AIExtractionResult = await AIExtractInfoFromText(
      textFromRelevantPages,
      documentName,
      TS_TYPE
    );
    console.log("Extraction result:", AIExtractionResult);
  } catch (e: any) {
    console.error("Extraction error:", e);
  }
  console.log("Extraction finished:", AIExtractionResult);
  return AIExtractionResult;
}

async function extractWithGeminiClient(
  textBlob: string,
  documentName: string,
  TS_TYPE: string
): Promise<{}> {
  const key = useRuntimeConfig().public.GEMINI_KEY;
  if (!key) throw new Error("gemini_key_missing");

  const user = buildPrompt(documentName, TS_TYPE, textBlob)[0].content;

  const body: any = {
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json", // force JSON
    },
  };

  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 20000);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctl.signal,
    }
  )
    .catch((e) => {
      throw new Error(`gemini_fetch_failed:${String(e)}`);
    })
    .finally(() => clearTimeout(to));

  if (!res.ok) throw new Error(`gemini_http_${res.status}`);
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}"; // JSON en texte
  return extractJson(raw);
}
