type ProcessResult = {
  status: string;
  progress: number;
  error: string;
  results: any;
};

const TTL_MS = 30 * 60 * 1000; // 30 minutes
const cache = new Map<string, { value: ProcessResult; expiresAt: number }>();
const inflight = new Map<string, Promise<ProcessResult>>();

const fileSig = (file: File) => `${file.name}|${file.size}|${file.lastModified}`;

const readCached = (sig: string): ProcessResult | null => {
  const entry = cache.get(sig);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(sig);
    return null;
  }
  // shallow clone to avoid external mutation of cached object
  return { ...entry.value, results: entry.value.results };
};

const writeCache = (sig: string, value: ProcessResult) => {
  cache.set(sig, { value, expiresAt: Date.now() + TTL_MS });
};

export const clearDocumentCache = () => {
  cache.clear();
  inflight.clear();
};

const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://document-text-extractor-production.up.railway.app/api/documents/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();
  return result.taskId;
};

const checkStatus = async (taskId: string) => {
  try {
    const response = await fetch(
      `https://document-text-extractor-production.up.railway.app/api/tasks/${taskId}/status`,
    );
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Status check error:", error);
    throw error;
  }
};

const getResults = async (taskId: string) => {
  try {
    const response = await fetch(
      `https://document-text-extractor-production.up.railway.app/api/tasks/${taskId}/result`,
    );
    if (!response.ok) {
      throw new Error(`Result fetch failed: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Result fetch error:", error);
    throw error;
  }
};

export const processDocument = async (file: File) => {
  const sig = fileSig(file);
  const cached = readCached(sig);
  if (cached) return cached;

  const pending = inflight.get(sig);
  if (pending) return pending;

  const run = (async () => {
    let status = "not started";
    let progress = 0;
    let error = "";
    let results = null;

    try {
      const taskId = await uploadDocument(file);

      let attempts = 0;
      const maxAttempts = 30;
      progress = 10;

      while (attempts < maxAttempts) {
        progress++;

        const statusResponse = await checkStatus(taskId);
        status = statusResponse.status;

        if (status === "completed") {
          results = await getResults(taskId);
          progress = 100;

          break;
        } else if (status === "failed") {
          error = statusResponse.error || "Processing failed";
          console.error("Processing failed:", error);
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;
      }

      if (attempts >= maxAttempts && status !== "completed") {
        error = "Processing timeout - please try again";
        console.warn("Processing timeout");
      }
    } catch (e) {
      error = "Une erreur est survenue lors du traitement.";
      console.error("Error:", e);
    }

    const payload: ProcessResult = { status, progress, error, results };
    writeCache(sig, payload);
    return payload;
  })();

  inflight.set(sig, run);
  try {
    return await run;
  } finally {
    inflight.delete(sig);
  }
};
