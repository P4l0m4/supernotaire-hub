const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://document-text-extractor-production.up.railway.app/api/documents/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  return result.taskId;
};

const checkStatus = async (taskId: string) => {
  try {
    const response = await fetch(
      `https://document-text-extractor-production.up.railway.app/api/tasks/${taskId}/status`
    );
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    const result = await response.json();
    console.log("Status response:", result);
    return result;
  } catch (error: any) {
    console.error("Status check error:", error);
    throw error;
  }
};

const getResults = async (taskId: string) => {
  try {
    const response = await fetch(
      `https://document-text-extractor-production.up.railway.app/api/tasks/${taskId}/result`
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
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`);
      progress++;

      const statusResponse = await checkStatus(taskId);
      status = statusResponse.status;

      if (status === "completed") {
        results = await getResults(taskId);
        progress = 100;
        console.log("Final results:", results);
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
  } finally {
    return { status, progress, error, results };
  }
};
