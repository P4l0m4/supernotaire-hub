export default defineEventHandler(async (event) => {
  const { GEMINI_KEY } = useRuntimeConfig(event);
  if (!GEMINI_KEY) {
    throw createError({ statusCode: 500, statusMessage: "gemini_key_missing" });
  }

  const body = await readBody<{ text?: string }>(event);
  const text = body?.text?.toString() || "";
  if (!text.trim()) {
    throw createError({ statusCode: 400, statusMessage: "text_required" });
  }

  const payload = {
    content: { parts: [{ text }] },
    taskType: "RETRIEVAL_DOCUMENT",
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: `gemini_embed_http_${res.status}`,
      });
    }

    const data = await res.json();
    const emb =
      data?.embedding?.values || data?.data?.[0]?.embedding || [];
    if (!Array.isArray(emb) || emb.length === 0) {
      throw createError({
        statusCode: 502,
        statusMessage: "gemini_embed_empty",
      });
    }

    return { embedding: emb.map((v: any) => Number(v) || 0) };
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw createError({ statusCode: 504, statusMessage: "gemini_embed_timeout" });
    }
    if (e?.statusCode) throw e;
    throw createError({
      statusCode: 500,
      statusMessage: `gemini_embed_failed:${String(e)}`,
    });
  } finally {
    clearTimeout(timeout);
  }
});
