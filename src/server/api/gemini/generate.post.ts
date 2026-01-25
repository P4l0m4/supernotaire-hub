export default defineEventHandler(async (event) => {
  const { GEMINI_KEY } = useRuntimeConfig(event);
  if (!GEMINI_KEY) {
    throw createError({ statusCode: 500, statusMessage: "gemini_key_missing" });
  }

  const body = await readBody<{ prompt?: string }>(event);
  const prompt = body?.prompt?.toString().trim();
  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: "prompt_required" });
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
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
        statusMessage: `gemini_http_${res.status}`,
      });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    return { text };
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw createError({ statusCode: 504, statusMessage: "gemini_timeout" });
    }
    if (e?.statusCode) throw e;
    throw createError({
      statusCode: 500,
      statusMessage: `gemini_fetch_failed:${String(e)}`,
    });
  } finally {
    clearTimeout(timeout);
  }
});
