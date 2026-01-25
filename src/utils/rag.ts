// Lightweight client-side RAG helpers using Gemini embeddings via server proxy when available.

function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embedOneGemini(text: string): Promise<number[]> {
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 15000);
  try {
    const res = await $fetch<{ embedding?: number[] }>("/api/gemini/embed", {
      method: "POST",
      body: { text },
      signal: ctl.signal,
    });
    const emb = res?.embedding || [];
    if (!Array.isArray(emb) || emb.length === 0) throw new Error("gemini_embed_empty");
    return emb.map((v: any) => Number(v) || 0);
  } finally {
    clearTimeout(to);
  }
}

export type RagSelection = { text: string; index: number; score: number }[];

export async function selectTopKRelevantChunks(
  fullText: string,
  query: string,
  k = 6,
  chunkTokens = 600,
  overlapTokens = 80
): Promise<RagSelection | null> {
  try {
    // Only runs on client; keep behavior server-safe by returning null.
    if (!import.meta.client) return null;

    // simple token-to-char heuristic (≈4 chars/token)
    const charsPerTok = 4;
    const size = chunkTokens * charsPerTok;
    const overlap = overlapTokens * charsPerTok;
    const chunks: string[] = [];
    for (let i = 0; i < fullText.length; i += size - overlap) {
      chunks.push(fullText.slice(i, Math.min(fullText.length, i + size)));
    }
    if (chunks.length === 0) return null;

    // embed query and chunks sequentially to avoid aggressive rate limits
    const qEmb = await embedOneGemini(query);
    const scored: RagSelection = [];
    for (let i = 0; i < chunks.length; i++) {
      const emb = await embedOneGemini(chunks[i]);
      const score = cosineSimilarity(qEmb, emb);
      scored.push({ text: chunks[i], index: i, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, Math.max(1, Math.min(k, scored.length)));
  } catch (e) {
    console.warn("RAG selection failed, falling back:", e);
    return null;
  }
}
